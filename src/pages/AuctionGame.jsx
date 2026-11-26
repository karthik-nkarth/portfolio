import React, { useEffect, useRef, useState } from 'react';
import './AuctionGame.css';

const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

function formatClock(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function AvatarIcon({ color, isHost, label }) {
  return (
    <div className="ag-avatar" style={{ background: color }}>
      {label ? (
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>{label}</span>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          {isHost ? (
            <path d="M5 16L3 7l5.5 4L12 5l3.5 6L21 7l-2 9H5zm0 2h14v2H5v-2z" />
          ) : (
            <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
          )}
        </svg>
      )}
    </div>
  );
}

function WoodMalletSvg() {
  return (
    <svg viewBox="0 0 150 110" width="132" height="96" aria-hidden="true">
      <defs>
        <linearGradient id="agWoodHead" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9a5b2d" />
          <stop offset="45%" stopColor="#6b3714" />
          <stop offset="100%" stopColor="#3e1d08" />
        </linearGradient>
        <linearGradient id="agWoodHandle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b77944" />
          <stop offset="55%" stopColor="#7c421b" />
          <stop offset="100%" stopColor="#4a230b" />
        </linearGradient>
        <linearGradient id="agWoodBlock" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b4d22" />
          <stop offset="55%" stopColor="#5c2e10" />
          <stop offset="100%" stopColor="#331706" />
        </linearGradient>
        <linearGradient id="agBrass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
      <ellipse cx="64" cy="96" rx="46" ry="7" fill="rgba(0,0,0,0.45)" />
      <path d="M26 84 L102 84 L108 94 L20 94 Z" fill="url(#agWoodBlock)" stroke="#3e1d08" strokeWidth="1.5" />
      <ellipse cx="64" cy="84" rx="38" ry="6" fill="#9a5b2d" stroke="#5c2e10" strokeWidth="1.5" />
      <circle className="ag-impact-ring" cx="64" cy="83" r="8" fill="none" stroke="#fde68a" strokeWidth="2" />
      <g className="ag-mallet-arm">
        <rect x="64" y="25" width="70" height="8" rx="4" fill="url(#agWoodHandle)" stroke="#3e1d08" strokeWidth="1" />
        <ellipse cx="132" cy="29" rx="4" ry="5" fill="#7c421b" stroke="#3e1d08" strokeWidth="1" />
        <rect x="74" y="24" width="6" height="10" rx="1" fill="url(#agBrass)" />
        <rect x="44" y="13" width="32" height="32" rx="5" fill="url(#agWoodHead)" stroke="#3e1d08" strokeWidth="1.5" />
        <rect x="40" y="16" width="5" height="26" rx="2" fill="#b77944" stroke="#3e1d08" strokeWidth="1" />
        <rect x="75" y="16" width="5" height="26" rx="2" fill="#b77944" stroke="#3e1d08" strokeWidth="1" />
        <rect x="56" y="13" width="8" height="32" fill="url(#agBrass)" opacity="0.9" />
      </g>
    </svg>
  );
}

function loadSavedSnapshot() {
  try {
    const raw = localStorage.getItem('ipl_room_snapshot');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.roomId ? parsed : null;
  } catch {
    return null;
  }
}

export default function AuctionGame() {
  const [state, setState] = useState(() => loadSavedSnapshot());
  const [teamId, setTeamId] = useState(() => localStorage.getItem('ipl_team_id') || sessionStorage.getItem('ipl_team_id') || null);
  const [roomId, setRoomId] = useState(() => localStorage.getItem('ipl_room_id') || sessionStorage.getItem('ipl_room_id') || null);
  const [reconnecting, setReconnecting] = useState(false);
  const [hostName, setHostName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPin, setJoinPin] = useState('');
  const [joinName, setJoinName] = useState('');
  const [landingErr, setLandingErr] = useState('');
  const [bidErr, setBidErr] = useState('');
  const [roleErr, setRoleErr] = useState('');
  const [inspectedId, setInspectedId] = useState(null);
  const [modalTeam, setModalTeam] = useState(null);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [mobTab, setMobTab] = useState('stage');
  const [soundOn, setSoundOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSyncingBid, setIsSyncingBid] = useState(false);
  const [nowServerMs, setNowServerMs] = useState(() => Date.now());
  const [liveStatsMap, setLiveStatsMap] = useState({});
  const [rolesDraft, setRolesDraft] = useState({ captainId: '', wicketkeeperId: '', impactPlayerId: '' });

  const audioRef = useRef(null);
  const confettiRef = useRef(null);
  const lastLotKeyRef = useRef(null);
  const lastBidCountRef = useRef(0);
  const lastOutcomeKeyRef = useRef(null);
  const lastBeepSecRef = useRef(null);
  const versionRef = useRef(state?.version || 0);
  const mutatingRef = useRef(false);
  const serverOffsetRef = useRef(0);
  const guardActiveRef = useRef(false);

  function syncClock(serverNow, reqStartMs, reqEndMs) {
    if (!serverNow) return;
    const midpoint = (reqStartMs + reqEndMs) / 2;
    const sampleOffset = serverNow - midpoint;
    serverOffsetRef.current = serverOffsetRef.current === 0
      ? sampleOffset
      : serverOffsetRef.current * 0.6 + sampleOffset * 0.4;
    setNowServerMs(Date.now() + serverOffsetRef.current);
  }

  function playTone(freq, dur, type = 'sine', vol = 0.07) {
    if (!soundOn) return;
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  }

  function playWoodMallet(accent = 1) {
    if (!soundOn) return;
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.connect(ctx.destination);

      const b1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      b1.type = 'sine';
      b1.frequency.setValueAtTime(340, now);
      b1.frequency.exponentialRampToValueAtTime(165, now + 0.045);
      g1.gain.setValueAtTime(0.42 * accent, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      b1.connect(g1);
      g1.connect(filter);
      b1.start(now);
      b1.stop(now + 0.085);

      const b2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      b2.type = 'sine';
      b2.frequency.setValueAtTime(580, now);
      b2.frequency.exponentialRampToValueAtTime(290, now + 0.032);
      g2.gain.setValueAtTime(0.24 * accent, now);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      b2.connect(g2);
      g2.connect(filter);
      b2.start(now);
      b2.stop(now + 0.06);

      const bufSize = Math.floor(ctx.sampleRate * 0.025);
      const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.28));
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(980, now);
      bp.Q.setValueAtTime(2.6, now);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.55 * accent, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.026);
      noise.connect(bp);
      bp.connect(ng);
      ng.connect(ctx.destination);
      noise.start(now);
    } catch {}
  }

  function playSoldSequence() {
    playWoodMallet(0.85);
    setTimeout(() => playWoodMallet(0.95), 980);
    setTimeout(() => playWoodMallet(1.15), 1530);
    setTimeout(() => {
      playTone(523.25, 0.14, 'triangle', 0.08);
      setTimeout(() => playTone(783.99, 0.24, 'triangle', 0.09), 110);
    }, 1880);
  }

  async function apiPost(path, body) {
    const t0 = Date.now();
    const res = await fetch(`/api/auction${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    const t1 = Date.now();
    if (data?.state?.serverNow) syncClock(data.state.serverNow, t0, t1);
    return data;
  }

  function saveSnapshot(next) {
    try {
      localStorage.setItem('ipl_room_snapshot', JSON.stringify(next));
    } catch {}
  }

  function clearSavedGame() {
    try {
      localStorage.removeItem('ipl_room_id');
      localStorage.removeItem('ipl_team_id');
      localStorage.removeItem('ipl_room_snapshot');
      sessionStorage.removeItem('ipl_room_id');
      sessionStorage.removeItem('ipl_team_id');
    } catch {}
  }

  function applyNewState(next, nextTeamId = null, force = false) {
    if (!next) return;
    if (!force && next.version && next.version < versionRef.current) return;
    versionRef.current = next.version || 0;
    setState(next);
    setReconnecting(false);
    saveSnapshot(next);
    if (nextTeamId) {
      setTeamId(nextTeamId);
      localStorage.setItem('ipl_team_id', nextTeamId);
    }
    if (next.roomId) {
      setRoomId(next.roomId);
      localStorage.setItem('ipl_room_id', next.roomId);
    }
  }

  useEffect(() => {
    if (!state) {
      guardActiveRef.current = false;
      return;
    }
    if (!guardActiveRef.current) {
      window.history.pushState({ agGuard: true }, '', window.location.href);
      guardActiveRef.current = true;
    }
    const onPopState = () => {
      window.history.pushState({ agGuard: true }, '', window.location.href);
      setShowQuitModal(true);
    };
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [Boolean(state)]);

  useEffect(() => {
    if (!roomId || !teamId || state?.phase === 'ANALYZED') return;
    let alive = true;
    let timerId = null;
    let failCount = 0;

    async function scheduleNext(customMs = null) {
      if (!alive) return;
      const baseMs = state?.phase === 'AUCTION' || state?.phase === 'LOT_RESULT' ? 750 : 1800;
      const waitMs = customMs ?? baseMs;
      timerId = setTimeout(runPoll, waitMs);
    }

    async function runPoll() {
      if (!alive) return;
      if (mutatingRef.current) return scheduleNext(400);
      const t0 = Date.now();
      try {
        const res = await fetch(
          `/api/auction/state?roomId=${encodeURIComponent(roomId)}&teamId=${encodeURIComponent(teamId)}&v=${versionRef.current}`
        );
        if (res.status === 404) {
          clearSavedGame();
          if (alive) {
            setState(null);
            setRoomId(null);
            setTeamId(null);
          }
          return;
        }
        const data = await res.json();
        const t1 = Date.now();
        if (!alive || mutatingRef.current) return scheduleNext();
        if (!res.ok || !data.ok) {
          failCount += 1;
          setReconnecting(true);
          return scheduleNext(Math.min(6000, 1500 * failCount));
        }
        failCount = 0;
        setReconnecting(false);
        if (data.state?.serverNow) syncClock(data.state.serverNow, t0, t1);
        if (!data.unchanged && data.state) {
          applyNewState(data.state);
        }
        scheduleNext();
      } catch {
        failCount += 1;
        if (alive) setReconnecting(true);
        scheduleNext(Math.min(6000, 1500 * failCount));
      }
    }

    runPoll();
    return () => {
      alive = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [roomId, teamId, state?.phase]);

  useEffect(() => {
    const p = state?.currentPlayer;
    if (!p || liveStatsMap[p.id]) return;
    let alive = true;
    fetch(`/api/auction/player-stats/${encodeURIComponent(p.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (alive && data?.ok && data.stats) {
          setLiveStatsMap((prev) => ({ ...prev, [p.id]: { stats: data.stats, source: data.source } }));
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [state?.currentPlayer?.id]);

  useEffect(() => {
    if (!state) return;
    if (state.currentPlayer) {
      const lotKey = `${state.round}-${state.currentPlayer.id}`;
      if (lastLotKeyRef.current !== lotKey) {
        lastLotKeyRef.current = lotKey;
        lastBidCountRef.current = 0;
        lastBeepSecRef.current = null;
      }
      if ((state.bidHistory?.length || 0) > lastBidCountRef.current) {
        lastBidCountRef.current = state.bidHistory.length;
        playTone(620, 0.08, 'triangle', 0.08);
        setTimeout(() => playTone(880, 0.09, 'triangle', 0.06), 55);
      }
    }
    if (state.phase === 'LOT_RESULT' && state.lastLotOutcome) {
      const outKey = `${state.round}-${state.lotNumber}-${state.lastLotOutcome.status}`;
      if (lastOutcomeKeyRef.current !== outKey) {
        lastOutcomeKeyRef.current = outKey;
        if (state.lastLotOutcome.status === 'SOLD') playSoldSequence();
        else {
          playTone(280, 0.14, 'sawtooth', 0.05);
          setTimeout(() => playTone(210, 0.22, 'sawtooth', 0.05), 120);
        }
      }
    }
    if (state.phase === 'ANALYZED' && state.analysis?.standings?.some((s) => s.isWinner)) {
      launchConfetti();
    }
  }, [state]);

  useEffect(() => {
    if (!state || state.phase !== 'AUCTION') return;
    const id = setInterval(() => {
      const syncedNow = Date.now() + serverOffsetRef.current;
      setNowServerMs(syncedNow);
      if (state.timerEndsAt && !isSyncingBid) {
        const left = Math.max(0, state.timerEndsAt - syncedNow);
        const ceil = Math.ceil(left / 1000);
        if (left <= 3500 && ceil > 0 && ceil !== lastBeepSecRef.current) {
          lastBeepSecRef.current = ceil;
          playTone(950, 0.05, 'sine', 0.05);
        }
      }
    }, 80);
    return () => clearInterval(id);
  }, [state?.phase, state?.timerEndsAt, state?.idleEndsAt, isSyncingBid]);

  function launchConfetti() {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 110 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * -canvas.height,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      vy: 2.5 + Math.random() * 3.5, vx: -1.5 + Math.random() * 3, rot: Math.random() * 360,
      color: ['#fbbf24', '#38bdf8', '#10b981', '#ec4899', '#a855f7'][Math.floor(Math.random() * 5)]
    }));
    let frames = 0;
    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += 4;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        if (p.y > canvas.height) p.y = -20;
      }
      if (++frames < 210) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(step);
  }

  async function handleCreate(e) {
    e.preventDefault();
    const res = await apiPost('/create', { hostName });
    if (!res.ok) return setLandingErr(res.error);
    versionRef.current = 0;
    applyNewState(res.state, res.teamId, true);
  }

  async function handleJoin(e) {
    e.preventDefault();
    const res = await apiPost('/join', { roomId: joinRoomId, password: joinPin, teamName: joinName });
    if (!res.ok) return setLandingErr(res.error);
    versionRef.current = 0;
    applyNewState(res.state, res.teamId, true);
  }

  async function placeInstantBid(amount) {
    if (!state?.currentPlayer || mutatingRef.current) return;
    const me = state.teams.find((t) => t.id === teamId);
    if (!me || state.phase !== 'AUCTION') return;

    const val = Math.floor(Number(amount));
    if (state.highestBidderId === me.id) return;
    if (val > me.maxBidAllowed) {
      const rem = Math.max(0, 12 - me.squadCount - 1);
      setBidErr(`Cannot buy! Max bid limit reached (${formatINR(me.maxBidAllowed)}) — reserve ₹300 × ${rem} slots.`);
      setTimeout(() => setBidErr(''), 3500);
      return;
    }

    const actionId = `${me.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const prev = state;
    const optimistic = {
      ...state,
      version: (state.version || 0) + 1,
      highestBid: val,
      highestBidderId: me.id,
      highestBidderName: me.name,
      bidCount: (state.bidCount || 0) + 1,
      idleEndsAt: null,
      teams: state.teams.map((t) => (t.id === me.id ? { ...t, currentLotBid: val } : t))
    };
    versionRef.current = optimistic.version;
    setState(optimistic);
    setBidErr('');
    setIsSyncingBid(true);
    playTone(620, 0.08, 'triangle', 0.08);
    setTimeout(() => playTone(880, 0.09, 'triangle', 0.06), 55);

    mutatingRef.current = true;
    try {
      const res = await apiPost('/bid', { roomId, teamId, amount: val, actionId });
      if (!res.ok) {
        setState(prev);
        versionRef.current = prev.version || 0;
        setBidErr(res.error);
        setTimeout(() => setBidErr(''), 3500);
      } else if (res.state) {
        applyNewState(res.state, null, true);
      }
    } finally {
      mutatingRef.current = false;
      setIsSyncingBid(false);
    }
  }

  async function handleSkip() {
    if (!state || mutatingRef.current || state.phase !== 'AUCTION') return;
    const me = state.teams.find((t) => t.id === teamId);
    if (!me || state.highestBidderId === me.id || me.skippedCurrent) return;

    const actionId = `skip-${me.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const prev = state;
    const optimistic = {
      ...state,
      version: (state.version || 0) + 1,
      teams: state.teams.map((t) => (t.id === me.id ? { ...t, skippedCurrent: true } : t))
    };
    versionRef.current = optimistic.version;
    setState(optimistic);

    mutatingRef.current = true;
    try {
      const res = await apiPost('/skip', { roomId, teamId, actionId });
      if (!res.ok) {
        setState(prev);
        versionRef.current = prev.version || 0;
        setBidErr(res.error);
        setTimeout(() => setBidErr(''), 3000);
      } else if (res.state) {
        applyNewState(res.state, null, true);
      }
    } finally {
      mutatingRef.current = false;
    }
  }

  async function handleConfirmQuit() {
    setShowQuitModal(false);
    if (roomId && teamId) {
      try {
        await apiPost('/leave', { roomId, teamId });
      } catch {}
    }
    clearSavedGame();
    versionRef.current = 0;
    setRolesDraft({ captainId: '', wicketkeeperId: '', impactPlayerId: '' });
    setState(null);
    setRoomId(null);
    setTeamId(null);
  }

  async function handleLockRoles() {
    const res = await apiPost('/roles/submit', { roomId, teamId, ...rolesDraft });
    if (!res.ok) {
      setRoleErr(res.error);
      setTimeout(() => setRoleErr(''), 3500);
    } else applyNewState(res.state, null, true);
  }

  async function handleAnalyze() {
    const res = await apiPost('/analyze', { roomId, teamId });
    if (!res.ok) {
      setRoleErr(res.error);
      setTimeout(() => setRoleErr(''), 3500);
    } else applyNewState(res.state, null, true);
  }

  if (!state) {
    return (
      <div className="ag-root">
        <div className="ag-landing">
          <header className="ag-hero">
            <div className="ag-hero-pill">LIVE MULTIPLAYER • PRIME ERA EDITION</div>
            <h1>IPL PRIME <span className="ag-gold-text">AUCTION</span></h1>
            <p className="ag-muted">
              2 to 7 managers. <strong>₹50,000</strong> purse. <strong>12-player</strong> squads (4 Overseas max).
              Dynamic lot sizes (40–100 players) with live player stats.
            </p>
          </header>

          <div className="ag-auth-grid">
            <article className="ag-card ag-auth-card">
              <div className="ag-tag">HOST A TABLE</div>
              <h2>Create Auction Room</h2>
              <p className="ag-muted">Generates a random 4-digit Room ID and 4-digit Password for your friends.</p>
              <form className="ag-stack" onSubmit={handleCreate}>
                <div>
                  <label className="ag-label" htmlFor="agHost">Your Team / Manager Name</label>
                  <input id="agHost" maxLength={22} value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="e.g. Mumbai Mavericks" required />
                </div>
                <button type="submit" className="ag-btn ag-btn-gold ag-btn-lg">Create Room</button>
              </form>
            </article>

            <article className="ag-card ag-auth-card">
              <div className="ag-tag ag-tag-cyan">JOIN FRIENDS</div>
              <h2>Join Existing Room</h2>
              <p className="ag-muted">Enter the 4-digit Room ID and 4-digit Password shared by the host.</p>
              <form className="ag-stack" onSubmit={handleJoin}>
                <div className="ag-two-col">
                  <div>
                    <label className="ag-label" htmlFor="agRid">Room ID</label>
                    <input id="agRid" inputMode="numeric" maxLength={4} value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} placeholder="4-digit ID" required />
                  </div>
                  <div>
                    <label className="ag-label" htmlFor="agPin">Password</label>
                    <input id="agPin" inputMode="numeric" maxLength={4} value={joinPin} onChange={(e) => setJoinPin(e.target.value)} placeholder="4-digit PIN" required />
                  </div>
                </div>
                <div>
                  <label className="ag-label" htmlFor="agTeam">Your Team / Manager Name</label>
                  <input id="agTeam" maxLength={22} value={joinName} onChange={(e) => setJoinName(e.target.value)} placeholder="e.g. Royal Challengers" required />
                </div>
                <button type="submit" className="ag-btn ag-btn-cyan ag-btn-lg">Join Room</button>
              </form>
            </article>
          </div>

          {landingErr && <div className="ag-error" style={{ marginBottom: 16 }}>{landingErr}</div>}

          <section className="ag-rules-strip">
            <div className="ag-rule-chip"><strong>₹50,000</strong><span>INR Purse</span></div>
            <div className="ag-rule-chip"><strong>12 Players</strong><span>11 XI + 1 Impact</span></div>
            <div className="ag-rule-chip"><strong>Max 4</strong><span>Overseas Rule</span></div>
            <div className="ag-rule-chip"><strong>2m / 10s</strong><span>Idle / Bid Clock</span></div>
            <div className="ag-rule-chip"><strong>2 Rounds</strong><span>Unsold Comeback</span></div>
            <div className="ag-rule-chip"><strong>12 Metrics</strong><span>L/R + All-Rounder</span></div>
          </section>
        </div>
      </div>
    );
  }

  const me = state.teams.find((t) => t.id === teamId);
  const inspected = state.teams.find((t) => t.id === (inspectedId || teamId)) || me;
  const p = state.currentPlayer;
  const isLeader = state.highestBidderId === me?.id;
  const isSkipped = me?.skippedCurrent;
  const cannotBid = state.phase !== 'AUCTION' || !me?.eligibleForCurrent || isLeader || isSkipped || isSyncingBid;
  const bidCount = state.bidCount || 0;

  const isBidClock = Boolean(state.timerEndsAt) || isSyncingBid;
  const msLeft = isSyncingBid
    ? 10000
    : state.timerEndsAt
    ? Math.max(0, state.timerEndsAt - nowServerMs)
    : state.idleEndsAt
    ? Math.max(0, state.idleEndsAt - nowServerMs)
    : 120000;
  const timerPct = isBidClock
    ? Math.max(0, Math.min(100, (msLeft / 10000) * 100))
    : Math.max(0, Math.min(100, (msLeft / 120000) * 100));
  const urgent = isBidClock ? msLeft <= 3500 : msLeft <= 15000;

  const displayStats = (p && liveStatsMap[p.id]?.stats) || p?.stats;

  const baseOrCurrent = state.highestBid === null ? (p?.basePrice || 300) : state.highestBid;
  const quickButtons = [];
  if (bidCount < 5) {
    quickButtons.push({
      label: '+₹100',
      val: state.highestBid === null ? baseOrCurrent : baseOrCurrent + 100
    });
  }
  if (bidCount < 10) {
    quickButtons.push({ label: '+₹200', val: baseOrCurrent + 200 });
  }
  if (bidCount < 15) {
    quickButtons.push({ label: '+₹500', val: baseOrCurrent + 500 });
  }
  quickButtons.push({ label: '+₹1,000', val: baseOrCurrent + 1000 });

  return (
    <div className="ag-root">
      <canvas ref={confettiRef} className="ag-confetti" />

      <header className="ag-topbar">
        <div className="ag-topbar-group">
          <strong style={{ fontSize: '1rem' }}>IPL <span style={{ color: '#fbbf24' }}>PRIME</span></strong>
          <div className="ag-creds">
            <span>ID: <strong>{state.roomId}</strong></span>
            <span>|</span>
            <span>PIN: <strong>{state.password}</strong></span>
            <button
              type="button"
              className="ag-copy-btn"
              onClick={() => {
                navigator.clipboard?.writeText(`Join IPL Prime Auction! Room ID: ${state.roomId} | PIN: ${state.password} | ${window.location.href}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="ag-topbar-group">
          <span className="ag-round-pill">
            {state.phase === 'LOBBY' ? 'LOBBY' : state.phase === 'ROLE_SELECTION' ? 'ROLE SELECTION' : state.phase === 'ANALYZED' ? 'FINAL VERDICT' : state.round === 1 ? 'ROUND 1' : 'ROUND 2 • FINAL UNSOLD'}
          </span>
          {reconnecting && (
            <span className="ag-pill ag-pill-disq" style={{ fontSize: '0.68rem' }}>Reconnecting...</span>
          )}
          <span className="ag-muted" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
            {state.phase === 'LOBBY'
              ? `${state.teams.filter((t) => !t.quit).length}/${state.rules.maxPlayers} Teams`
              : state.phase === 'AUCTION' || state.phase === 'LOT_RESULT'
              ? `Lot ${state.lotNumber} / ${state.totalLotsInRound}`
              : state.phase === 'ROLE_SELECTION'
              ? 'Manual C • WK • Impact'
              : '12-Criteria Analysis'}
          </span>
        </div>

        <div className="ag-topbar-group">
          {me && (
            <div className="ag-purse-pill">
              <span>Purse: <strong>{formatINR(me.purse)}</strong></span>
              <span>•</span>
              <span><strong>{me.squadCount}/12</strong></span>
              <span>•</span>
              <span>OS <strong>{me.overseasCount}/4</strong></span>
            </div>
          )}
          <button type="button" className="ag-icon-btn" onClick={() => setSoundOn((s) => !s)} title="Toggle Sound">
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {(state.phase === 'AUCTION' || state.phase === 'LOT_RESULT') && (
        <nav className="ag-mob-tabs">
          <button type="button" className={`ag-mob-tab ${mobTab === 'stage' ? 'active' : ''}`} onClick={() => setMobTab('stage')}>Auction Stage</button>
          <button type="button" className={`ag-mob-tab ${mobTab === 'teams' ? 'active' : ''}`} onClick={() => setMobTab('teams')}>All Purses &amp; Squads</button>
          <button type="button" className={`ag-mob-tab ${mobTab === 'mysquad' ? 'active' : ''}`} onClick={() => setMobTab('mysquad')}>My Squad ({me?.squadCount || 0}/12)</button>
        </nav>
      )}

      {state.phase === 'LOBBY' && (
        <section className="ag-lobby">
          <div className="ag-card ag-lobby-card">
            <div className="ag-lobby-head">
              <div>
                <div className="ag-tag">WAITING ROOM</div>
                <h2 style={{ fontSize: '1.5rem', margin: '4px 0' }}>Share Room Credentials With Friends</h2>
                <p className="ag-muted">2 to 7 teams can join on PC or Mobile. Host can start once at least 2 teams are ready.</p>
              </div>
              <div className="ag-code-box">
                <div><span>ROOM ID</span><strong>{state.roomId}</strong></div>
                <div><span>PASSWORD</span><strong>{state.password}</strong></div>
              </div>
            </div>

            <div className="ag-slots">
              {Array.from({ length: state.rules.maxPlayers }, (_, idx) => {
                const t = state.teams[idx];
                if (!t) {
                  return (
                    <div key={idx} className="ag-slot empty">
                      <AvatarIcon color="#334155" label={`P${idx + 1}`} />
                      <div>
                        <div style={{ fontWeight: 600 }}>Open Slot</div>
                        <div className="ag-muted-xs">Waiting for friend...</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={t.id} className="ag-slot">
                    <AvatarIcon color={t.theme.color} isHost={t.isHost} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{t.name} {t.id === teamId ? '(You)' : ''}</div>
                      <div className="ag-muted-xs">{t.isHost ? 'Room Host' : 'Manager'} • Online</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {me?.isHost ? (
              <button
                type="button"
                className="ag-btn ag-btn-gold ag-btn-lg"
                disabled={state.teams.length < state.rules.minPlayers}
                onClick={async () => {
                  const res = await apiPost('/start', { roomId, teamId });
                  if (res.ok) applyNewState(res.state, null, true);
                }}
              >
                {state.teams.length < state.rules.minPlayers
                  ? `Need at least ${state.rules.minPlayers} teams to start`
                  : `Refresh Stats & Start Auction (${state.recommendedLotSize} Players)`}
              </button>
            ) : (
              <div style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 600 }}>Waiting for the room host to start the auction...</div>
            )}
          </div>
        </section>
      )}

      {(state.phase === 'AUCTION' || state.phase === 'LOT_RESULT') && p && (
        <section className="ag-auction-grid">
          <aside className="ag-rail" style={{ display: window.innerWidth <= 768 && mobTab === 'mysquad' ? 'none' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Live Franchises &amp; Purses</h3>
              <span className="ag-muted-xs">Tap any team to inspect</span>
            </div>

            <div className="ag-teams-strip">
              {state.teams.map((t) => {
                const leading = state.highestBidderId === t.id;
                return (
                  <div
                    key={t.id}
                    className={`ag-team-tile ${leading ? 'is-leading' : ''} ${t.skippedCurrent ? 'is-skipped' : ''} ${inspected?.id === t.id ? 'is-inspected' : ''}`}
                    onClick={() => {
                      setInspectedId(t.id);
                      if (window.innerWidth <= 1024) setModalTeam(t);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <AvatarIcon color={t.theme.color} isHost={t.isHost} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {t.name} {t.id === teamId ? '★' : ''}
                        </div>
                        <div className="ag-muted-xs">{t.quit ? 'QUIT' : `${t.squadCount}/12 • OS ${t.overseasCount}/4`}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, fontSize: '0.88rem', color: '#6ee7b7' }}>{formatINR(t.purse)}</div>
                      {t.quit ? (
                        <span className="ag-skip-badge">LEFT</span>
                      ) : t.skippedCurrent ? (
                        <span className="ag-skip-badge">
                          {p.isOverseas && t.overseasCount >= 4 ? '❌ OS FULL' : '❌ SKIP'}
                        </span>
                      ) : t.currentLotBid ? (
                        <span className={`ag-bubble ${leading ? 'is-leading' : ''}`}>{formatINR(t.currentLotBid)}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {inspected && (
              <div className="ag-card ag-inspector">
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <strong>{inspected.name}</strong>
                  <span className="ag-muted-xs">{inspected.squadCount}/12 • {formatINR(inspected.purse)} left</span>
                </div>
                <div className="ag-inspector-list">
                  {inspected.squad.length === 0 ? (
                    <span className="ag-muted-xs">No players drafted yet.</span>
                  ) : (
                    inspected.squad.map((sp) => (
                      <div key={sp.id} className="ag-squad-row">
                        <span>{sp.name} <span className="ag-muted-xs">({sp.role})</span></span>
                        <strong style={{ color: '#fbbf24', fontFamily: 'ui-monospace, monospace' }}>{formatINR(sp.boughtPrice)}</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </aside>

          {mobTab === 'mysquad' && me ? (
            <div className="ag-card" style={{ padding: 16 }}>
              <h3 style={{ margin: '0 0 10px' }}>{me.name} — My Squad ({me.squadCount}/12)</h3>
              {me.squad.length === 0 ? (
                <p className="ag-muted">No players drafted yet.</p>
              ) : (
                me.squad.map((sp) => (
                  <div key={sp.id} className="ag-squad-row" style={{ marginBottom: 6 }}>
                    <span>{sp.name} ({sp.role})</span>
                    <strong style={{ color: '#fbbf24' }}>{formatINR(sp.boughtPrice)}</strong>
                  </div>
                ))
              )}
            </div>
          ) : (
            <main className="ag-stage" style={{ display: window.innerWidth <= 768 && mobTab !== 'stage' ? 'none' : undefined }}>
              <div className="ag-card ag-game-card">
                {state.phase === 'LOT_RESULT' && state.lastLotOutcome && (
                  <div className="ag-overlay">
                    {state.lastLotOutcome.status === 'SOLD' && <WoodMalletSvg />}
                    <div className={`ag-stamp ${state.lastLotOutcome.status === 'SOLD' ? 'sold' : 'unsold'}`}>
                      {state.lastLotOutcome.status === 'SOLD' ? 'SOLD!' : 'UNSOLD'}
                    </div>
                    <div style={{ fontSize: '1.08rem', fontWeight: 700 }}>
                      {state.lastLotOutcome.status === 'SOLD'
                        ? `${state.lastLotOutcome.player.name} → ${state.lastLotOutcome.winnerTeamName} for ${formatINR(state.lastLotOutcome.price)}`
                        : `${state.lastLotOutcome.player.name} • ${state.lastLotOutcome.reason}`}
                    </div>
                  </div>
                )}

                <div className="ag-card-face">
                  <div className="ag-spotlight" />
                  <div className="ag-card-top">
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="ag-pill ag-pill-era">{p.era}</span>
                      <span className={`ag-pill ${p.isOverseas ? 'ag-pill-os' : 'ag-pill-ind'}`}>
                        {p.isOverseas ? `OVERSEAS (${p.country})` : 'INDIAN'}
                      </span>
                    </div>
                    <span className="ag-pill ag-pill-role">{p.role}</span>
                  </div>

                  <div className="ag-centerpiece">
                    <div className="ag-portrait">
                      <img src={`/api/auction/player-image/${encodeURIComponent(p.id)}`} alt={p.name} />
                    </div>
                    <h2 className="ag-player-name">{p.name}</h2>
                    <div className="ag-muted">
                      {p.country} • {p.battingStyle}{p.bowlingStyle && p.bowlingStyle !== 'None' ? ` • ${p.bowlingStyle}` : ''}
                    </div>
                  </div>

                  <div className="ag-stats-grid">
                    <div className="ag-stat-box"><span>MAT</span><strong>{displayStats?.matches || '-'}</strong></div>
                    <div className="ag-stat-box"><span>RUNS</span><strong>{displayStats?.runs || '-'}</strong></div>
                    <div className="ag-stat-box"><span>SR</span><strong>{displayStats?.strikeRate ? Number(displayStats.strikeRate).toFixed(1) : '-'}</strong></div>
                    <div className="ag-stat-box"><span>AVG</span><strong>{displayStats?.average ? Number(displayStats.average).toFixed(1) : '-'}</strong></div>
                    <div className="ag-stat-box"><span>WKTS</span><strong>{displayStats?.wickets || '-'}</strong></div>
                    <div className="ag-stat-box"><span>ECON</span><strong>{displayStats?.economy ? Number(displayStats.economy).toFixed(2) : '-'}</strong></div>
                  </div>
                </div>

                <div className="ag-bidding-box">
                  <div className="ag-bid-figures">
                    <div>
                      <span className="ag-muted-xs" style={{ display: 'block' }}>BASE PRICE</span>
                      <strong style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.25rem' }}>{formatINR(p.basePrice)}</strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="ag-muted-xs" style={{ display: 'block' }}>CURRENT HIGHEST BID</span>
                      <strong style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.5rem', color: '#fbbf24' }}>
                        {state.highestBid !== null ? formatINR(state.highestBid) : 'No Bids Yet'}
                      </strong>
                      {state.highestBidderName && (
                        <span style={{ marginLeft: 8, padding: '3px 9px', borderRadius: 999, fontSize: '0.74rem', fontWeight: 800, background: state.teams.find((t) => t.id === state.highestBidderId)?.theme.color, color: '#090d16' }}>
                          {state.highestBidderName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                    <span className="ag-muted">
                      {isSyncingBid
                        ? 'Locking bid...'
                        : isBidClock
                        ? (msLeft === 0 ? 'Settling lot...' : 'Going once, going twice...')
                        : 'Waiting for opening bid (2 min display limit)'}
                    </span>
                    <strong style={{ fontFamily: 'ui-monospace, monospace', color: urgent ? '#f87171' : '#fbbf24' }}>
                      {isBidClock ? `${(msLeft / 1000).toFixed(1)}s` : formatClock(msLeft)}
                    </strong>
                  </div>
                  <div className="ag-timer-track">
                    <div className={`ag-timer-fill ${urgent ? 'urgent' : ''}`} style={{ width: `${timerPct}%` }} />
                  </div>
                </div>

                <div className="ag-bid-buttons-grid">
                  {quickButtons.map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      className="ag-bid-step-btn"
                      disabled={cannotBid || btn.val > (me?.maxBidAllowed || 0)}
                      onClick={() => placeInstantBid(btn.val)}
                    >
                      {btn.label}
                      <span>{formatINR(btn.val)}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className="ag-btn ag-btn-danger-outline"
                    disabled={state.phase !== 'AUCTION' || isLeader || isSkipped}
                    onClick={handleSkip}
                  >
                    SKIP ❌
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>
                  <span>Bids on lot: <strong style={{ color: '#fbbf24' }}>{bidCount}</strong></span>
                  {me && <span style={{ fontFamily: 'ui-monospace, monospace' }}>Max Bid: {formatINR(me.maxBidAllowed)}</span>}
                </div>

                {bidErr && <div className="ag-error">{bidErr}</div>}
              </div>
            </main>
          )}
        </section>
      )}

      {state.phase === 'ROLE_SELECTION' && (
        <section className="ag-center-panel">
          <div className="ag-card" style={{ padding: 24 }}>
            <div className="ag-tag ag-tag-cyan">AUCTION COMPLETE</div>
            <h2 style={{ margin: '4px 0 8px' }}>Select Captain, Wicketkeeper &amp; Impact Player</h2>
            <p className="ag-muted">Manually choose your Captain, Wicketkeeper, and Impact Player below, lock them in, and then click <strong>Analyze</strong>!</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {state.teams.map((t) => (
                <span key={t.id} className={`ag-pill ${t.disqualified ? 'ag-pill-disq' : t.roles.confirmed ? 'ag-pill-role' : 'ag-pill-era'}`}>
                  {t.theme.badge}: {t.quit ? 'QUIT' : t.disqualified ? 'DISQUALIFIED' : t.roles.confirmed ? '✓ Locked' : 'Choosing...'}
                </span>
              ))}
            </div>

            {me?.disqualified ? (
              <div className="ag-error" style={{ margin: '18px 0' }}>Your team drafted 0 players and has been disqualified from this auction.</div>
            ) : me?.squad?.length > 0 ? (
              <div className="ag-role-grid">
                {[
                  ['captainId', 'Captain (C)', 'Leads the XI on field & tactical decisions.'],
                  ['wicketkeeperId', 'Wicketkeeper (WK)', 'Handles the gloves behind the stumps.'],
                  ['impactPlayerId', 'Impact Player (12th Man)', 'Your X-factor 12th player (distinct from C & WK).']
                ].map(([key, label, hint]) => (
                  <div key={key} className="ag-role-box">
                    <label className="ag-label">{label}</label>
                    <select value={rolesDraft[key]} onChange={(e) => setRolesDraft((r) => ({ ...r, [key]: e.target.value }))}>
                      <option value="">-- Choose {label.split(' ')[0]} --</option>
                      {me.squad.map((sp) => (
                        <option key={sp.id} value={sp.id}>{sp.name} ({sp.role} • {sp.country})</option>
                      ))}
                    </select>
                    <div className="ag-muted-xs" style={{ marginTop: 6 }}>{hint}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', padding: 16, borderRadius: 14, background: 'rgba(245, 158, 11, 0.06)', border: '1px dashed rgba(245, 158, 11, 0.35)' }}>
              {!me?.disqualified && (
                <button type="button" className="ag-btn ag-btn-cyan" onClick={handleLockRoles}>Lock In My Roles</button>
              )}
              <button
                type="button"
                className="ag-btn ag-btn-gold ag-btn-xl"
                disabled={state.teams.some((t) => !t.quit && !t.disqualified && t.squadCount > 0 && !t.roles.confirmed)}
                onClick={handleAnalyze}
              >
                ⚡ ANALYZE ALL TEAMS &amp; DECLARE WINNER
              </button>
            </div>
            {roleErr && <div className="ag-error" style={{ marginTop: 10 }}>{roleErr}</div>}
          </div>
        </section>
      )}

      {state.phase === 'ANALYZED' && state.analysis && (
        <section className="ag-center-panel">
          {(() => {
            const winner = state.analysis.standings.find((s) => s.isWinner);
            const maxScore = state.analysis.criteriaLabels.length * 100;
            return (
              <div className="ag-card" style={{ padding: 28, textAlign: 'center', borderColor: 'rgba(245, 158, 11, 0.55)' }}>
                {winner ? (
                  <>
                    <div style={{ fontSize: '3rem' }}>🏆</div>
                    <div className="ag-tag">IPL PRIME AUCTION CHAMPION</div>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', margin: '6px 0' }}>
                      <span style={{ color: winner.color }}>{winner.teamName}</span> WINS!
                    </h1>
                    <p className="ag-muted">{winner.verdict}</p>
                    <div style={{ display: 'inline-block', marginTop: 10, padding: '8px 18px', borderRadius: 999, background: 'rgba(16,185,129,0.16)', border: '1px solid rgba(16,185,129,0.45)', color: '#6ee7b7', fontWeight: 700 }}>
                      Total Score: {winner.totalScore} / {maxScore} • Avg Rating: {winner.averageScore} / 100
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ag-tag">AUCTION CONCLUDED</div>
                    <h2>No Qualified Winner</h2>
                  </>
                )}
              </div>
            );
          })()}

          <div className="ag-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <div className="ag-tag">EQUAL-WEIGHT EVALUATION ({state.analysis.criteriaLabels.length} × 100 PTS = {state.analysis.criteriaLabels.length * 100} MAX)</div>
                <h2 style={{ margin: '4px 0 0' }}>Complete Team Ratings &amp; Breakdown</h2>
              </div>
              <button type="button" className="ag-btn ag-btn-cyan-outline" onClick={handleConfirmQuit}>
                New Auction Game
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {state.analysis.standings.map((t) => (
                <div key={t.teamId} style={{ background: 'rgba(7, 11, 20, 0.72)', border: `1px solid ${t.rank === 1 ? '#fbbf24' : 'var(--border)'}`, borderRadius: 16, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <strong style={{ fontSize: '1.35rem', color: '#fbbf24', marginRight: 8 }}>#{t.rank}</strong>
                      <strong style={{ fontSize: '1.18rem', color: t.color }}>{t.teamName}</strong>
                      {t.isWinner && <span className="ag-pill ag-pill-era" style={{ marginLeft: 8 }}>CHAMPION</span>}
                      {t.disqualified && <span className="ag-pill ag-pill-disq" style={{ marginLeft: 8 }}>DISQUALIFIED</span>}
                      <div className="ag-muted-xs" style={{ marginTop: 4 }}>
                        Squad: {t.squadCount}/12 • OS: {t.overseasCount}/4 • Purse Left: {formatINR(t.remainingPurse)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                        {t.totalScore} / {state.analysis.criteriaLabels.length * 100}
                      </div>
                      <div className="ag-muted-xs">Avg {t.averageScore} / 100</div>
                    </div>
                  </div>

                  <div className="ag-metrics-grid">
                    {state.analysis.criteriaLabels.map(({ key, label }) => {
                      const val = t.scores[key] ?? 0;
                      const barCol = val >= 85 ? '#10b981' : val >= 70 ? '#fbbf24' : '#ef4444';
                      return (
                        <div key={key} className="ag-metric-box">
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                            <span>{label}</span>
                            <strong style={{ color: '#f8fafc' }}>{val}</strong>
                          </div>
                          <div className="ag-bar"><div className="ag-bar-fill" style={{ width: `${val}%`, background: barCol }} /></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="ag-muted-xs">{t.verdict}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <button type="button" className="ag-quit-fab" onClick={() => setShowQuitModal(true)}>
        ✕ Quit
      </button>

      {showQuitModal && (
        <div className="ag-modal-bg" onClick={() => setShowQuitModal(false)}>
          <div className="ag-card" style={{ maxWidth: 380, width: '100%', padding: 22, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px' }}>Are you sure you want to quit?</h3>
            <p className="ag-muted" style={{ marginBottom: 18 }}>If you exit now, you will leave the active auction room and return to the Create / Join screen.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="ag-btn ag-btn-cyan-outline" style={{ flex: 1 }} onClick={() => setShowQuitModal(false)}>
                No, Stay
              </button>
              <button type="button" className="ag-btn ag-btn-danger-outline" style={{ flex: 1 }} onClick={handleConfirmQuit}>
                Yes, Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {modalTeam && (
        <div className="ag-modal-bg" onClick={() => setModalTeam(null)}>
          <div className="ag-card" style={{ maxWidth: 500, width: '100%', maxHeight: '80vh', padding: 18, overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0 }}>{modalTeam.name}</h3>
                <span className="ag-muted-xs">{modalTeam.squadCount}/12 • OS {modalTeam.overseasCount}/4 • {formatINR(modalTeam.purse)} left</span>
              </div>
              <button type="button" className="ag-icon-btn" onClick={() => setModalTeam(null)}>✕</button>
            </div>
            {modalTeam.squad.length === 0 ? (
              <p className="ag-muted">No players bought yet.</p>
            ) : (
              modalTeam.squad.map((sp) => (
                <div key={sp.id} className="ag-squad-row" style={{ marginBottom: 6 }}>
                  <span>{sp.name} ({sp.role})</span>
                  <strong style={{ color: '#fbbf24' }}>{formatINR(sp.boughtPrice)}</strong>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
