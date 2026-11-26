import fs from 'fs';
import os from 'os';
import path from 'path';
import { fetchHallOfFamePlayer } from './halloffame.js';

const CACHE_DIR = path.join(os.tmpdir(), 'ipl-official-headshots-v2');
const memoryCache = new Map();
const inFlight = new Map();

let cricbuzzIndex = null;
let cricbuzzFetchedAt = 0;
let cricbuzzInFlight = null;

const CRICBUZZ_TEAM_URLS = [
  'https://www.cricbuzz.com/cricket-team/chennai-super-kings/58/players',
  'https://www.cricbuzz.com/cricket-team/mumbai-indians/62/players',
  'https://www.cricbuzz.com/cricket-team/royal-challengers-bengaluru/59/players',
  'https://www.cricbuzz.com/cricket-team/kolkata-knight-riders/63/players',
  'https://www.cricbuzz.com/cricket-team/sunrisers-hyderabad/255/players',
  'https://www.cricbuzz.com/cricket-team/rajasthan-royals/64/players',
  'https://www.cricbuzz.com/cricket-team/delhi-capitals/61/players',
  'https://www.cricbuzz.com/cricket-team/punjab-kings/65/players',
  'https://www.cricbuzz.com/cricket-team/lucknow-super-giants/966/players',
  'https://www.cricbuzz.com/cricket-team/gujarat-titans/971/players',
  'https://www.cricbuzz.com/cricket-team/india/2/players',
  'https://www.cricbuzz.com/cricket-team/australia/4/players',
  'https://www.cricbuzz.com/cricket-team/england/9/players',
  'https://www.cricbuzz.com/cricket-team/south-africa/11/players',
  'https://www.cricbuzz.com/cricket-team/new-zealand/13/players',
  'https://www.cricbuzz.com/cricket-team/west-indies/10/players',
  'https://www.cricbuzz.com/cricket-team/sri-lanka/5/players',
  'https://www.cricbuzz.com/cricket-team/afghanistan/96/players',
  'https://www.cricbuzz.com/cricket-team/bangladesh/6/players'
];

function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {}
}

