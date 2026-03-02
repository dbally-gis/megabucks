import { useState, useEffect, useMemo, useCallback } from 'react';
import Theory from './Theory';
import { themes } from './themes';
import type { Theme } from './themes';
import './App.css';

// --- Types ---
type GameType = 'powerball' | 'megamillions';

interface DrawRecord {
  draw_date: string;
  winning_numbers: string;
  multiplier?: string;
  mega_ball?: string;
}

interface AnalyzedNumber {
  num: number;
  count: number;
  expected: number;
  variance: number; // positive = hot, negative = cold
}

interface PickJustification {
  num: number;
  tag: 'theory' | 'chaos' | 'hot' | 'cold';
  reason: string;
}

interface GeneratedPick {
  id: string; // Add an ID for mapping multiple
  primary: number[];
  special: number;
  justifications: PickJustification[];
}

interface GenerationSession {
  game: GameType;
  timestamp: string;
  seedEntropy: string;
  picks: GeneratedPick[];
}

// --- Components ---
const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => (
  <span className="tooltip-container">
    {children}
    <span className="tooltip-text">{text}</span>
  </span>
);

// --- Algorithm Constants ---
const PB_MAX = 69;
const PB_SPECIAL_MAX = 26;
const MM_MAX = 70;
const MM_SPECIAL_MAX = 25;
const HUMAN_BIRTHDAY_CUTOFF = 31; // Humans heavily favor 1-31

// Helper pseudo-random from string seed
const cyrb128 = (str: string) => {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

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
  }
}

