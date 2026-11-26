import fs from 'fs';
import os from 'os';
import path from 'path';

const CACHE_DIR = path.join(os.tmpdir(), 'ipl-wiki-cache-v2');
const memoryCache = new Map();
const inFlight = new Map();

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

async function fetchWithTimeout(url, timeoutMs = 4200, browserUa = false) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': browserUa
          ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
          : 'IPL-Prime-Auction-Game/1.0 (https://knaray.com/auction_game)',
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
  const res = await fetchWithTimeout(fullUrl, 4500, true);
  if (!res.ok) return null;
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) return null;
  return { imageBuffer: buf, contentType: ct };
}

async function tryWikipediaTitle(title) {
  if (!title) return null;
  const enc = encodeURIComponent(title.replace(/\s+/g, '_'));
  const sumRes = await fetchWithTimeout(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`, 3500);
  if (sumRes.ok) {
    const data = await sumRes.json();
    const imgUrl = data.thumbnail?.source || data.originalimage?.source;
    if (imgUrl && !/\.svg(\?|$)/i.test(imgUrl)) {
      const downloaded = await downloadImage(imgUrl);
      if (downloaded) return downloaded;
    }
  }

  const mlRes = await fetchWithTimeout(`https://en.wikipedia.org/api/rest_v1/page/media-list/${enc}`, 3500);
  if (mlRes.ok) {
    const ml = await mlRes.json();
    const items = (ml?.items || []).filter(
      (i) => i.type === 'image' && !/flag|icon|logo|cricket_ball|bat|pictogram|commons-logo|\.svg/i.test(i.title || '')
    );
    const src = items[0]?.srcset?.[0]?.src;
    if (src) {
      const downloaded = await downloadImage(src);
      if (downloaded) return downloaded;
    }
  }
  return null;
}

async function tryWikipediaSearch(name) {
  const srUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${name} cricketer`)}&srlimit=3&format=json`;
  const res = await fetchWithTimeout(srUrl, 3500);
  if (!res.ok) return null;
  const json = await res.json();
  for (const hit of json?.query?.search || []) {
    const found = await tryWikipediaTitle(hit.title);
    if (found) return found;
  }
  return null;
}

async function tryBingPortrait(name) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(`${name} IPL cricketer portrait`)}`;
  const res = await fetchWithTimeout(url, 4000, true);
  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/https:\/\/tse[0-9]+\.mm\.bing\.net\/th\/id\/[^"&\s<>]+|https:\/\/tse[0-9]+\.mm\.bing\.net\/th\?id=[^"&\s<>]+/);
  if (!match?.[0]) return null;
  return downloadImage(match[0]);
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
        const entry = { imageBuffer, contentType: meta.contentType || 'image/jpeg', fetchedAt: meta.fetchedAt || Date.now() };
        memoryCache.set(player.id, entry);
        return entry;
      }
    }
  } catch {}

  if (inFlight.has(player.id)) return inFlight.get(player.id);

  const promise = (async () => {
    let img = null;
    try {
      img = await tryWikipediaTitle(player.wikiTitle || player.name);
      if (!img) img = await tryWikipediaSearch(player.name);
      if (!img) img = await tryBingPortrait(player.name);
    } catch {}

    const entry = {
      imageBuffer: img?.imageBuffer || null,
      contentType: img?.contentType || 'image/jpeg',
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
