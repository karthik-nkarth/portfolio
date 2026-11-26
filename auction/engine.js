import { ALL_PLAYERS, buildGameAuctionPool, getLotSizeForTeamCount } from './players.js';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 7;
const STARTING_PURSE = 50000;
const MAX_SQUAD_SIZE = 12;
const MAX_OVERSEAS = 4;
const MIN_RESERVE_PER_SLOT = 300;
const IDLE_TIMER_MS = 120000;
const BID_TIMER_MS = 10000;
const BID_GRACE_MS = 1200;
const LOT_RESULT_PAUSE_MS = 3300;
const COLLECTION = 'auction_rooms';

const PLAYER_MAP = new Map(ALL_PLAYERS.map((p) => [p.id, p]));

const TEAM_THEMES = [
  { color: '#f59e0b', label: 'Royal Gold' },
  { color: '#38bdf8', label: 'Electric Blue' },
  { color: '#a855f7', label: 'Imperial Purple' },
  { color: '#ef4444', label: 'Crimson Flame' },
  { color: '#10b981', label: 'Emerald Strike' },
  { color: '#f97316', label: 'Blaze Orange' },
  { color: '#ec4899', label: 'Neon Magenta' }
];

const memoryRooms = new Map();

function getPlayerById(idOrObj) {
  if (!idOrObj) return null;
  if (typeof idOrObj === 'string') return PLAYER_MAP.get(idOrObj) || null;
  return PLAYER_MAP.get(idOrObj.id) || idOrObj;
}

function hydrateSquadEntry(entry) {
  const base = getPlayerById(entry.id || entry);
  if (!base) return null;
  return {
    ...base,
    boughtPrice: entry.boughtPrice ?? 0,
    boughtRound: entry.boughtRound ?? 1
  };
}

function makeTeamBadge(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return words.slice(0, 3).map((w) => w[0].toUpperCase()).join('');
  return (words[0] || 'TM').slice(0, 3).toUpperCase();
}

function generateFourDigitCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function generateToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getMinIncrementForBidCount(bidCount) {
  if (bidCount >= 15) return 1000;
  if (bidCount >= 10) return 500;
  if (bidCount >= 5) return 200;
  return 100;
}

function getMaxBidAllowed(team) {
  const remainingSlotsAfterThis = Math.max(0, MAX_SQUAD_SIZE - (team.squad?.length || 0) - 1);
  return Math.max(0, team.purse - remainingSlotsAfterThis * MIN_RESERVE_PER_SLOT);
}

function isTeamEligibleForCurrentLot(room, team) {
  const cp = getPlayerById(room.currentPlayerId);
  if (!cp) return false;
  if (team.quit) return false;
  if ((team.squad?.length || 0) >= MAX_SQUAD_SIZE) return false;
  if (cp.isOverseas && team.overseasCount >= MAX_OVERSEAS) return false;
  if (getMaxBidAllowed(team) < cp.basePrice) return false;
  return true;
}

function getEligibleTeams(room) {
  return room.teams.filter((t) => isTeamEligibleForCurrentLot(room, t));
}

function enterRoleSelection(room) {
  room.phase = 'ROLE_SELECTION';
  room.currentPlayerId = null;
  room.idleEndsAt = null;
  room.timerEndsAt = null;
  room.lotResultEndsAt = null;
  room.highestBid = null;
  room.highestBidderId = null;

  for (const team of room.teams) {
    if (team.quit || (team.squad?.length || 0) === 0) {
      team.disqualified = true;
      team.roles = { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: true };
    } else {
      team.roles = { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: false };
    }
  }
}

function resolveCurrentLot(room, reason = 'Timer expired') {
  const player = getPlayerById(room.currentPlayerId);
  if (room.phase !== 'AUCTION' || !player) return false;
  room.phase = 'LOT_RESULT';
  room.idleEndsAt = null;
  room.timerEndsAt = null;
  room.lotResultEndsAt = Date.now() + LOT_RESULT_PAUSE_MS;

  if (room.highestBidderId && room.highestBid !== null) {
    const winner = room.teams.find((t) => t.id === room.highestBidderId);
    if (winner) {
      winner.squad.push({ id: player.id, boughtPrice: room.highestBid, boughtRound: room.round });
      winner.purse -= room.highestBid;
      if (player.isOverseas) winner.overseasCount += 1;
      room.lastLotOutcome = {
        status: 'SOLD',
        playerId: player.id,
        price: room.highestBid,
        winnerTeamId: winner.id,
        winnerTeamName: winner.name,
        winnerBadge: winner.theme.badge,
        winnerColor: winner.theme.color,
        reason
      };
    }
  } else {
    if (room.round === 1) room.unsoldIds.push(player.id);
    room.lastLotOutcome = {
      status: 'UNSOLD',
      playerId: player.id,
      price: 0,
      winnerTeamId: null,
      winnerTeamName: null,
      reason: room.round === 1 ? 'Moves to Round 2 (Final Chance)' : 'Remains Unsold'
    };
  }
  return true;
}

