import { useState, useEffect, useMemo, useCallback } from 'react';
import Theory from './Theory';
import { themes } from './themes';
import type { Theme } from './themes';
import './App.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type GameType = 'powerball' | 'megamillions' | 'texaslotto';

interface DrawRecord {
  draw_date: string;
  winning_numbers: string; // space-separated primary balls only
  mega_ball?: string;
  multiplier?: string;
}

interface GameConfig {
  maxPrimary: number;
  maxSpecial: number | null;
  ballCount: number;
  upperRangeMin: number;
  csvPath: string;
  csvGameFilter: string;
  ticketCost: number;
  totalCombinations: number;
  smallPrizeEV: number;
  label: string;
}

interface AnalyzedNumber {
  num: number;
  count: number;
  expected: number;
  variance: number;
}

interface PickJustification {
  num: number;
  tag: 'theory' | 'chaos';
  reason: string;
}

interface GeneratedPick {
  id: string;
  primary: number[];
  special: number | null;
  justifications: PickJustification[];
}

interface GenerationSession {
  game: GameType;
  timestamp: string;
  seedEntropy: string;
  picks: GeneratedPick[];
}

// ─── Game Config ──────────────────────────────────────────────────────────────

const GAME_CONFIGS: Record<GameType, GameConfig> = {
  powerball: {
    maxPrimary: 69, maxSpecial: 26, ballCount: 5, upperRangeMin: 32,
    csvPath: '/api/texas/export/sites/lottery/Games/Powerball/Winning_Numbers/powerball.csv',
    csvGameFilter: 'powerball',
    ticketCost: 2, totalCombinations: 292_201_338, smallPrizeEV: 0.32, label: 'POWERBALL',
  },
  megamillions: {
    maxPrimary: 70, maxSpecial: 25, ballCount: 5, upperRangeMin: 32,
    csvPath: '/api/texas/export/sites/lottery/Games/Mega_Millions/Winning_Numbers/megamillions.csv',
    csvGameFilter: 'mega millions',
    ticketCost: 2, totalCombinations: 302_575_350, smallPrizeEV: 0.32, label: 'MEGA MILLIONS',
  },
  texaslotto: {
    maxPrimary: 54, maxSpecial: null, ballCount: 6, upperRangeMin: 32,
    csvPath: '/api/texas/export/sites/lottery/Games/Lotto_Texas/Winning_Numbers/lottotexas.csv',
    csvGameFilter: 'lotto texas',
    ticketCost: 1, totalCombinations: 25_827_165, smallPrizeEV: 0.12, label: 'TX LOTTO',
  },
};

const HUMAN_BIRTHDAY_CUTOFF = 31;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sfc32 = (a: number, b: number, c: number, d: number) => {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
};

const makeCryptoRand = () => {
  const buf = new Uint32Array(4);
  crypto.getRandomValues(buf);
  return {
    rand: sfc32(buf[0], buf[1], buf[2], buf[3]),
    entropyHex: Array.from(buf)
      .map(n => n.toString(16).padStart(8, '0'))
      .join('')
      .substring(0, 16)
      .toUpperCase(),
  };
};

// EV = lump-sum jackpot after 37% fed tax / total combinations + small-prize EV − ticket cost
// (lump sum ≈ 60% of advertised; Texas has no state income tax)
const computeEV = (jackpotMillions: number, game: GameType): number => {
  const cfg = GAME_CONFIGS[game];
  const afterTax = jackpotMillions * 1_000_000 * 0.60 * 0.63;
  return afterTax / cfg.totalCombinations + cfg.smallPrizeEV - cfg.ticketCost;
};

