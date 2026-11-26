import express from 'express';
import { ALL_PLAYERS } from './players.js';
import { createAuctionService, serializeRoom } from './engine.js';
import { fetchPlayerFromWikipedia, buildFallbackSvg } from './wikipedia.js';
import { fetchCricinfoStats } from './cricinfo.js';

const PLAYER_MAP = new Map(ALL_PLAYERS.map((p) => [p.id, p]));

export function createAuctionRouter(getDb) {
  const router = express.Router();
  const service = createAuctionService(getDb);

  router.get('/health', (_req, res) => {
    res.json({ ok: true, databasePlayers: ALL_PLAYERS.length });
  });

  router.get('/player-image/:id', async (req, res) => {
    const player = PLAYER_MAP.get(req.params.id);
    if (!player) {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.status(404).send(buildFallbackSvg({ name: 'IPL', role: 'Batsman', country: 'INDIA' }));
    }
    try {
      const wikiData = await fetchPlayerFromWikipedia(player);
      if (wikiData?.imageBuffer) {
        res.setHeader('Content-Type', wikiData.contentType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(wikiData.imageBuffer);
      }
    } catch {}
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(buildFallbackSvg(player));
  });

  router.get('/player-stats/:id', async (req, res) => {
    const player = PLAYER_MAP.get(req.params.id);
    if (!player) return res.status(404).json({ ok: false, error: 'Player not found' });
    const data = await fetchCricinfoStats(player);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json({ ok: true, id: player.id, source: data.source, stats: data.stats });
  });

  router.post('/create', async (req, res) => {
    try {
      const result = await service.createRoom({ hostName: req.body?.hostName });
      if (result.error) return res.status(400).json({ ok: false, error: result.error });
      res.json({ ok: true, teamId: result.teamId, state: serializeRoom(result.room, result.teamId) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to create room.' });
    }
  });

  router.post('/join', async (req, res) => {
    try {
      const result = await service.joinRoom(req.body || {});
      if (result.error) return res.status(400).json({ ok: false, error: result.error });
      res.json({ ok: true, teamId: result.teamId, state: serializeRoom(result.room, result.teamId) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to join room.' });
    }
  });

  router.post('/leave', async (req, res) => {
    try {
      await service.leaveRoom(req.body || {});
      res.json({ ok: true });
    } catch {
      res.status(500).json({ ok: false });
    }
  });

  router.get('/state', async (req, res) => {
    try {
      const { roomId, teamId, v } = req.query;
      const result = await service.getState({ roomId, clientVersion: v });
      if (result.error) return res.status(404).json({ ok: false, error: result.error });
      if (result.unchanged) return res.json({ ok: true, unchanged: true });
      res.json({ ok: true, state: serializeRoom(result.room, teamId || null) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to load room state.' });
    }
  });

  router.post('/start', async (req, res) => {
    try {
      const result = await service.startGame(req.body || {});
      if (result.error) return res.status(400).json({ ok: false, error: result.error });

      const firstBatch = (result.room.pool || []).slice(0, 2);
      await Promise.race([
        Promise.all(firstBatch.map((p) => fetchCricinfoStats(p).then((r) => { if (r?.stats) p.stats = r.stats; }))),
        new Promise((resolve) => setTimeout(resolve, 1800))
      ]);

      res.json({ ok: true, state: serializeRoom(result.room, req.body?.teamId) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to start auction.' });
    }
  });

  router.post('/bid', async (req, res) => {
    try {
      const result = await service.placeBid(req.body || {});
      if (result.error) return res.status(400).json({ ok: false, error: result.error });
      res.json({ ok: true, state: serializeRoom(result.room, req.body?.teamId) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to place bid.' });
    }
  });

  router.post('/skip', async (req, res) => {
    try {
      const result = await service.skipLot(req.body || {});
      if (result.error) return res.status(400).json({ ok: false, error: result.error });
      res.json({ ok: true, state: serializeRoom(result.room, req.body?.teamId) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to skip lot.' });
    }
  });

  router.post('/roles/submit', async (req, res) => {
    try {
      const result = await service.submitRoles(req.body || {});
      if (result.error) return res.status(400).json({ ok: false, error: result.error });
      res.json({ ok: true, state: serializeRoom(result.room, req.body?.teamId) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to save roles.' });
    }
  });

  router.post('/analyze', async (req, res) => {
    try {
      const result = await service.analyzeTeams(req.body || {});
      if (result.error) return res.status(400).json({ ok: false, error: result.error });
      res.json({ ok: true, state: serializeRoom(result.room, req.body?.teamId) });
    } catch {
      res.status(500).json({ ok: false, error: 'Failed to analyze teams.' });
    }
  });

  return router;
}