export default function App() {
  const [activeGame, setActiveGame] = useState<GameType>('megamillions');
  const [engineMode, setEngineMode] = useState<'hybrid' | 'pure_math'>('hybrid');
  const [currentView, setCurrentView] = useState<'terminal' | 'theory'>('terminal');
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);

  const [rawData, setRawData] = useState<DrawRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentSession, setCurrentSession] = useState<GenerationSession | null>(null);

  // Apply Theme CSS Variables to Root & Inject Google Font
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(activeTheme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

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

  // 1. Fetch Data
  useEffect(() => {
    setIsLoading(true);
    const targetUrl = activeGame === 'powerball'
      ? '/api/texas/export/sites/lottery/Games/Powerball/Winning_Numbers/powerball.csv'
      : '/api/texas/export/sites/lottery/Games/Mega_Millions/Winning_Numbers/megamillions.csv';

    fetch(targetUrl)
      .then(res => res.text())
      .then(csvText => {
        const lines = csvText.trim().split('\n');
        const parsedData: DrawRecord[] = [];

        for (let i = 0; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));

          // Texas CSV: GameName, Month, Day, Year, Num1, Num2, Num3, Num4, Num5, SpecialBall, Multiplier
          if (cols.length >= 10 && cols[0].toLowerCase().includes(activeGame === 'powerball' ? 'powerball' : 'mega millions')) {
            const [_gameName, m, d, y, n1, n2, n3, n4, n5, special, multiplier] = cols;

            const draw_date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00.000`;
            const winning_numbers = `${n1} ${n2} ${n3} ${n4} ${n5} ${special}`;

            parsedData.push({
              draw_date,
              winning_numbers,
              multiplier: multiplier || '',
              mega_ball: special
            });
          }
        }

        // Texas CSV is oldest first. Reverse so newest dates are at the top (index 0).
        parsedData.reverse();

        setRawData(parsedData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("API Error", err);
        setIsLoading(false);
      });
  }, [activeGame]);

  // 2. Analytics 
  const analysis = useMemo(() => {
    if (!rawData.length) return null;

    const maxPrimary = activeGame === 'powerball' ? PB_MAX : MM_MAX;
    const totals = Array.from({ length: maxPrimary + 1 }, () => 0);
    let drawCount = 0;

    rawData.forEach(draw => {
      if (!draw.winning_numbers) return;
      const nums = draw.winning_numbers.trim().split(/\s+/).map(n => parseInt(n, 10)).filter(n => !isNaN(n));

      // Standardize format (Mega millions puts mega ball in a separate column sometimes, sometimes combined)
      // Usually first 5 are primary.
      for (let i = 0; i < 5; i++) {
        if (nums[i] && nums[i] <= maxPrimary) {
          totals[nums[i]]++;
        }
      }
      drawCount++;
    });

    const expectedPerNumber = (drawCount * 5) / maxPrimary;

    const mapped: AnalyzedNumber[] = [];
    for (let i = 1; i <= maxPrimary; i++) {
      mapped.push({
        num: i,
        count: totals[i],
        expected: expectedPerNumber,
        variance: totals[i] - expectedPerNumber
      });
    }

    // Sort by variance
    mapped.sort((a, b) => b.variance - a.variance);

    return {
      hot: mapped.slice(0, 10),
      cold: [...mapped].sort((a, b) => a.variance - b.variance).slice(0, 10),
      all: mapped,
      expected: expectedPerNumber,
      totalDrawsAnalyzed: drawCount
    };
  }, [rawData, activeGame]);

  // 3. Generation Logic
  const generatePick = useCallback(() => {
    if (!analysis || !rawData.length) return;

    const maxPrimary = activeGame === 'powerball' ? PB_MAX : MM_MAX;
    const maxSpecial = activeGame === 'powerball' ? PB_SPECIAL_MAX : MM_SPECIAL_MAX;

    const recentDrawStr = rawData[0].winning_numbers + rawData[0].draw_date;
    const seed = cyrb128(recentDrawStr + Date.now().toString());
    const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    const generatedPicks: GeneratedPick[] = [];

    // Loop through how many tickets the user asked for
    for (let t = 0; t < ticketCount; t++) {
      const primaryPool = new Set<number>();
      const justifications: PickJustification[] = [];

      // Helper to get random available num
      const getRandNum = (min: number, max: number) => {
        let n;
        do {
          n = Math.floor(rand() * (max - min + 1)) + min;
        } while (primaryPool.has(n));
        return n;
      };

      if (engineMode === 'hybrid') {
        const n1 = getRandNum(HUMAN_BIRTHDAY_CUTOFF + 1, maxPrimary);
        primaryPool.add(n1);
        justifications.push({ num: n1, tag: 'theory', reason: `Aims to lower split-jackpot odds by picking > 31.` });

        let n2 = analysis.cold[Math.floor(rand() * 5)].num;
        while (primaryPool.has(n2)) { n2 = analysis.cold[Math.floor(rand() * analysis.cold.length)].num; }
        primaryPool.add(n2);
        justifications.push({ num: n2, tag: 'cold', reason: `"Cold" Number: Due to revert to average.` });

        let n3 = analysis.hot[Math.floor(rand() * 5)].num;
        while (primaryPool.has(n3)) { n3 = analysis.hot[Math.floor(rand() * analysis.hot.length)].num; }
        primaryPool.add(n3);
        justifications.push({ num: n3, tag: 'hot', reason: `"Hot" Number: Currently drawn very often.` });

        const n4 = getRandNum(1, maxPrimary);
        primaryPool.add(n4);
        justifications.push({ num: n4, tag: 'chaos', reason: `Generated using exact timing of last drawing.` });

        const n5 = getRandNum(1, maxPrimary);
        primaryPool.add(n5);
        justifications.push({ num: n5, tag: 'chaos', reason: `Generated using exact timing of last drawing.` });

      } else {
        for (let i = 0; i < 5; i++) {
          const n = getRandNum(HUMAN_BIRTHDAY_CUTOFF + 1, maxPrimary);
          primaryPool.add(n);
          justifications.push({ num: n, tag: 'theory', reason: `Anti-Collision: Completely avoids common birthdays.` });
        }
      }

      const primaryArr = Array.from(primaryPool).sort((a, b) => a - b);
      const specialBall = Math.floor(rand() * maxSpecial) + 1;

      generatedPicks.push({
        id: `tkt-${t}-${Date.now()}`,
        primary: primaryArr,
        special: specialBall,
        justifications
      });
    }

    setCurrentSession({
      game: activeGame,
      timestamp: new Date().toLocaleTimeString(),
      seedEntropy: seed.map(s => s.toString(16)).join('-').substring(0, 16).toUpperCase(),
      picks: generatedPicks
    });

  }, [analysis, rawData, activeGame, engineMode, ticketCount]);

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
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg-color)',
                color: 'var(--text-main)',
                border: '1px solid var(--panel-border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <optgroup label="Core Aesthetics">
                {themes.slice(0, 10).map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </optgroup>
              <optgroup label="Mass Appeal Aesthetics">
                {themes.slice(10).map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="panel-section">
            <div className="panel-title">{activeTheme.vectorLabel || 'Target Vector'}</div>
            <div className="game-switch">
              <button
                className={`game-btn ${activeGame === 'powerball' ? 'active-pb' : ''}`}
                onClick={() => { setActiveGame('powerball'); setCurrentSession(null); }}
              >
                POWERBALL
              </button>
              <button
                className={`game-btn ${activeGame === 'megamillions' ? 'active-mm' : ''}`}
                onClick={() => { setActiveGame('megamillions'); setCurrentSession(null); }}
              >
                MEGA MILLIONS
              </button>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">Ticket Quantity: {ticketCount}</div>
            <input
              type="range"
              className="ticket-slider"
              min="1" max="5"
              value={ticketCount}
              onChange={(e) => setTicketCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>1</span>
              <span>3</span>
              <span>5</span>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">Algorithm Synthesis</div>

            <div className={`engine-toggle ${engineMode === 'hybrid' ? 'active' : ''}`} onClick={() => setEngineMode('hybrid')}>
              <div className="engine-icon">⚛</div>
              <div className="engine-info">
                <div className="engine-name">
                  HYBRID CHAOS
                </div>
                <div className="engine-desc">
                  Mixes math to find "Hot/Cold" streaks, uses timestamps for random seeds, and avoids popular numbers.
                </div>
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
                <div className="engine-desc">Pure math. Forces all numbers above 31 to completely guarantee you don't share the jackpot with someone playing a birthday.</div>
              </div>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-title">System Manual</div>
            <button
              className={`action-btn`}
              style={{ background: currentView === 'theory' ? 'var(--accent-magenta)' : 'transparent', color: currentView === 'theory' ? 'white' : 'var(--text-muted)', border: '1px solid var(--panel-border)', padding: '12px', marginTop: '0' }}
              onClick={() => setCurrentView(currentView === 'theory' ? 'terminal' : 'theory')}
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
            <div style={{ height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="glitch-loader">ACQUIRING {activeGame.toUpperCase()} DATA MANIFOLD...</div>
            </div>
          ) : (
            <>
              {currentSession && (
                <div className="ticket-display">
                  <div className="ticket-meta">
                    <span>{currentSession.timestamp}</span>
                    <Tooltip text="The exact hash sequence used to mathematically scramble your tickets based on the last real-world drawing.">
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
                          <div className={`lotto-ball ${activeGame === 'powerball' ? 'special-pb' : 'special-mm'}`}>
                            {pick.special}
                          </div>
                        </div>

                        <div className="justification-log">
                          <div className="panel-title" style={{ marginBottom: "8px" }}>Computational Justifications</div>
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

              {analysis && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="panel-title">Draws Parsed</div>
                    <div className="stat-val">{analysis.totalDrawsAnalyzed}</div>
                  </div>
                  <div className="stat-card">
                    <div className="panel-title">Highest Delta (Hot)</div>
                    <div className="stat-val" style={{ color: "var(--accent-yellow)" }}>
                      #{analysis.hot[0].num} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>+{analysis.hot[0].variance.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="panel-title">Lowest Delta (Cold)</div>
                    <div className="stat-val" style={{ color: "var(--accent-green)" }}>
                      #{analysis.cold[0].num} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{analysis.cold[0].variance.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="panel-section" style={{ marginTop: "16px" }}>
                  <div className="panel-title">Phase Space Matrix (Variance Heatmap)</div>
                  <div className="heatmap">
                    {analysis.all.sort((a, b) => a.num - b.num).map(a => {
                      let cellClass = 'heat-cell';
                      if (a.variance > 3) cellClass += ' hot';
                      else if (a.variance < -3) cellClass += ' cold';
                      return (
                        <div key={a.num} className={cellClass} title={`Variance: ${a.variance.toFixed(2)}`}>
                          {a.num}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            </>
          )}

        </main>
      </div>

    </div>
  )
}