// ─── Components ───────────────────────────────────────────────────────────────

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <span className="tooltip-container">
    {children}
    <span className="tooltip-text">{text}</span>
  </span>
);

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeGame, setActiveGame] = useState<GameType>('megamillions');
  const [engineMode, setEngineMode] = useState<'hybrid' | 'pure_math'>('hybrid');
  const [currentView, setCurrentView] = useState<'terminal' | 'theory'>('terminal');
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);

  const [rawData, setRawData] = useState<DrawRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<GenerationSession | null>(null);

  const [jackpots, setJackpots] = useState<Record<GameType, string>>({
    powerball: '', megamillions: '', texaslotto: '',
  });

  const [savedSessions, setSavedSessions] = useState<GenerationSession[]>(() => {
    try {
      const s = localStorage.getItem('megabucks_sessions');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  // Fetch current jackpots from Texas Lottery RSS (covers all three games via existing proxy)
  useEffect(() => {
    fetch('/api/texas/export/sites/lottery/rss/tlc_latest.xml')
      .then(r => r.text())
      .then(xml => {
        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        const updates: Partial<Record<GameType, string>> = {};
        for (const item of Array.from(doc.querySelectorAll('item'))) {
          const title = item.querySelector('title')?.textContent ?? '';
          const desc  = item.querySelector('description')?.textContent ?? '';
          if (!title.toLowerCase().includes('estimated jackpot')) continue;
          // Parse "Annuitized: $195 Million" or "$1.5 Billion"
          const m = desc.match(/Annuitized:\s*\$([0-9,.]+)\s*(Million|Billion)/i);
          if (!m) continue;
          let amount = parseFloat(m[1].replace(/,/g, ''));
          if (m[2].toLowerCase() === 'billion') amount *= 1000;
          const t = title.toLowerCase();
          if (t.includes('powerball'))       updates.powerball    = amount.toFixed(0);
          else if (t.includes('mega'))       updates.megamillions = amount.toFixed(0);
          else if (t.includes('lotto texas') || t.includes('texas lotto'))
                                             updates.texaslotto   = amount.toFixed(0);
        }
        if (Object.keys(updates).length) setJackpots(prev => ({ ...prev, ...updates }));
      })
      .catch(() => {}); // silently fail — user can enter manually
  }, []);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(activeTheme.vars).forEach(([key, value]) => root.style.setProperty(key, value));
    let fontLink = document.getElementById('theme-google-font') as HTMLLinkElement;
    if (activeTheme.googleFontUrl) {
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'theme-google-font';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      fontLink.href = activeTheme.googleFontUrl;
    } else if (fontLink) {
      fontLink.remove();
    }
  }, [activeTheme]);

  // Fetch draw history
  useEffect(() => {
    setIsLoading(true);
    const cfg = GAME_CONFIGS[activeGame];
    fetch(cfg.csvPath)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.trim().split('\n');
        const parsed: DrawRecord[] = [];
        for (const line of lines) {
          const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
          if (!cols[0].toLowerCase().includes(cfg.csvGameFilter)) continue;
          if (activeGame === 'texaslotto') {
            if (cols.length >= 10) {
              const [, m, d, y, n1, n2, n3, n4, n5, n6] = cols;
              parsed.push({
                draw_date: `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00.000`,
                winning_numbers: `${n1} ${n2} ${n3} ${n4} ${n5} ${n6}`,
              });
            }
          } else {
            if (cols.length >= 10) {
              const [, m, d, y, n1, n2, n3, n4, n5, special, multiplier] = cols;
              parsed.push({
                draw_date: `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00.000`,
                winning_numbers: `${n1} ${n2} ${n3} ${n4} ${n5}`,
                mega_ball: special,
                multiplier: multiplier || '',
              });
            }
          }
        }
        parsed.reverse(); // newest first
        setRawData(parsed);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [activeGame]);

  // Frequency analysis (display only — not used in generation)
  const analysis = useMemo(() => {
    if (!rawData.length) return null;
    const cfg = GAME_CONFIGS[activeGame];
    const totals = Array.from({ length: cfg.maxPrimary + 1 }, () => 0);
    let drawCount = 0;
    for (const draw of rawData) {
      if (!draw.winning_numbers) continue;
      const nums = draw.winning_numbers.trim().split(/\s+/).map(n => parseInt(n, 10)).filter(n => !isNaN(n));
      for (let i = 0; i < cfg.ballCount; i++) {
        if (nums[i] >= 1 && nums[i] <= cfg.maxPrimary) totals[nums[i]]++;
      }
      drawCount++;
    }
    const expectedPerNumber = (drawCount * cfg.ballCount) / cfg.maxPrimary;
    const mapped: AnalyzedNumber[] = [];
    for (let i = 1; i <= cfg.maxPrimary; i++) {
      mapped.push({ num: i, count: totals[i], expected: expectedPerNumber, variance: totals[i] - expectedPerNumber });
    }
    mapped.sort((a, b) => b.variance - a.variance);
    return {
      all: mapped,
      topFreq: mapped[0],
      bottomFreq: mapped[mapped.length - 1],
      expected: expectedPerNumber,
      totalDrawsAnalyzed: drawCount,
    };
  }, [rawData, activeGame]);

  // Pick generation
  const generatePick = useCallback(() => {
    if (!rawData.length) return;
    const cfg = GAME_CONFIGS[activeGame];
    const { rand, entropyHex } = makeCryptoRand();
    const generatedPicks: GeneratedPick[] = [];

    const pickFrom = (pool: Set<number>, min: number, max: number): number => {
      let n: number;
      let attempts = 0;
      do {
        n = Math.floor(rand() * (max - min + 1)) + min;
        if (++attempts > 100) {
          for (let i = min; i <= max; i++) if (!pool.has(i)) return i;
          for (let i = 1; i <= cfg.maxPrimary; i++) if (!pool.has(i)) return i;
          return min;
        }
      } while (pool.has(n));
      return n;
    };

    for (let t = 0; t < ticketCount; t++) {
      const pool = new Set<number>();
      const justifications: PickJustification[] = [];

      if (engineMode === 'hybrid') {
        // Upper-range picks (avoid birthday-biased numbers 1–31)
        const upperCount = cfg.ballCount === 6 ? 3 : 2;
        for (let i = 0; i < upperCount; i++) {
          const n = pickFrom(pool, cfg.upperRangeMin, cfg.maxPrimary);
          pool.add(n);
          justifications.push({ num: n, tag: 'theory', reason: `Avoids 1–${HUMAN_BIRTHDAY_CUTOFF} (birthday-biased). Reduces jackpot splits.` });
        }
        // Remaining picks: full-range cryptographic random
        while (pool.size < cfg.ballCount) {
          const n = pickFrom(pool, 1, cfg.maxPrimary);
          pool.add(n);
          justifications.push({ num: n, tag: 'chaos', reason: 'Cryptographically random. Full-range selection.' });
        }
      } else {
        // Pure math: all picks from upper range
        while (pool.size < cfg.ballCount) {
          const n = pickFrom(pool, cfg.upperRangeMin, cfg.maxPrimary);
          pool.add(n);
          justifications.push({ num: n, tag: 'theory', reason: `Anti-Collision: All numbers ≥${cfg.upperRangeMin}.` });
        }
      }

      const primary = Array.from(pool).sort((a, b) => a - b);

      // Special ball: bias upper half (months 1–12 are heavily picked; upper half reduces splits)
      let special: number | null = null;
      if (cfg.maxSpecial !== null) {
        const upperMin = Math.ceil(cfg.maxSpecial / 2) + 1; // 13 for MM(25) and PB(26)
        special = rand() < 0.65
          ? Math.floor(rand() * (cfg.maxSpecial - upperMin + 1)) + upperMin
          : Math.floor(rand() * cfg.maxSpecial) + 1;
      }

      generatedPicks.push({ id: `t${t}-${Date.now()}`, primary, special, justifications });
    }

    const newSession: GenerationSession = {
      game: activeGame,
      timestamp: new Date().toLocaleTimeString(),
      seedEntropy: entropyHex,
      picks: generatedPicks,
    };

    setCurrentSession(newSession);
    setSavedSessions(prev => {
      const updated = [newSession, ...prev].slice(0, 10);
      try { localStorage.setItem('megabucks_sessions', JSON.stringify(updated)); } catch { /* quota exceeded */ }
      return updated;
    });
  }, [rawData, activeGame, engineMode, ticketCount]);

  const switchGame = (g: GameType) => { setActiveGame(g); setCurrentSession(null); };

  // EV indicator
  const jackpotMillions = parseFloat(jackpots[activeGame]) || 0;
  const currentEV = computeEV(jackpotMillions, activeGame);
  const evColor = currentEV >= 0 ? '#00ff88' : currentEV >= -0.50 ? '#ffcc00' : '#ff4466';
  const evLabel = currentEV >= 0 ? 'POSITIVE EV' : currentEV >= -0.50 ? 'NEAR BREAKEVEN' : 'NEGATIVE EV';

  return (
    <div className="terminal-shell">
      <header className="terminal-header">
        <div className="terminal-brand">
          <div className="terminal-logo">MEGA<span>BUCKS</span></div>
        </div>
        <div className="terminal-status">
          <div className="status-indicator">
            <div className={`status-dot ${!isLoading ? 'active' : ''}`}></div>
            {isLoading ? 'SYNCING API...' : 'FEDERAL DATA LINKED'}
          </div>
          <div>SOURCE: US-WIDE ARCHIVE</div>
        </div>
      </header>

      <div className="terminal-grid">
        <aside className="terminal-sidebar">

          <div className="panel-section">
            <div className="panel-title">Interface Theme</div>
            <select
              value={activeTheme.id}
              onChange={(e) => setActiveTheme(themes.find(t => t.id === e.target.value) || themes[0])}
              style={{ width: '100%', padding: '12px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
            >
              <optgroup label="Core Aesthetics">
                {themes.slice(0, 10).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </optgroup>
              <optgroup label="Mass Appeal Aesthetics">
                {themes.slice(10).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </optgroup>
            </select>
          </div>

          <div className="panel-section">
            <div className="panel-title">{activeTheme.vectorLabel || 'Target Vector'}</div>
            <div className="game-switch" style={{ flexDirection: 'column' }}>
              <button className={`game-btn ${activeGame === 'powerball' ? 'active-pb' : ''}`} onClick={() => switchGame('powerball')}>POWERBALL</button>
              <button className={`game-btn ${activeGame === 'megamillions' ? 'active-mm' : ''}`} onClick={() => switchGame('megamillions')}>MEGA MILLIONS</button>
              <button className={`game-btn ${activeGame === 'texaslotto' ? 'active-tx' : ''}`} onClick={() => switchGame('texaslotto')}>TX LOTTO</button>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">Current Jackpot</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>$</span>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={jackpots[activeGame]}
                onChange={e => setJackpots(prev => ({ ...prev, [activeGame]: e.target.value }))}
                style={{ flex: 1, padding: '8px', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', outline: 'none' }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>M</span>
            </div>
            {jackpotMillions > 0 && (
              <Tooltip text={
                currentEV >= 0
                  ? `At this jackpot you'd expect to get back more than you paid — on average $${(currentEV + GAME_CONFIGS[activeGame].ticketCost).toFixed(2)} per $${GAME_CONFIGS[activeGame].ticketCost} ticket. Still a long shot, but mathematically the best time to play.`
                  : `On average you'd lose $${Math.abs(currentEV).toFixed(2)} of every $${GAME_CONFIGS[activeGame].ticketCost} ticket. For example: if a million people each buy one ticket, the average person walks away with $${(GAME_CONFIGS[activeGame].ticketCost + currentEV).toFixed(2)}. The jackpot needs to be much larger for the math to flip.`
              }>
                <div style={{ marginTop: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: evColor, padding: '4px 8px', border: `1px solid ${evColor}`, borderRadius: '4px', display: 'inline-block', cursor: 'help' }}>
                  {evLabel} · ${currentEV.toFixed(2)}/ticket ⓘ
                </div>
              </Tooltip>
            )}
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
              Lump sum · 37% fed tax · TX resident (approx.)
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">Ticket Quantity: {ticketCount}</div>
            <input
              type="range"
              className="ticket-slider"
              min="1" max="5"
              value={ticketCount}
              onChange={e => setTicketCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>1</span><span>3</span><span>5</span>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">Algorithm Synthesis</div>
            <div className={`engine-toggle ${engineMode === 'hybrid' ? 'active' : ''}`} onClick={() => setEngineMode('hybrid')}>
              <div className="engine-icon">⚛</div>
              <div className="engine-info">
                <div className="engine-name">HYBRID CHAOS</div>
                <div className="engine-desc">Mixes upper-range theory picks with cryptographically random selections. Avoids birthday-biased numbers.</div>
              </div>
            </div>
            <div className={`engine-toggle ${engineMode === 'pure_math' ? 'active' : ''}`} onClick={() => setEngineMode('pure_math')}>
              <div className="engine-icon">ƒ(x)</div>
              <div className="engine-info">
                <div className="engine-name">
                  <Tooltip text="Expected Value: The average mathematical amount you can expect to win or lose per ticket played.">
                    <span style={{ borderBottom: '1px dotted var(--accent-magenta)', cursor: 'help' }}>MAXIMUM EV</span>
                  </Tooltip>
                </div>
                <div className="engine-desc">Pure math. Forces all numbers above {HUMAN_BIRTHDAY_CUTOFF} to minimize jackpot splitting with birthday pickers.</div>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">System Manual</div>
            <button
              className="action-btn"
              style={{ background: currentView === 'theory' ? 'var(--accent-magenta)' : 'transparent', color: currentView === 'theory' ? 'white' : 'var(--text-muted)', border: '1px solid var(--panel-border)', padding: '12px', marginTop: '0' }}
              onClick={() => setCurrentView(v => v === 'theory' ? 'terminal' : 'theory')}
            >
              {currentView === 'theory' ? 'RETURN TO TERMINAL' : 'THEORY & METRICS'}
            </button>
          </div>

          <button className="action-btn" onClick={() => { setCurrentView('terminal'); generatePick(); }} disabled={isLoading}>
            {isLoading ? 'CALCULATING...' : 'EXECUTE PREDICTION'}
          </button>

        </aside>

        <main className="terminal-workspace">
          {currentView === 'theory' ? (
            <Theory />
          ) : isLoading && !analysis ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="glitch-loader">ACQUIRING {activeGame.toUpperCase()} DATA MANIFOLD...</div>
            </div>
          ) : (
            <>
              {currentSession && (
                <div className="ticket-display">
                  <div className="ticket-meta">
                    <span>{currentSession.timestamp}</span>
                    <Tooltip text="Cryptographically random 128-bit seed from crypto.getRandomValues(). Unpredictable and unreproducible.">
                      <span style={{ cursor: 'help' }}>ENTROPY_SEED: [{currentSession.seedEntropy}]</span>
                    </Tooltip>
                  </div>

                  <div className="tickets-scroll-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '450px', overflowY: 'auto', paddingRight: '8px' }}>
                    {currentSession.picks.map((pick, index) => (
                      <div key={pick.id} className="single-ticket-wrap" style={{ borderBottom: index < currentSession.picks.length - 1 ? '1px dashed var(--panel-border)' : 'none', paddingBottom: index < currentSession.picks.length - 1 ? '24px' : '0' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>ENTRY #{index + 1}</div>
                        <div className="ball-container">
                          {pick.primary.map((p, i) => (
                            <div key={`p-${i}`} className="lotto-ball">{p}</div>
                          ))}
                          {pick.special !== null && (
                            <div className={`lotto-ball ${activeGame === 'powerball' ? 'special-pb' : 'special-mm'}`}>
                              {pick.special}
                            </div>
                          )}
                        </div>
                        <div className="justification-log">
                          <div className="panel-title" style={{ marginBottom: '8px' }}>Computational Justifications</div>
                          {pick.justifications.map((j, i) => (
                            <div key={i} className="just-row">
                              <span className="just-num">{j.num}</span>
                              <span className={`just-tag ${j.tag}`}>{j.tag.toUpperCase()}</span>
                              <span className="just-reason">{j.reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {savedSessions.length > 1 && (
                <div className="panel-section" style={{ marginTop: '16px' }}>
                  <div className="panel-title">TICKET HISTORY (last {Math.min(savedSessions.length - 1, 9)})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                    {savedSessions.slice(1).map((session, idx) => (
                      <div key={idx} style={{ padding: '8px', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius)', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{GAME_CONFIGS[session.game].label}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{session.timestamp}</span>
                        </div>
                        {session.picks.slice(0, 1).map((pick, i) => (
                          <div key={i} style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {pick.primary.map((n, j) => (
                              <span key={j} style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '1px 5px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{n}</span>
                            ))}
                            {pick.special !== null && (
                              <span style={{ background: session.game === 'powerball' ? 'rgba(200,0,0,0.2)' : 'rgba(0,60,200,0.2)', border: '1px solid var(--panel-border)', borderRadius: '4px', padding: '1px 5px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{pick.special}</span>
                            )}
                            {session.picks.length > 1 && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>+{session.picks.length - 1}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="panel-title">Draws Parsed</div>
                    <div className="stat-val">{analysis.totalDrawsAnalyzed}</div>
                  </div>
                  <div className="stat-card">
                    <div className="panel-title">Most Frequent</div>
                    <div className="stat-val" style={{ color: 'var(--accent-yellow)' }}>
                      #{analysis.topFreq.num} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+{analysis.topFreq.variance.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="panel-title">Least Frequent</div>
                    <div className="stat-val" style={{ color: 'var(--accent-green)' }}>
                      #{analysis.bottomFreq.num} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{analysis.bottomFreq.variance.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="panel-section" style={{ marginTop: '16px' }}>
                  <div className="panel-title">Historical Frequency (Informational Only)</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px', alignItems: 'center' }}>
                    <span>Each box = one number (1–{GAME_CONFIGS[activeGame].maxPrimary}).</span>
                    <span style={{ color: 'var(--accent-yellow)' }}>■ drawn above average</span>
                    <span style={{ color: 'var(--accent-green)' }}>■ drawn below average</span>
                    <span style={{ opacity: 0.4 }}>■ near average</span>
                  </div>
                  <div className="heatmap">
                    {[...analysis.all].sort((a, b) => a.num - b.num).map(a => {
                      let cellClass = 'heat-cell';
                      if (a.variance > 3) cellClass += ' hot';
                      else if (a.variance < -3) cellClass += ' cold';
                      return (
                        <div key={a.num} className={cellClass} title={`#${a.num} — drawn ${a.count}x (expected ${a.expected.toFixed(1)}x) · variance ${a.variance > 0 ? '+' : ''}${a.variance.toFixed(1)}`}>
                          {a.num}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