function advanceToNextLot(room) {
  const activeTeams = room.teams.filter((t) => !t.quit);
  const allTeamsFull = activeTeams.length === 0 || activeTeams.every((t) => (t.squad?.length || 0) >= MAX_SQUAD_SIZE);
  if (allTeamsFull) {
    enterRoleSelection(room);
    return;
  }

  room.lotIndex += 1;
  if (room.lotIndex >= (room.poolIds?.length || 0)) {
    if (room.round === 1 && (room.unsoldIds?.length || 0) > 0) {
      room.round = 2;
      room.poolIds = [...room.unsoldIds];
      room.unsoldIds = [];
      room.lotIndex = 0;
    } else {
      enterRoleSelection(room);
      return;
    }
  }

  const cpId = room.poolIds[room.lotIndex];
  const cp = getPlayerById(cpId);
  room.phase = 'AUCTION';
  room.currentPlayerId = cpId;
  room.highestBid = null;
  room.highestBidderId = null;
  room.bidCount = 0;
  room.idleEndsAt = Date.now() + IDLE_TIMER_MS;
  room.timerEndsAt = null;
  room.lotResultEndsAt = null;
  room.skippedTeamIds = room.teams
    .filter((t) =>
      t.quit ||
      (t.squad?.length || 0) >= MAX_SQUAD_SIZE ||
      (cp?.isOverseas && t.overseasCount >= MAX_OVERSEAS)
    )
    .map((t) => t.id);
  room.bidHistory = [];
  room.lastLotOutcome = null;
  for (const t of room.teams) t.currentLotBid = null;

  if (getEligibleTeams(room).length === 0) {
    resolveCurrentLot(room, 'No eligible bidder');
  }
}

function advanceTimeIfNeeded(room) {
  const now = Date.now();
  let changed = false;
  if (room.phase === 'AUCTION') {
    if (room.timerEndsAt && now >= room.timerEndsAt + BID_GRACE_MS) {
      if (resolveCurrentLot(room, '10-second countdown completed')) changed = true;
    } else if (!room.timerEndsAt && room.highestBid === null && room.idleEndsAt && now >= room.idleEndsAt + BID_GRACE_MS) {
      if (resolveCurrentLot(room, '2-minute display limit expired (no bids)')) changed = true;
    }
  }
  if (room.phase === 'LOT_RESULT' && room.lotResultEndsAt && now >= room.lotResultEndsAt) {
    advanceToNextLot(room);
    changed = true;
  }
  if (changed) room.version = (room.version || 0) + 1;
  return changed;
}

