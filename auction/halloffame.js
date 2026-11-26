import fs from 'fs';
import os from 'os';
import path from 'path';

const CACHE_DIR = path.join(os.tmpdir(), 'ipl-hof-cache-v2');
const BASE_URL = 'https://iplhalloffame.com/';
const PLAYER_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const playerCache = new Map();
const inFlight = new Map();
let indexMap = null;
let indexFetchedAt = 0;
let indexInFlight = null;

function ensureDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {}
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

async function fetchText(url, timeoutMs = 4200) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,*/*'
      }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function getPlayersIndex() {
  if (indexMap && Date.now() - indexFetchedAt < PLAYER_CACHE_TTL_MS) {
    return indexMap;
  }
  if (indexInFlight) return indexInFlight;

  indexInFlight = (async () => {
    const html = await fetchText(`${BASE_URL}players/`, 5000);
    const map = new Map();
    if (html) {
      for (const m of html.matchAll(/<li[^>]*data-name="([^"]+)"[^>]*>[\s\S]*?<a[^>]*href="player\/([^"/]+)\/"/gi)) {
        const nameKey = normAlpha(m[1]);
        const slug = m[2].trim();
        if (nameKey && slug && !map.has(nameKey)) {
          map.set(nameKey, slug);
        }
      }
    }
    if (map.size > 0) {
      indexMap = map;
      indexFetchedAt = Date.now();
    }
    return indexMap || map;
  })().finally(() => {
    indexInFlight = null;
  });

  return indexInFlight;
}

function parseStatsFromHtml(html, player = {}) {
  if (!html) return null;
  const fallback = player.stats || {};
  const bodyStart = html.indexOf('<main') >= 0 ? html.indexOf('<main') : Math.max(0, html.indexOf('<body'));
  const navSplit = html.indexOf('How the Impact Score', bodyStart);
  const heroSlice = html.slice(bodyStart, navSplit > bodyStart ? navSplit : bodyStart + 4500);
  const text = heroSlice
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' | ')
    .replace(/(\s*\|\s*)+/g, ' | ');

  const readTile = (labelRe) => {
    const m = text.match(new RegExp(`\\|\\s*([\\d,]+(?:\\.\\d+)?)\\s*\\|\\s*${labelRe}\\s*\\|`, 'i'));
    if (!m) return null;
    const val = Number(m[1].replace(/,/g, ''));
    return Number.isFinite(val) ? val : null;
  };

  const matches = readTile('Matches');
  const runs = readTile('Runs');
  const wickets = readTile('Wickets');
  const strikeRate = readTile('Strike rate');
  const economy = readTile('Economy');
  const tileAvg = readTile('Average');

  const batAvgMatch = text.match(/batted at an average of ([\d.]+)/i);
  const isBowler = player.role === 'Bowler';
  const average = batAvgMatch ? Number(batAvgMatch[1]) : (!isBowler ? tileAvg : null);

  if (matches === null && runs === null && wickets === null) {
    return null;
  }

  return {
    matches: matches ?? fallback.matches ?? 0,
    runs: runs ?? fallback.runs ?? 0,
    strikeRate: strikeRate ?? fallback.strikeRate ?? 0,
    average: average ?? fallback.average ?? 0,
    wickets: wickets ?? fallback.wickets ?? 0,
    economy: economy ?? fallback.economy ?? 0
  };
}

function extractPhotoUrl(html) {
  if (!html) return null;
  const heroBlock = html.match(/class="pp-photo"[\s\S]{0,400}?<img[^>]*src="([^"]+)"/i)?.[1];
  if (!heroBlock || heroBlock.startsWith('data:')) return null;
  try {
    return new URL(heroBlock.replace(/&amp;/g, '&'), BASE_URL).href;
  } catch {
    return null;
  }
}

/**
 * Fetches official IPL career image URL and backup stats for a player from iplhalloffame.com.
 */
export async function fetchHallOfFamePlayer(player) {
  if (!player) return null;

  const mem = playerCache.get(player.id);
  if (mem && Date.now() - mem.fetchedAt < PLAYER_CACHE_TTL_MS) return mem;

  ensureDir();
  const cacheFile = path.join(CACHE_DIR, `${player.id}.json`);
  try {
    if (fs.existsSync(cacheFile)) {
      const disk = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      if (disk && Date.now() - disk.fetchedAt < PLAYER_CACHE_TTL_MS) {
        playerCache.set(player.id, disk);
        return disk;
      }
    }
  } catch {}

  if (inFlight.has(player.id)) return inFlight.get(player.id);

  const promise = (async () => {
    let data = null;
    try {
      const idx = await getPlayersIndex();
      const slug = idx.get(normAlpha(player.name)) || toSlug(player.name);
      const html = await fetchText(`${BASE_URL}player/${encodeURIComponent(slug)}/`, 4500);
      if (html) {
        data = {
          slug,
          imageUrl: extractPhotoUrl(html),
          stats: parseStatsFromHtml(html, player),
          fetchedAt: Date.now()
        };
      }
    } catch {}

    const result = data || { slug: null, imageUrl: null, stats: null, fetchedAt: Date.now() };
    playerCache.set(player.id, result);
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(result));
    } catch {}
    return result;
  })().finally(() => inFlight.delete(player.id));

  inFlight.set(player.id, promise);
  return promise;
}
