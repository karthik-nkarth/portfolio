import { ALL_PLAYERS, buildGameAuctionPool, getLotSizeForTeamCount } from './players.js';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 7;
const STARTING_PURSE = 50000;
const MAX_SQUAD_SIZE = 12;
const MAX_OVERSEAS = 4;
const MIN_RESERVE_PER_SLOT = 300;
const IDLE_TIMER_MS = 120000;
const BID_TIMER_MS = 10000;
const LOT_RESULT_PAUSE_MS = 3300;
const COLLECTION = 'auction_rooms';

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

function getMaxBidAllowed(team) {
  const remainingSlotsAfterThis = Math.max(0, MAX_SQUAD_SIZE - team.squad.length - 1);
  return Math.max(0, team.purse - remainingSlotsAfterThis * MIN_RESERVE_PER_SLOT);
}

function isTeamEligibleForCurrentLot(room, team) {
  if (!room.currentPlayer) return false;
  if (team.quit) return false;
  if (team.squad.length >= MAX_SQUAD_SIZE) return false;
  if (room.currentPlayer.isOverseas && team.overseasCount >= MAX_OVERSEAS) return false;
  if (getMaxBidAllowed(team) < room.currentPlayer.basePrice) return false;
  return true;
}

function getEligibleTeams(room) {
  return room.teams.filter((t) => isTeamEligibleForCurrentLot(room, t));
}

function enterRoleSelection(room) {
  room.phase = 'ROLE_SELECTION';
  room.currentPlayer = null;
  room.idleEndsAt = null;
  room.timerEndsAt = null;
  room.lotResultEndsAt = null;
  room.highestBid = null;
  room.highestBidderId = null;

  for (const team of room.teams) {
    if (team.quit || team.squad.length === 0) {
      team.disqualified = true;
      team.roles = { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: true };
    } else {
      team.roles = { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: false };
    }
  }
}