function scoreSingleTeam(team) {
  const squad = (team.squad || []).map(hydrateSquadEntry).filter(Boolean);
  if (team.quit || squad.length === 0) {
    return {
      teamId: team.id,
      teamName: team.name,
      badge: team.theme.badge,
      color: team.theme.color,
      squadCount: squad.length,
      overseasCount: team.overseasCount,
      remainingPurse: team.purse,
      disqualified: true,
      avgOverall: 0,
      roles: { captain: null, wicketkeeper: null, impactPlayer: null },
      scores: {
        topOrderBatting: 0, middleOrderBatting: 0, lowerOrderBatting: 0,
        paceBowling: 0, spinBowling: 0, allRounderAdvantage: 0, lrCombination: 0,
        overallBalance: 0, captaincy: 0, wicketkeeping: 0, impactPlayer: 0, fieldingQuality: 0
      },
      totalScore: 0,
      averageScore: 0,
      verdict: team.quit ? 'QUIT — Left the auction early.' : 'DISQUALIFIED — 0 players drafted during the auction.'
    };
  }

  const avgTopN = (arr, n) => {
    const sorted = [...arr].sort((a, b) => b - a);
    let sum = 0;
    for (let i = 0; i < n; i++) sum += sorted[i] ?? 20;
    return Math.round(sum / n);
  };

  const lhbBatters = squad.filter((p) => p.battingStyle === 'LHB' && (p.ratings.batting || 0) >= 68).length;
  const rhbBatters = squad.filter((p) => p.battingStyle === 'RHB' && (p.ratings.batting || 0) >= 68).length;
  const batComboMin = Math.min(lhbBatters, rhbBatters);
  const batComboPts = batComboMin >= 3 ? 50 : batComboMin === 2 ? 42 : batComboMin === 1 ? 28 : 10;

  const isLeftArmBowler = (p) => /left-arm|slow left/i.test(p.bowlingStyle || '');
  const activeBowlers = squad.filter((p) => Math.max(p.ratings.paceBowling || 0, p.ratings.spinBowling || 0) >= 65);
  const leftArmBowlers = activeBowlers.filter(isLeftArmBowler).length;
  const rightArmBowlers = activeBowlers.filter((p) => !isLeftArmBowler(p) && p.bowlingStyle && p.bowlingStyle !== 'None').length;
  const bowlComboMin = Math.min(leftArmBowlers, rightArmBowlers);
  const bowlComboPts = bowlComboMin >= 2 ? 50 : bowlComboMin === 1 ? 36 : 12;
  const lrCombination = Math.min(100, batComboPts + bowlComboPts);

  const batComboBoost = batComboMin >= 2 ? 3 : batComboMin === 1 ? 1 : 0;
  const paceComboBoost = activeBowlers.some((p) => p.ratings.paceBowling >= 70 && isLeftArmBowler(p)) &&
    activeBowlers.some((p) => p.ratings.paceBowling >= 70 && !isLeftArmBowler(p)) ? 4 : 0;
  const spinComboBoost = activeBowlers.some((p) => p.ratings.spinBowling >= 70 && isLeftArmBowler(p)) &&
    activeBowlers.some((p) => p.ratings.spinBowling >= 70 && !isLeftArmBowler(p)) ? 4 : 0;

  const topOrderBatting = Math.min(100, avgTopN(squad.map((p) => p.ratings.topOrder), 3) + batComboBoost);
  const middleOrderBatting = Math.min(100, avgTopN(squad.map((p) => p.ratings.middleOrder), 3) + batComboBoost);
  const lowerOrderBatting = avgTopN(squad.map((p) => p.ratings.lowerOrder), 3);
  const paceBowling = Math.min(100, avgTopN(squad.map((p) => p.ratings.paceBowling), 3) + paceComboBoost);
  const spinBowling = Math.min(100, avgTopN(squad.map((p) => p.ratings.spinBowling), 2) + spinComboBoost);

  const twoWayAllRounders = squad
    .map((p) => {
      const bestBowl = Math.max(p.ratings.paceBowling || 0, p.ratings.spinBowling || 0);
      const bat = p.ratings.batting || 0;
      const isTrueAR = p.role === 'All-Rounder' || (bat >= 58 && bestBowl >= 58);
      if (!isTrueAR) return 0;
      return Math.min(bat, bestBowl) * 0.55 + ((bat + bestBowl) / 2) * 0.45;
    })
    .filter((v) => v > 0)
    .sort((a, b) => b - a);

  const arTop3Avg = twoWayAllRounders.length > 0
    ? (twoWayAllRounders.slice(0, 3).reduce((s, v) => s + v, 0) / 3)
    : 15;
  const arDepthBonus = Math.min(18, twoWayAllRounders.length * 5);
  const allRounderAdvantage = Math.min(100, Math.round(arTop3Avg * 0.85 + arDepthBonus));

  const completeness = (Math.min(squad.length, MAX_SQUAD_SIZE) / MAX_SQUAD_SIZE) * 38;
  const pureOrAllPace = squad.filter((p) => p.ratings.paceBowling >= 70).length;
  const pureOrAllSpin = squad.filter((p) => p.ratings.spinBowling >= 70).length;
  const solidBatters = squad.filter((p) => p.ratings.batting >= 75).length;
  const keepers = squad.filter((p) => p.ratings.wicketkeeping >= 75).length;

  const balanceRaw = completeness + Math.min(14, solidBatters * 2.8) + Math.min(13, pureOrAllPace * 4.5) +
    Math.min(11, pureOrAllSpin * 5.5) + Math.min(9, twoWayAllRounders.length * 4) + (keepers >= 1 ? 6 : 0) +
    (batComboMin >= 1 ? 4 : 0) + (bowlComboMin >= 1 ? 5 : 0);
  const overallBalance = Math.min(100, Math.round(balanceRaw));

  const captain = squad.find((p) => p.id === team.roles.captainId) || squad[0];
  const captaincy = Math.min(100, Math.round(captain.ratings.captaincy * 0.85 + captain.ratings.overall * 0.15));

  const keeper = squad.find((p) => p.id === team.roles.wicketkeeperId) || squad[0];
  const wicketkeeping = Math.min(100, Math.round(keeper.ratings.wicketkeeping * 0.78 + keeper.ratings.batting * 0.22));

  const impactPl = squad.find((p) => p.id === team.roles.impactPlayerId) || squad[0];
  const impactPlayer = Math.min(100, Math.round(impactPl.ratings.impact * 0.78 + impactPl.ratings.overall * 0.22));

  const fieldingQuality = avgTopN(squad.map((p) => p.ratings.fielding), Math.min(11, squad.length));

  const scores = {
    topOrderBatting, middleOrderBatting, lowerOrderBatting, paceBowling, spinBowling,
    allRounderAdvantage, lrCombination, overallBalance, captaincy, wicketkeeping, impactPlayer, fieldingQuality
  };

  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const averageScore = Number((totalScore / 12).toFixed(1));
  const avgOverall = Math.round(squad.reduce((sum, p) => sum + p.ratings.overall, 0) / squad.length);

  const entries = [
    ['Top Order', topOrderBatting], ['Middle Order', middleOrderBatting], ['Lower Order', lowerOrderBatting],
    ['Pace Attack', paceBowling], ['Spin Attack', spinBowling], ['All-Rounders', allRounderAdvantage],
    ['L/R Combo', lrCombination], ['Balance', overallBalance], ['Captaincy', captaincy],
    ['Wicketkeeping', wicketkeeping], ['Impact Sub', impactPlayer], ['Fielding', fieldingQuality]
  ].sort((a, b) => b[1] - a[1]);

  return {
    teamId: team.id,
    teamName: team.name,
    badge: team.theme.badge,
    color: team.theme.color,
    squadCount: squad.length,
    overseasCount: team.overseasCount,
    remainingPurse: team.purse,
    disqualified: false,
    avgOverall,
    roles: {
      captain: captain ? { id: captain.id, name: captain.name } : null,
      wicketkeeper: keeper ? { id: keeper.id, name: keeper.name } : null,
      impactPlayer: impactPl ? { id: impactPl.id, name: impactPl.name } : null
    },
    scores,
    totalScore,
    averageScore,
    verdict: `Strengths: ${entries[0][0]} (${entries[0][1]}) & ${entries[1][0]} (${entries[1][1]}). Watch out: ${entries[entries.length - 1][0]} (${entries[entries.length - 1][1]}).`
  };
}

