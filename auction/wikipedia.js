import fs from 'fs';
import os from 'os';
import path from 'path';

const CACHE_DIR = path.join(os.tmpdir(), 'ipl-wiki-cache');
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

async function fetchWithTimeout(url, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'IPL-Prime-Auction-Game/1.0 (https://knaray.com/auction_game)',
        Accept: 'application/json,image/*,*/*'
      }
    });
  } finally {
    clearTimeout(timer);
  }
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
      const entry = { imageBuffer, contentType: meta.contentType || 'image/jpeg', fetchedAt: meta.fetchedAt || Date.now() };
      memoryCache.set(player.id, entry);
      return entry;
    }
  } catch {}

  if (inFlight.has(player.id)) return inFlight.get(player.id);

  const promise = (async () => {
    let imageBuffer = null;
    let contentType = 'image/jpeg';

    try {
      const title = encodeURIComponent(player.wikiTitle || player.name.replace(/\s+/g, '_'));
      const summaryRes = await fetchWithTimeout(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, 4000);
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        const imgUrl = data.thumbnail?.source || data.originalimage?.source;
        if (imgUrl) {
          const imgRes = await fetchWithTimeout(imgUrl, 5000);
          if (imgRes.ok) {
            imageBuffer = Buffer.from(await imgRes.arrayBuffer());
            contentType = imgRes.headers.get('content-type') || 'image/jpeg';
          }
        }
      }
    } catch {}

    const entry = { imageBuffer, contentType, fetchedAt: Date.now() };
    memoryCache.set(player.id, entry);

    try {
      fs.writeFileSync(diskMetaPath, JSON.stringify({ hasImage: Boolean(imageBuffer), contentType, fetchedAt: entry.fetchedAt }));
      if (imageBuffer) fs.writeFileSync(diskImgPath, imageBuffer);
    } catch {}

    return entry;
  })().finally(() => inFlight.delete(player.id));

  inFlight.set(player.id, promise);
  return promise;
}
