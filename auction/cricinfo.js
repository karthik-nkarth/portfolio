import fs from 'fs';
import os from 'os';
import path from 'path';
import { fetchHallOfFamePlayer } from './halloffame.js';

const CACHE_DIR = path.join(os.tmpdir(), 'ipl-cricinfo-cache-v3');
const statsCache = new Map();
const inFlight = new Map();

function ensureDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {}
}

/**
 * Resolves IPL-only career stats (strictly excluding international/other T20 leagues).
 */
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
      const hof = await fetchHallOfFamePlayer(player);
      if (hof?.stats && hof.stats.matches >= 15) {
        updated = {
          cricinfoId: null,
          source: 'iplhalloffame',
          fetchedAt: Date.now(),
          stats: hof.stats
        };
      }
    } catch {}

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