function serializePlayerPublic(player, includeRatings = false) {
  if (!player) return null;
  const base = {
    id: player.id, name: player.name, country: player.country, isOverseas: player.isOverseas,
    era: player.era, role: player.role, battingStyle: player.battingStyle, bowlingStyle: player.bowlingStyle,
    stats: player.stats, basePrice: player.basePrice, boughtPrice: player.boughtPrice ?? null, boughtRound: player.boughtRound ?? null
  };
  if (includeRatings) {
    base.ratings = player.ratings;
    base.battingPosition = player.battingPosition;
    base.bowlingType = player.bowlingType;
  }
  return base;
}

export function serializeRoom(room, viewerTeamId = null) {
  const now = Date.now();
  const revealRatings = room.phase === 'ANALYZED';
  const skippedSet = new Set(room.skippedTeamIds || []);
  const cp = getPlayerById(room.currentPlayerId);
  const outcomePlayer = room.lastLotOutcome ? getPlayerById(room.lastLotOutcome.playerId) : null;

  return {
    version: room.version || 1,
    serverNow: now,
    roomId: room.roomId,
    password: room.password,
    phase: room.phase,
    round: room.round,
    lotNumber: room.lotIndex >= 0 ? room.lotIndex + 1 : 0,
    totalLotsInRound: room.poolIds?.length || 0,
    unsoldCount: room.unsoldIds?.length || 0,
    totalDatabasePlayers: ALL_PLAYERS.length,
    currentPlayer: serializePlayerPublic(cp, revealRatings),
    highestBid: room.highestBid,
    highestBidderId: room.highestBidderId,
    highestBidderName: room.teams.find((t) => t.id === room.highestBidderId)?.name || null,
    bidCount: room.bidCount || 0,
    minIncrement: getMinIncrementForBidCount(room.bidCount || 0),
    idleEndsAt: room.idleEndsAt || null,
    timerEndsAt: room.timerEndsAt || null,
    timerMsLeft: room.timerEndsAt ? Math.max(0, room.timerEndsAt - now) : null,
    lotResultEndsAt: room.lotResultEndsAt || null,
    skippedTeamIds: room.skippedTeamIds || [],
    bidHistory: room.bidHistory || [],
    lastLotOutcome: room.lastLotOutcome
      ? { ...room.lastLotOutcome, player: serializePlayerPublic(outcomePlayer, revealRatings) }
      : null,
    analysis: room.analysis,
    viewerTeamId,
    recommendedLotSize: getLotSizeForTeamCount(room.teams.length),
    rules: {
      startingPurse: STARTING_PURSE, maxSquadSize: MAX_SQUAD_SIZE, maxOverseas: MAX_OVERSEAS,
      minReservePerSlot: MIN_RESERVE_PER_SLOT, bidTimerSeconds: BID_TIMER_MS / 1000,
      idleTimerSeconds: IDLE_TIMER_MS / 1000, minPlayers: MIN_PLAYERS, maxPlayers: MAX_PLAYERS
    },
    teams: room.teams.map((t) => ({
      id: t.id, name: t.name, isHost: t.isHost, connected: !t.quit, quit: Boolean(t.quit), theme: t.theme,
      purse: t.purse, maxBidAllowed: getMaxBidAllowed(t),
      squadCount: t.squad?.length || 0, overseasCount: t.overseasCount,
      squad: (t.squad || []).map((e) => serializePlayerPublic(hydrateSquadEntry(e), revealRatings)).filter(Boolean),
      roles: t.roles, currentLotBid: t.currentLotBid, disqualified: Boolean(t.disqualified),
      skippedCurrent: skippedSet.has(t.id), eligibleForCurrent: isTeamEligibleForCurrentLot(room, t)
    }))
  };
}

