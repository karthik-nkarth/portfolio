import fs from 'fs';
import os from 'os';
import path from 'path';
import { fetchHallOfFamePlayer } from './halloffame.js';

const CACHE_DIR = path.join(os.tmpdir(), 'ipl-cricinfo-cache-v2');
const statsCache = new Map();
const inFlight = new Map();

function ensureDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {}
}

async function fetchText(url, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'IPL-Prime-Auction-Game/1.0 (https://knaray.com/auction_game)' }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseOverallRow(html) {
  if (!html) return null;
  const thead = html.match(/<tr class="head"[^>]*>([\s\S]*?)<\/tr>/i)?.[1];
  const row = html.match(/<tr class="data1"[^>]*>([\s\S]*?)<\/tr>/i)?.[1];
  if (!thead || !row) return null;

  const headers = [...thead.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  );
  const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  );

  const map = {};
  headers.forEach((h, i) => {
    if (h) map[h] = cells[i];
  });
  return map;
}

function num(v, fallback = 0) {
  const n = Number(String(v || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

export async function fetchCricinfoStats(player) {
  if (!player) return null;

  const mem = statsCache.get(player.id);
  if (mem && Date.now() - mem.fetchedAt < 24 * 60 * 60 * 1000) {
    return mem;
  }

  ensureDir();
  const cacheFile = path.join(CACHE_DIR, `${player.id}.json`);
  try {
    if (fs.existsSync(cacheFile)) {
      const disk = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      if (disk && Date.now() - disk.fetchedAt < 24 * 60 * 60 * 1000) {
        statsCache.set(player.id, disk);
        return disk;
      }
    }
  } catch {}

  if (inFlight.has(player.id)) return inFlight.get(player.id);

  const promise = (async () => {
    let updated = null;
    try {
      const searchHtml = await fetchText(
        `https://search.espncricinfo.com/ci/content/site/search.html?search=${encodeURIComponent(player.name)}`,
        3200
      );
      const idMatch = searchHtml?.match(/\/player\/([0-9]+)\.html|cricketers\/[a-z-]+-([0-9]+)/i);
      const cricId = idMatch?.[1] || idMatch?.[2];

      if (cricId) {
        const [batHtml, bowlHtml] = await Promise.all([
          fetchText(`https://stats.espncricinfo.com/ci/engine/player/${cricId}.html?class=6;template=results;type=batting`, 3500),
          fetchText(`https://stats.espncricinfo.com/ci/engine/player/${cricId}.html?class=6;template=results;type=bowling`, 3500)
        ]);

        const bat = parseOverallRow(batHtml);
        const bowl = parseOverallRow(bowlHtml);

        if (bat || bowl) {
          updated = {
            cricinfoId: cricId,
            source: 'espncricinfo',
            fetchedAt: Date.now(),
            stats: {
              matches: num(bat?.Mat || bowl?.Mat, player.stats.matches),
              runs: num(bat?.Runs, player.stats.runs),
              strikeRate: num(bat?.SR, player.stats.strikeRate),
              average: num(bat?.Ave, player.stats.average),
              wickets: num(bowl?.Wkts, player.stats.wickets),
              economy: num(bowl?.Econ, player.stats.economy)
            }
          };
        }
      }
    } catch {}

    if (!updated) {
      try {
        const hof = await fetchHallOfFamePlayer(player);
        if (hof?.stats) {
          updated = {
            cricinfoId: null,
            source: 'iplhalloffame',
            fetchedAt: Date.now(),
            stats: hof.stats
          };
        }
      } catch {}
    }

    const result = updated || {
      cricinfoId: null,
      source: 'database',
      fetchedAt: Date.now(),
      stats: player.stats
    };

    statsCache.set(player.id, result);
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(result));
    } catch {}
    return result;
  })().finally(() => inFlight.delete(player.id));

  inFlight.set(player.id, promise);
  return promise;
}