function getInitials(name) {
  const parts = String(name || 'PL').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function buildFallbackSvg(player) {
  const initials = getInitials(player?.name);
  const roleColors = {
    Batsman: ['#1e3a8a', '#3b82f6'],
    Bowler: ['#7f1d1d', '#ef4444'],
    'All-Rounder': ['#064e3b', '#10b981'],
    Wicketkeeper: ['#78350f', '#f59e0b']
  };
  const [c1, c2] = roleColors[player?.role] || ['#1e293b', '#64748b'];
  const roleLabel = (player?.role || 'PLAYER').toUpperCase();
  const country = (player?.country || '').toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="#090d1a"/></linearGradient></defs><rect width="320" height="320" fill="url(#bg)"/><circle cx="160" cy="118" r="52" fill="rgba(255,255,255,0.12)" stroke="${c2}" stroke-width="3"/><path d="M72 285 C72 215 248 215 248 285" fill="rgba(255,255,255,0.08)" stroke="${c2}" stroke-width="2.5"/><text x="160" y="134" text-anchor="middle" font-family="system-ui,sans-serif" font-size="40" font-weight="800" fill="#fff">${initials}</text><text x="160" y="265" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#f8fafc">${roleLabel}</text><text x="160" y="294" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">${country}</text></svg>`;
}

function normAlpha(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function toSlug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/['.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchWithTimeout(url, timeoutMs = 4200) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json,image/*,text/html,*/*'
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

async function downloadImage(imgUrl) {
  if (!imgUrl) return null;
  const fullUrl = imgUrl.startsWith('//') ? `https:${imgUrl}` : imgUrl;
  const res = await fetchWithTimeout(fullUrl, 4500);
  if (!res.ok) return null;
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) return null;
  return { imageBuffer: buf, contentType: ct };
}

async function tryEspnCricinfoHeadshot(player) {
  const srUrl = `https://site.web.api.espn.com/apis/common/v3/search?query=${encodeURIComponent(player.name)}&limit=6&type=player&sport=cricket`;
  const res = await fetchWithTimeout(srUrl, 3800);
  if (!res.ok) return null;
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : [];
  if (items.length === 0) return null;

  const targetNorm = normAlpha(player.name);
  const countryLower = String(player.country || '').toLowerCase();

  let chosen = items.find((item) => {
    if (normAlpha(item.displayName) !== targetNorm) return false;
    if (!countryLower || !Array.isArray(item.teamRelationships)) return true;
    return item.teamRelationships.some((tr) => String(tr.displayName || '').toLowerCase().includes(countryLower));
  });
  if (!chosen) {
    chosen = items.find((item) => normAlpha(item.displayName) === targetNorm);
  }
  if (!chosen?.id) return null;

  const candidates = [];
  if (chosen.headshot?.href && !/default-player-logo/i.test(chosen.headshot.href)) {
    candidates.push(chosen.headshot.href);
  }
  const canonicalUrl = `https://a.espncdn.com/i/headshots/cricket/players/full/${chosen.id}.png`;
  if (!candidates.includes(canonicalUrl)) {
    candidates.push(canonicalUrl);
  }

  for (const url of candidates) {
    const img = await downloadImage(url);
    if (img) return img;
  }
  return null;
}

async function getCricbuzzIndex() {
  if (cricbuzzIndex && Date.now() - cricbuzzFetchedAt < 12 * 60 * 60 * 1000) {
    return cricbuzzIndex;
  }
  if (cricbuzzInFlight) return cricbuzzInFlight;

  cricbuzzInFlight = (async () => {
    const map = new Map();
    await Promise.all(
      CRICBUZZ_TEAM_URLS.map(async (url) => {
        try {
          const res = await fetchWithTimeout(url, 4000);
          if (!res.ok) return;
          const html = await res.text();
          for (const m of html.matchAll(/https:\/\/static\.cricbuzz\.com\/a\/img\/v1\/i1\/(c\d+)\/([a-z0-9-]+)\.jpg/gi)) {
            const slug = m[2].toLowerCase();
            if (slug === 'i' || slug.includes('logo')) continue;
            const imgUrl = `https://static.cricbuzz.com/a/img/v1/300x300/i1/${m[1]}/${m[2]}.jpg`;
            if (!map.has(slug)) map.set(slug, imgUrl);
            const normKey = normAlpha(slug);
            if (!map.has(normKey)) map.set(normKey, imgUrl);
          }
        } catch {}
      })
    );
    if (map.size > 0) {
      cricbuzzIndex = map;
      cricbuzzFetchedAt = Date.now();
    }
    return cricbuzzIndex || map;
  })().finally(() => {
    cricbuzzInFlight = null;
  });

  return cricbuzzInFlight;
}

async function tryCricbuzzHeadshot(player) {
  const index = await getCricbuzzIndex();
  const slug = toSlug(player.name);
  const normKey = normAlpha(player.name);
  const url = index.get(slug) || index.get(normKey);
  if (!url) return null;
  return downloadImage(url);
}

async function tryHallOfFameHeadshot(player) {
  const hof = await fetchHallOfFamePlayer(player);
  if (!hof?.imageUrl) return null;
  return downloadImage(hof.imageUrl);
}

export async function fetchPlayerFromWikipedia(player) {
  if (!player) return null;

  const cachedMem = memoryCache.get(player.id);
  if (cachedMem && Date.now() - cachedMem.fetchedAt < 86400000) return cachedMem;

  ensureCacheDir();
  const diskImgPath = path.join(CACHE_DIR, `${player.id}.img`);
  const diskMetaPath = path.join(CACHE_DIR, `${player.id}.json`);

  try {
    if (fs.existsSync(diskMetaPath)) {
      const meta = JSON.parse(fs.readFileSync(diskMetaPath, 'utf8'));
      const imageBuffer = meta.hasImage && fs.existsSync(diskImgPath) ? fs.readFileSync(diskImgPath) : null;
      if (imageBuffer) {
        const entry = { imageBuffer, contentType: meta.contentType || 'image/png', fetchedAt: meta.fetchedAt || Date.now() };
        memoryCache.set(player.id, entry);
        return entry;
      }
    }
  } catch {}

  if (inFlight.has(player.id)) return inFlight.get(player.id);

  const promise = (async () => {
    let img = null;
    try {
      // Strictly fetch verified portraits from ESPNcricinfo, Cricbuzz, or IPL Hall of Fame backup
      img = await tryEspnCricinfoHeadshot(player);
      if (!img) img = await tryCricbuzzHeadshot(player);
      if (!img) img = await tryHallOfFameHeadshot(player);
    } catch {}

    const entry = {
      imageBuffer: img?.imageBuffer || null,
      contentType: img?.contentType || 'image/png',
      fetchedAt: Date.now()
    };
    memoryCache.set(player.id, entry);

    try {
      fs.writeFileSync(diskMetaPath, JSON.stringify({ hasImage: Boolean(entry.imageBuffer), contentType: entry.contentType, fetchedAt: entry.fetchedAt }));
      if (entry.imageBuffer) fs.writeFileSync(diskImgPath, entry.imageBuffer);
    } catch {}

    return entry;
  })().finally(() => inFlight.delete(player.id));

  inFlight.set(player.id, promise);
  return promise;
}