export function createAuctionService(getDb) {
  const roomCache = new Map();
  const roomListeners = new Map();
  const timeAdvanceInFlight = new Map();
  let quotaCooldownUntil = 0;

  const isQuotaError = (err) =>
    err?.code === 8 || /quota|resource_exhausted/i.test(err?.message || '');

  function cacheRoom(room) {
    if (!room?.roomId) return;
    const copy = structuredClone(room);
    memoryRooms.set(room.roomId, copy);
    roomCache.set(room.roomId, { room: copy, cachedAt: Date.now() });
  }

  function ensureListener(db, roomId) {
    if (!db || Date.now() < quotaCooldownUntil) return;
    const existing = roomListeners.get(roomId);
    if (existing) {
      existing.lastAccess = Date.now();
      return;
    }
    try {
      const ref = db.collection(COLLECTION).doc(roomId);
      const unsub = ref.onSnapshot(
        (snap) => {
          if (snap.exists) cacheRoom(snap.data());
        },
        (err) => {
          if (isQuotaError(err)) quotaCooldownUntil = Date.now() + 120000;
          try { unsub(); } catch {}
          roomListeners.delete(roomId);
        }
      );
      roomListeners.set(roomId, { unsub, lastAccess: Date.now() });
      for (const [id, entry] of roomListeners.entries()) {
        if (Date.now() - entry.lastAccess > 120000) {
          try { entry.unsub(); } catch {}
          roomListeners.delete(id);
        }
      }
    } catch {}
  }

  async function runRoomTx(roomId, mutator) {
    const db = getDb();
    if (!db) {
      const room = memoryRooms.get(roomId);
      if (!room) return { error: 'Room not found.', status: 404 };
      advanceTimeIfNeeded(room);
      const res = mutator(room);
      if (res?.error) return res;
      if (!res?.noBump) room.version = (room.version || 0) + 1;
      cacheRoom(room);
      return { room };
    }

    if (Date.now() < quotaCooldownUntil) {
      return {
        error: 'Database daily quota reached (resets at midnight PT / ~1:30 PM IST). Upgrade to Blaze or try after reset.',
        status: 503,
        quotaExceeded: true
      };
    }

    const ref = db.collection(COLLECTION).doc(roomId);
    try {
      const out = await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists) return { error: 'Room not found.', status: 404 };
        const room = snap.data();
        const timeChanged = advanceTimeIfNeeded(room);
        const res = mutator(room);
        if (res?.error) {
          if (timeChanged) tx.set(ref, room);
          return res;
        }
        if (!res?.noBump) room.version = (room.version || 0) + 1;
        if (!res?.noBump || timeChanged) tx.set(ref, room);
        return { room };
      });
      if (out?.room) {
        cacheRoom(out.room);
        ensureListener(db, roomId);
      }
      return out;
    } catch (err) {
      if (isQuotaError(err)) {
        quotaCooldownUntil = Date.now() + 30000;
        return {
          error: 'Database daily quota reached (resets at midnight PT / ~1:30 PM IST). Upgrade to Blaze or try after reset.',
          status: 503,
          quotaExceeded: true
        };
      }
      throw err;
    }
  }

  async function createRoom({ hostName }) {
    const cleanName = String(hostName || '').trim().slice(0, 22);
    if (!cleanName) return { error: 'Please enter your team or manager name.' };

    const db = getDb();
    const password = generateFourDigitCode();
    const teamId = generateToken();
    const makeRoomObj = (roomId) => ({
      version: 1,
      roomId,
      password,
      hostTeamId: teamId,
      phase: 'LOBBY',
      round: 1,
      poolIds: [],
      unsoldIds: [],
      lotIndex: -1,
      currentPlayerId: null,
      highestBid: null,
      highestBidderId: null,
      bidCount: 0,
      idleEndsAt: null,
      timerEndsAt: null,
      lotResultEndsAt: null,
      skippedTeamIds: [],
      bidHistory: [],
      recentActionIds: [],
      lastLotOutcome: null,
      analysis: null,
      createdAt: Date.now(),
      teams: [{
        id: teamId, name: cleanName, isHost: true, quit: false,
        theme: { color: TEAM_THEMES[0].color, label: TEAM_THEMES[0].label, badge: makeTeamBadge(cleanName) },
        purse: STARTING_PURSE, squad: [], overseasCount: 0, currentLotBid: null, disqualified: false,
        roles: { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: false }
      }]
    });

    let room = null;
    if (db) {
      if (Date.now() < quotaCooldownUntil) {
        return {
          error: 'Database daily quota reached (resets at midnight PT / ~1:30 PM IST). Upgrade to Blaze or try after reset.',
          status: 503,
          quotaExceeded: true
        };
      }
      for (let i = 0; i < 6; i++) {
        const candidateId = generateFourDigitCode();
        const candidate = makeRoomObj(candidateId);
        try {
          if (typeof db.collection(COLLECTION).doc(candidateId).create === 'function') {
            await db.collection(COLLECTION).doc(candidateId).create(candidate);
          } else {
            const snap = await db.collection(COLLECTION).doc(candidateId).get();
            if (snap.exists) continue;
            await db.collection(COLLECTION).doc(candidateId).set(candidate);
          }
          room = candidate;
          ensureListener(db, candidateId);
          break;
        } catch (err) {
          if (err?.code === 6) continue;
          if (isQuotaError(err)) {
            quotaCooldownUntil = Date.now() + 30000;
            return {
              error: 'Database daily quota reached (resets at midnight PT / ~1:30 PM IST). Upgrade to Blaze or try after reset.',
              status: 503,
              quotaExceeded: true
            };
          }
          throw err;
        }
      }
    } else {
      let candidateId = generateFourDigitCode();
      while (memoryRooms.has(candidateId)) candidateId = generateFourDigitCode();
      room = makeRoomObj(candidateId);
    }

    if (!room) return { error: 'Could not allocate room ID. Please try again.', status: 503 };
    cacheRoom(room);
    return { room, teamId };
  }

  async function joinRoom({ roomId, password, teamName, reconnectToken }) {
    const cleanRoomId = String(roomId || '').trim();
    const cleanPass = String(password || '').trim();
    const cleanName = String(teamName || '').trim().slice(0, 22);

    let assignedTeamId = null;
    const out = await runRoomTx(cleanRoomId, (room) => {
      if (room.password !== cleanPass) return { error: 'Incorrect 4-digit Room Password.' };
      let existing = reconnectToken ? room.teams.find((t) => t.id === reconnectToken && !t.quit) : null;
      if (!existing && cleanName) {
        existing = room.teams.find((t) => t.name.toLowerCase() === cleanName.toLowerCase() && !t.quit);
      }
      if (existing && (reconnectToken === existing.id || room.phase === 'LOBBY')) {
        assignedTeamId = existing.id;
        return { noBump: true };
      }
      if (!cleanName) return { error: 'Please enter your team or manager name.' };
      if (room.phase !== 'LOBBY') return { error: 'Auction has already started in this room.' };
      if (room.teams.length >= MAX_PLAYERS) return { error: `Room is full (maximum ${MAX_PLAYERS} teams allowed).` };
      if (room.teams.some((t) => t.name.toLowerCase() === cleanName.toLowerCase() && !t.quit)) {
        return { error: 'A team with that name is already in the room.' };
      }

      const themeBase = TEAM_THEMES[room.teams.length % TEAM_THEMES.length];
      assignedTeamId = generateToken();
      room.teams.push({
        id: assignedTeamId, name: cleanName, isHost: false, quit: false,
        theme: { color: themeBase.color, label: themeBase.label, badge: makeTeamBadge(cleanName) },
        purse: STARTING_PURSE, squad: [], overseasCount: 0, currentLotBid: null, disqualified: false,
        roles: { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: false }
      });
      return {};
    });

    if (out.error) return out;
    return { room: out.room, teamId: assignedTeamId };
  }

  async function leaveRoom({ roomId, teamId }) {
    return runRoomTx(roomId, (room) => {
      const idx = room.teams.findIndex((t) => t.id === teamId);
      if (idx === -1) return { noBump: true };

      if (room.phase === 'LOBBY') {
        const wasHost = room.teams[idx].isHost;
        room.teams.splice(idx, 1);
        if (wasHost && room.teams.length > 0) {
          room.teams[0].isHost = true;
          room.hostTeamId = room.teams[0].id;
        }
        return {};
      }

      const team = room.teams[idx];
      team.quit = true;
      team.disqualified = true;
      team.roles = { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: true };
      if (team.isHost) {
        team.isHost = false;
        const nextHost = room.teams.find((t) => !t.quit);
        if (nextHost) {
          nextHost.isHost = true;
          room.hostTeamId = nextHost.id;
        }
      }

      if (room.phase === 'AUCTION' && room.currentPlayerId) {
        const skipped = new Set(room.skippedTeamIds || []);
        skipped.add(team.id);
        room.skippedTeamIds = Array.from(skipped);
        const eligible = getEligibleTeams(room);
        if (room.highestBid === null) {
          if (!eligible.some((t) => !skipped.has(t.id))) resolveCurrentLot(room, 'Remaining teams skipped');
        } else if (room.highestBidderId !== team.id) {
          const nextMin = getMinIncrementForBidCount(room.bidCount || 0);
          const anyOther = eligible.some(
            (t) => t.id !== room.highestBidderId && !skipped.has(t.id) && getMaxBidAllowed(t) >= room.highestBid + nextMin
          );
          if (!anyOther) resolveCurrentLot(room, 'All remaining opponents passed');
        }
      }
      return {};
    });
  }

  async function startGame({ roomId, teamId }) {
    return runRoomTx(roomId, (room) => {
      const sender = room.teams.find((t) => t.id === teamId);
      if (!sender?.isHost) return { error: 'Only the room host can start the auction.' };
      if (room.phase !== 'LOBBY') return { error: 'Game has already started.' };
      if (room.teams.length < MIN_PLAYERS) return { error: `At least ${MIN_PLAYERS} teams are required to start.` };

      const sampled = buildGameAuctionPool(getLotSizeForTeamCount(room.teams.length));
      room.poolIds = sampled.map((p) => p.id);
      room.unsoldIds = [];
      room.round = 1;
      room.lotIndex = -1;
      room.analysis = null;
      for (const t of room.teams) {
        t.disqualified = false;
        t.currentLotBid = null;
      }
      advanceToNextLot(room);
      return {};
    });
  }

  async function placeBid({ roomId, teamId, amount, actionId }) {
    return runRoomTx(roomId, (room) => {
      if (actionId && (room.recentActionIds || []).includes(actionId)) {
        return { noBump: true };
      }
      const cp = getPlayerById(room.currentPlayerId);
      if (room.phase !== 'AUCTION' || !cp) return { error: 'Bidding is not active right now.' };
      const team = room.teams.find((t) => t.id === teamId);
      if (!team || team.quit) return { error: 'You are not active in this room.' };
      if ((room.skippedTeamIds || []).includes(team.id)) return { error: 'You already skipped this player.' };
      if ((team.squad?.length || 0) >= MAX_SQUAD_SIZE) return { error: 'Your 12-player squad is already full.' };
      if (cp.isOverseas && team.overseasCount >= MAX_OVERSEAS) {
        return { error: `Overseas limit reached (max ${MAX_OVERSEAS} overseas players).` };
      }
      if (room.highestBidderId === team.id) return { error: 'You already hold the highest bid!' };

      const val = Math.floor(Number(amount));
      if (!Number.isFinite(val) || val <= 0) return { error: 'Invalid bid amount.' };
      if (room.highestBid === null && val < cp.basePrice) {
        return { error: `Opening bid must be at least ₹${cp.basePrice.toLocaleString('en-IN')}.` };
      }
      if (room.highestBid !== null) {
        const minInc = getMinIncrementForBidCount(room.bidCount || 0);
        if (val < room.highestBid + minInc) {
          return { error: `Minimum increment at this stage is +₹${minInc.toLocaleString('en-IN')} (next min ₹${(room.highestBid + minInc).toLocaleString('en-IN')}).` };
        }
      }

      const maxAllowed = getMaxBidAllowed(team);
      if (val > maxAllowed) {
        const remainingSlots = Math.max(0, MAX_SQUAD_SIZE - (team.squad?.length || 0) - 1);
        return {
          error: `Cannot buy! Max bid limit reached (₹${maxAllowed.toLocaleString('en-IN')}) — you still need ${remainingSlots + 1} player${remainingSlots + 1 > 1 ? 's' : ''} (₹${MIN_RESERVE_PER_SLOT} reserve × ${remainingSlots} slots).`
        };
      }

      if (actionId) {
        room.recentActionIds = [actionId, ...(room.recentActionIds || [])].slice(0, 30);
      }

      team.currentLotBid = val;
      room.highestBid = val;
      room.highestBidderId = team.id;
      room.bidCount = (room.bidCount || 0) + 1;
      room.idleEndsAt = null;
      room.timerEndsAt = Date.now() + BID_TIMER_MS;
      room.bidHistory = [
        { teamId: team.id, teamName: team.name, badge: team.theme.badge, color: team.theme.color, amount: val, timestamp: Date.now() },
        ...(room.bidHistory || [])
      ].slice(0, 12);

      const skipped = new Set(room.skippedTeamIds || []);
      const nextMin = getMinIncrementForBidCount(room.bidCount);
      const otherActive = getEligibleTeams(room).filter(
        (t) => t.id !== team.id && !skipped.has(t.id) && getMaxBidAllowed(t) >= val + nextMin
      );
      if (otherActive.length === 0) resolveCurrentLot(room, 'All other teams passed');
      return {};
    });
  }

  async function skipLot({ roomId, teamId, actionId }) {
    return runRoomTx(roomId, (room) => {
      if (actionId && (room.recentActionIds || []).includes(actionId)) {
        return { noBump: true };
      }
      if (room.phase !== 'AUCTION' || !room.currentPlayerId) return { error: 'No active player to skip.' };
      const team = room.teams.find((t) => t.id === teamId);
      if (!team || team.quit) return { error: 'Team not found.' };
      if (room.highestBidderId === team.id) return { error: 'You cannot skip while you hold the highest bid!' };

      if (actionId) {
        room.recentActionIds = [actionId, ...(room.recentActionIds || [])].slice(0, 30);
      }

      const skipped = new Set(room.skippedTeamIds || []);
      skipped.add(team.id);
      room.skippedTeamIds = Array.from(skipped);

      const eligible = getEligibleTeams(room);
      if (room.highestBid === null) {
        if (!eligible.some((t) => !skipped.has(t.id))) resolveCurrentLot(room, 'All teams skipped');
      } else {
        const nextMin = getMinIncrementForBidCount(room.bidCount || 0);
        const anyOther = eligible.some(
          (t) => t.id !== room.highestBidderId && !skipped.has(t.id) && getMaxBidAllowed(t) >= room.highestBid + nextMin
        );
        if (!anyOther) resolveCurrentLot(room, 'All opponents passed');
      }
      return {};
    });
  }

  async function submitRoles({ roomId, teamId, captainId, wicketkeeperId, impactPlayerId }) {
    return runRoomTx(roomId, (room) => {
      if (room.phase !== 'ROLE_SELECTION') return { error: 'Role selection is not open.' };
      const team = room.teams.find((t) => t.id === teamId);
      if (!team) return { error: 'Team not found.' };
      if ((team.squad?.length || 0) === 0) {
        team.disqualified = true;
        team.roles = { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: true };
        return {};
      }
      const has = (id) => id && team.squad.some((p) => (p.id || p) === id);
      if (!has(captainId) || !has(wicketkeeperId) || !has(impactPlayerId)) {
        return { error: 'Please manually select Captain, Wicketkeeper, and Impact Player from your squad.' };
      }
      if (team.squad.length >= 3 && (impactPlayerId === captainId || impactPlayerId === wicketkeeperId)) {
        return { error: 'Impact Player (12th man) must be different from Captain and Wicketkeeper.' };
      }
      team.roles = { captainId, wicketkeeperId, impactPlayerId, confirmed: true };
      return {};
    });
  }

  async function analyzeTeams({ roomId, teamId }) {
    return runRoomTx(roomId, (room) => {
      if (room.phase !== 'ROLE_SELECTION') return { error: 'Auction must finish before analyzing teams.' };
      if (!room.teams.some((t) => t.id === teamId)) return { error: 'Unauthorized.' };

      const unconfirmed = room.teams.filter((t) => !t.quit && !t.disqualified && (t.squad?.length || 0) > 0 && !t.roles.confirmed);
      if (unconfirmed.length > 0) {
        return { error: `Waiting for ${unconfirmed.map((t) => t.name).join(', ')} to manually choose and lock in Captain, WK & Impact Player.` };
      }

      const evaluated = room.teams.map(scoreSingleTeam);
      evaluated.sort((a, b) => {
        if (a.disqualified !== b.disqualified) return a.disqualified ? 1 : -1;
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return b.avgOverall - a.avgOverall;
      });
      evaluated.forEach((entry, idx) => {
        entry.rank = idx + 1;
        entry.isWinner = idx === 0 && !entry.disqualified;
      });

      const winner = evaluated.find((e) => e.isWinner) || null;
      room.analysis = {
        generatedAt: Date.now(),
        winnerTeamId: winner?.teamId || null,
        winnerTeamName: winner?.teamName || 'No Qualified Winner',
        criteriaLabels: [
          { key: 'topOrderBatting', label: 'Top-Order Batting' },
          { key: 'middleOrderBatting', label: 'Middle-Order Batting' },
          { key: 'lowerOrderBatting', label: 'Lower-Order Batting' },
          { key: 'paceBowling', label: 'Pace Bowling' },
          { key: 'spinBowling', label: 'Spin Bowling' },
          { key: 'allRounderAdvantage', label: 'All-Rounder Advantage' },
          { key: 'lrCombination', label: 'L/R Bat & Bowl Combo' },
          { key: 'overallBalance', label: 'Team Balance' },
          { key: 'captaincy', label: 'Captaincy' },
          { key: 'wicketkeeping', label: 'Wicketkeeper' },
          { key: 'impactPlayer', label: 'Impact Player' },
          { key: 'fieldingQuality', label: 'Fielding Quality' }
        ],
        standings: evaluated
      };
      room.phase = 'ANALYZED';
      return {};
    });
  }

  async function getState({ roomId, clientVersion }) {
    const db = getDb();
    if (!db) {
      const room = memoryRooms.get(roomId);
      if (!room) return { error: 'Room not found.', status: 404 };
      const changed = advanceTimeIfNeeded(room);
      if (changed) cacheRoom(room);
      if (!changed && clientVersion && Number(clientVersion) === room.version) return { unchanged: true };
      return { room };
    }

    if (Date.now() < quotaCooldownUntil) {
      return {
        error: 'Database daily quota reached (resets at midnight PT / ~1:30 PM IST).',
        status: 503,
        quotaExceeded: true
      };
    }

    let room = null;
    const cached = roomCache.get(roomId);
    const hasListener = roomListeners.has(roomId);

    if (cached && (hasListener || Date.now() - cached.cachedAt < 1000)) {
      room = cached.room;
      ensureListener(db, roomId);
    } else {
      try {
        const snap = await db.collection(COLLECTION).doc(roomId).get();
        if (!snap.exists) return { error: 'Room not found.', status: 404 };
        room = snap.data();
        cacheRoom(room);
        ensureListener(db, roomId);
      } catch (err) {
        if (isQuotaError(err)) {
          quotaCooldownUntil = Date.now() + 30000;
          return {
            error: 'Database daily quota reached (resets at midnight PT / ~1:30 PM IST).',
            status: 503,
            quotaExceeded: true
          };
        }
        throw err;
      }
    }

    const now = Date.now();
    const needsTimeAdvance =
      (room.phase === 'AUCTION' && ((room.timerEndsAt && now >= room.timerEndsAt + BID_GRACE_MS) || (!room.timerEndsAt && room.highestBid === null && room.idleEndsAt && now >= room.idleEndsAt + BID_GRACE_MS))) ||
      (room.phase === 'LOT_RESULT' && room.lotResultEndsAt && now >= room.lotResultEndsAt);

    if (needsTimeAdvance) {
      if (!timeAdvanceInFlight.has(roomId)) {
        const p = runRoomTx(roomId, () => ({ noBump: true })).finally(() => {
          timeAdvanceInFlight.delete(roomId);
        });
        timeAdvanceInFlight.set(roomId, p);
      }
      return timeAdvanceInFlight.get(roomId);
    }
    if (clientVersion && Number(clientVersion) === room.version) {
      return { unchanged: true };
    }
    return { room };
  }

  return { createRoom, joinRoom, leaveRoom, startGame, placeBid, skipLot, submitRoles, analyzeTeams, getState };
}