function resolveCurrentLot(room, reason = 'Timer expired') {
  if (room.phase !== 'AUCTION' || !room.currentPlayer) return false;
  const player = room.currentPlayer;
  room.phase = 'LOT_RESULT';
  room.idleEndsAt = null;
  room.timerEndsAt = null;
  room.lotResultEndsAt = Date.now() + LOT_RESULT_PAUSE_MS;

  if (room.highestBidderId && room.highestBid !== null) {
    const winner = room.teams.find((t) => t.id === room.highestBidderId);
    if (winner) {
      winner.squad.push({ ...player, boughtPrice: room.highestBid, boughtRound: room.round });
      winner.purse -= room.highestBid;
      if (player.isOverseas) winner.overseasCount += 1;
      room.lastLotOutcome = {
        status: 'SOLD',
        player,
        price: room.highestBid,
        winnerTeamId: winner.id,
        winnerTeamName: winner.name,
        winnerBadge: winner.theme.badge,
        winnerColor: winner.theme.color,
        reason
      };
    }
  } else {
    if (room.round === 1) room.unsoldPool.push(player);
    room.lastLotOutcome = {
      status: 'UNSOLD',
      player,
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
  const allTeamsFull = activeTeams.length === 0 || activeTeams.every((t) => t.squad.length >= MAX_SQUAD_SIZE);
  if (allTeamsFull) {
    enterRoleSelection(room);
    return;
  }

  room.lotIndex += 1;
  if (room.lotIndex >= room.pool.length) {
    if (room.round === 1 && room.unsoldPool.length > 0) {
      room.round = 2;
      room.pool = [...room.unsoldPool];
      room.unsoldPool = [];
      room.lotIndex = 0;
    } else {
      enterRoleSelection(room);
      return;
    }
  }

  room.phase = 'AUCTION';
  room.currentPlayer = room.pool[room.lotIndex];
  room.highestBid = null;
  room.highestBidderId = null;
  room.bidCount = 0;
  room.idleEndsAt = Date.now() + IDLE_TIMER_MS;
  room.timerEndsAt = null;
  room.lotResultEndsAt = null;
  room.skippedTeamIds = [];
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
    if (room.timerEndsAt && now >= room.timerEndsAt) {
      if (resolveCurrentLot(room, '10-second countdown completed')) changed = true;
    } else if (!room.timerEndsAt && room.highestBid === null && room.idleEndsAt && now >= room.idleEndsAt) {
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
  const squad = team.squad || [];
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
        paceBowling: 0, spinBowling: 0, overallBalance: 0,
        captaincy: 0, wicketkeeping: 0, impactPlayer: 0, fieldingQuality: 0
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

  const topOrderBatting = avgTopN(squad.map((p) => p.ratings.topOrder), 3);
  const middleOrderBatting = avgTopN(squad.map((p) => p.ratings.middleOrder), 3);
  const lowerOrderBatting = avgTopN(squad.map((p) => p.ratings.lowerOrder), 3);
  const paceBowling = avgTopN(squad.map((p) => p.ratings.paceBowling), 3);
  const spinBowling = avgTopN(squad.map((p) => p.ratings.spinBowling), 2);

  const completeness = (Math.min(squad.length, MAX_SQUAD_SIZE) / MAX_SQUAD_SIZE) * 40;
  const pureOrAllPace = squad.filter((p) => p.ratings.paceBowling >= 70).length;
  const pureOrAllSpin = squad.filter((p) => p.ratings.spinBowling >= 70).length;
  const solidBatters = squad.filter((p) => p.ratings.batting >= 75).length;
  const allRounders = squad.filter((p) => p.role === 'All-Rounder').length;
  const keepers = squad.filter((p) => p.ratings.wicketkeeping >= 75).length;
  const hasLhb = squad.some((p) => p.battingStyle === 'LHB');
  const hasRhb = squad.some((p) => p.battingStyle === 'RHB');

  const balanceRaw = completeness + Math.min(15, solidBatters * 3) + Math.min(14, pureOrAllPace * 5) +
    Math.min(12, pureOrAllSpin * 6) + Math.min(9, allRounders * 4.5) + (keepers >= 1 ? 6 : 0) + (hasLhb && hasRhb ? 4 : 1);
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
    overallBalance, captaincy, wicketkeeping, impactPlayer, fieldingQuality
  };

  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const averageScore = Number((totalScore / 10).toFixed(1));
  const avgOverall = Math.round(squad.reduce((sum, p) => sum + p.ratings.overall, 0) / squad.length);

  const entries = [
    ['Top Order', topOrderBatting], ['Middle Order', middleOrderBatting], ['Lower Order', lowerOrderBatting],
    ['Pace Attack', paceBowling], ['Spin Attack', spinBowling], ['Balance', overallBalance],
    ['Captaincy', captaincy], ['Wicketkeeping', wicketkeeping], ['Impact Sub', impactPlayer], ['Fielding', fieldingQuality]
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

  return {
    version: room.version || 1,
    roomId: room.roomId,
    password: room.password,
    phase: room.phase,
    round: room.round,
    lotNumber: room.lotIndex >= 0 ? room.lotIndex + 1 : 0,
    totalLotsInRound: room.pool.length,
    unsoldCount: room.unsoldPool.length,
    totalDatabasePlayers: ALL_PLAYERS.length,
    currentPlayer: serializePlayerPublic(room.currentPlayer, revealRatings),
    highestBid: room.highestBid,
    highestBidderId: room.highestBidderId,
    highestBidderName: room.teams.find((t) => t.id === room.highestBidderId)?.name || null,
    bidCount: room.bidCount || 0,
    idleEndsAt: room.idleEndsAt || null,
    timerEndsAt: room.timerEndsAt || null,
    timerMsLeft: room.timerEndsAt ? Math.max(0, room.timerEndsAt - now) : null,
    lotResultEndsAt: room.lotResultEndsAt || null,
    skippedTeamIds: room.skippedTeamIds || [],
    bidHistory: room.bidHistory || [],
    lastLotOutcome: room.lastLotOutcome
      ? { ...room.lastLotOutcome, player: serializePlayerPublic(room.lastLotOutcome.player, revealRatings) }
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
      squadCount: t.squad.length, overseasCount: t.overseasCount,
      squad: t.squad.map((p) => serializePlayerPublic(p, revealRatings)),
      roles: t.roles, currentLotBid: t.currentLotBid, disqualified: Boolean(t.disqualified),
      skippedCurrent: skippedSet.has(t.id), eligibleForCurrent: isTeamEligibleForCurrentLot(room, t)
    }))
  };
}

export function createAuctionService(getDb) {
  async function runRoomTx(roomId, mutator) {
    const db = getDb();
    if (!db) {
      const room = memoryRooms.get(roomId);
      if (!room) return { error: 'Room not found.' };
      advanceTimeIfNeeded(room);
      const res = mutator(room);
      if (res?.error) return res;
      room.version = (room.version || 0) + 1;
      return { room };
    }

    const ref = db.collection(COLLECTION).doc(roomId);
    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return { error: 'Room not found.' };
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
  }

  async function createRoom({ hostName }) {
    const cleanName = String(hostName || '').trim().slice(0, 22);
    if (!cleanName) return { error: 'Please enter your team or manager name.' };

    const db = getDb();
    let roomId = generateFourDigitCode();
    if (db) {
      for (let i = 0; i < 10; i++) {
        const snap = await db.collection(COLLECTION).doc(roomId).get();
        if (!snap.exists) break;
        roomId = generateFourDigitCode();
      }
    } else {
      while (memoryRooms.has(roomId)) roomId = generateFourDigitCode();
    }

    const password = generateFourDigitCode();
    const teamId = generateToken();
    const room = {
      version: 1,
      roomId,
      password,
      hostTeamId: teamId,
      phase: 'LOBBY',
      round: 1,
      pool: [],
      unsoldPool: [],
      lotIndex: -1,
      currentPlayer: null,
      highestBid: null,
      highestBidderId: null,
      bidCount: 0,
      idleEndsAt: null,
      timerEndsAt: null,
      lotResultEndsAt: null,
      skippedTeamIds: [],
      bidHistory: [],
      lastLotOutcome: null,
      analysis: null,
      createdAt: Date.now(),
      teams: [{
        id: teamId, name: cleanName, isHost: true, quit: false,
        theme: { color: TEAM_THEMES[0].color, label: TEAM_THEMES[0].label, badge: makeTeamBadge(cleanName) },
        purse: STARTING_PURSE, squad: [], overseasCount: 0, currentLotBid: null, disqualified: false,
        roles: { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: false }
      }]
    };

    if (db) await db.collection(COLLECTION).doc(roomId).set(room);
    else memoryRooms.set(roomId, room);

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

      if (room.phase === 'AUCTION' && room.currentPlayer) {
        const skipped = new Set(room.skippedTeamIds || []);
        skipped.add(team.id);
        room.skippedTeamIds = Array.from(skipped);
        const eligible = getEligibleTeams(room);
        if (room.highestBid === null) {
          if (!eligible.some((t) => !skipped.has(t.id))) resolveCurrentLot(room, 'Remaining teams skipped');
        } else if (room.highestBidderId !== team.id) {
          const anyOther = eligible.some(
            (t) => t.id !== room.highestBidderId && !skipped.has(t.id) && getMaxBidAllowed(t) > room.highestBid
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

      room.pool = buildGameAuctionPool(getLotSizeForTeamCount(room.teams.length));
      room.unsoldPool = [];
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

  async function placeBid({ roomId, teamId, amount }) {
    return runRoomTx(roomId, (room) => {
      if (room.phase !== 'AUCTION' || !room.currentPlayer) return { error: 'Bidding is not active right now.' };
      const team = room.teams.find((t) => t.id === teamId);
      if (!team || team.quit) return { error: 'You are not active in this room.' };
      if ((room.skippedTeamIds || []).includes(team.id)) return { error: 'You already skipped this player.' };
      if (team.squad.length >= MAX_SQUAD_SIZE) return { error: 'Your 12-player squad is already full.' };
      if (room.currentPlayer.isOverseas && team.overseasCount >= MAX_OVERSEAS) {
        return { error: `Overseas limit reached (max ${MAX_OVERSEAS} overseas players).` };
      }
      if (room.highestBidderId === team.id) return { error: 'You already hold the highest bid!' };

      const val = Math.floor(Number(amount));
      if (!Number.isFinite(val) || val <= 0) return { error: 'Enter a valid positive bid amount.' };
      if (room.highestBid === null && val < room.currentPlayer.basePrice) {
        return { error: `Opening bid must be at least ₹${room.currentPlayer.basePrice.toLocaleString('en-IN')}.` };
      }
      if (room.highestBid !== null && val <= room.highestBid) {
        return { error: `Your bid must be higher than ₹${room.highestBid.toLocaleString('en-IN')}.` };
      }

      const maxAllowed = getMaxBidAllowed(team);
      if (val > maxAllowed) {
        const remainingSlots = Math.max(0, MAX_SQUAD_SIZE - team.squad.length - 1);
        return {
          error: `Cannot buy! Max bid limit reached (₹${maxAllowed.toLocaleString('en-IN')}) — you still need ${remainingSlots + 1} player${remainingSlots + 1 > 1 ? 's' : ''} (₹${MIN_RESERVE_PER_SLOT} reserve × ${remainingSlots} slots).`
        };
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
      const otherActive = getEligibleTeams(room).filter(
        (t) => t.id !== team.id && !skipped.has(t.id) && getMaxBidAllowed(t) > val
      );
      if (otherActive.length === 0) resolveCurrentLot(room, 'All other teams passed');
      return {};
    });
  }

  async function skipLot({ roomId, teamId }) {
    return runRoomTx(roomId, (room) => {
      if (room.phase !== 'AUCTION' || !room.currentPlayer) return { error: 'No active player to skip.' };
      const team = room.teams.find((t) => t.id === teamId);
      if (!team || team.quit) return { error: 'Team not found.' };
      if (room.highestBidderId === team.id) return { error: 'You cannot skip while you hold the highest bid!' };

      const skipped = new Set(room.skippedTeamIds || []);
      skipped.add(team.id);
      room.skippedTeamIds = Array.from(skipped);

      const eligible = getEligibleTeams(room);
      if (room.highestBid === null) {
        if (!eligible.some((t) => !skipped.has(t.id))) resolveCurrentLot(room, 'All teams skipped');
      } else {
        const anyOther = eligible.some(
          (t) => t.id !== room.highestBidderId && !skipped.has(t.id) && getMaxBidAllowed(t) > room.highestBid
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
      if (team.squad.length === 0) {
        team.disqualified = true;
        team.roles = { captainId: '', wicketkeeperId: '', impactPlayerId: '', confirmed: true };
        return {};
      }
      const has = (id) => id && team.squad.some((p) => p.id === id);
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

      const unconfirmed = room.teams.filter((t) => !t.quit && !t.disqualified && t.squad.length > 0 && !t.roles.confirmed);
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
      if (!room) return { error: 'Room not found.' };
      const changed = advanceTimeIfNeeded(room);
      if (!changed && clientVersion && Number(clientVersion) === room.version) return { unchanged: true };
      return { room };
    }

    const snap = await db.collection(COLLECTION).doc(roomId).get();
    if (!snap.exists) return { error: 'Room not found.' };
    const room = snap.data();
    const now = Date.now();
    const needsTimeAdvance =
      (room.phase === 'AUCTION' && ((room.timerEndsAt && now >= room.timerEndsAt) || (!room.timerEndsAt && room.highestBid === null && room.idleEndsAt && now >= room.idleEndsAt))) ||
      (room.phase === 'LOT_RESULT' && room.lotResultEndsAt && now >= room.lotResultEndsAt);

    if (needsTimeAdvance) {
      return runRoomTx(roomId, () => ({ noBump: true }));
    }
    if (clientVersion && Number(clientVersion) === room.version) {
      return { unchanged: true };
    }
    return { room };
  }

  return { createRoom, joinRoom, leaveRoom, startGame, placeBid, skipLot, submitRoles, analyzeTeams, getState };
}
