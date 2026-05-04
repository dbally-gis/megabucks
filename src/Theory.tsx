import React from 'react';

const Theory: React.FC = () => {
    return (
        <div className="theory-container" style={{ padding: '0 24px', maxWidth: '900px', margin: '0 auto' }}>
            <div className="theory-header" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', color: 'var(--accent-cyan)' }}>THEORETICAL FRAMEWORK</h1>
                <p style={{ color: 'var(--text-muted)' }}>Documentation of the algorithmic processes powering the Megabucks engine.</p>
            </div>

            <section className="theory-section" style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)', borderBottom: '1px dashed var(--panel-border)', paddingBottom: '8px', marginBottom: '16px' }}>
                    LEVEL 1: ELI10 (Explain Like I'm 10)
                </h2>
                <div style={{ lineHeight: '1.6', color: '#e0e5ff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p>
                        Imagine you are flipping a coin. No matter how many times it lands on "Heads", the next flip is always a 50/50 chance. The lottery is just like that, but with a giant machine full of balls. <strong>It is impossible to perfectly predict the future.</strong>
                    </p>
                    <p>
                        So, how does Megabucks help? It's not magic; it's about playing <em>smarter</em>.
                    </p>
                    <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>
                            <strong>The Birthday Problem:</strong> Most people pick lottery numbers based on birthdays or anniversaries. That means numbers from 1 to 31 are chosen WAY more often than numbers from 32 to 70. Megabucks avoids numbers 1 to 31. This doesn't help you win, but if you DO win, you are much less likely to have to share the giant jackpot with 10 other people who also played their grandma's birthday!
                        </li>
                        <li>
                            <strong>Hot and Cold — Display Only:</strong> Megabucks shows you which numbers have appeared more or less often in past drawings. This is <em>informational only</em>. Each drawing is completely independent — a number being "cold" for 100 draws does not make it any more likely to appear on draw 101. The engine does <em>not</em> use hot/cold data to pick your numbers, because doing so would be the gambler's fallacy.
                        </li>
                        <li>
                            <strong>Truly Random Seeds:</strong> Megabucks uses your browser's built-in cryptographic random generator — the same one used in banking software — to produce each ticket. It is genuinely unpredictable, not based on the clock or the last drawing.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="theory-section">
                <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-magenta)', borderBottom: '1px dashed var(--panel-border)', paddingBottom: '8px', marginBottom: '16px' }}>
                    LEVEL 2: PhD / QUANTITATIVE ANALYSIS
                </h2>
                <div style={{ lineHeight: '1.6', color: '#e0e5ff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p>
                        The Megabucks terminal abandons the fallacy of true clairvoyance in perfectly random cryptographic systems, instead optimizing for <strong>Expected Value (EV) maximization within parimutuel betting pools</strong> using verifiable cryptographic randomness.
                    </p>

                    <h3 style={{ color: 'var(--accent-cyan)', marginTop: '16px', fontSize: '1.1rem' }}>I. Game-Theoretic Expected Value Optimization</h3>
                    <p>
                        In parimutuel games like Powerball and Mega Millions, the jackpot is divided equally among all ticket holders containing the winning combination. The expected value $E[V]$ of a ticket is a function of the jackpot size $J$, the probability of winning $P(W)$, and the expected number of co-winners $E[k]$:
                        <br /><br />
                        <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>E[V] ≈ (J / (1 + E[k])) * P(W) - Cost</code>
                    </p>
                    <p>
                        Human selection sets are massively non-uniform. Analysis of historical ticket purchases reveals extreme probabilistic density trailing up to n=31 (calendar day heuristics). By constraining the primary generation pool to the domain n ∈ [32, Max], the Megabucks "Max EV" function mathematically minimizes the collision vector E[k]. While P(W) remains constant, minimizing E[k] exponentially increases E[V] during hyper-jackpot events (&gt;$1 Billion). Furthermore, terminal configurations implicitly adjust for state-level taxation variance (e.g., zero state income tax in Texas raises the effective J ceiling).
                    </p>

                    <h3 style={{ color: 'var(--accent-cyan)', marginTop: '16px', fontSize: '1.1rem' }}>II. Historical Frequency Display — Not a Prediction Tool</h3>
                    <p>
                        Physical tumbling machines are built to exhibit high thermodynamic entropy and approach a uniform geometric distribution $U(a,b)$ over $n$ draws. Each draw is an independent event. The variance $\sigma^2$ of individual number frequencies against the idealized uniform expectation $E[X]$ reflects <em>past</em> sampling noise, not future probability.
                    </p>
                    <p>
                        <strong>The Mean Reversion Fallacy:</strong> A common error is to treat a "cold" number as statistically overdue. This is the gambler's fallacy. Given independence of draws, P(n | history) = P(n) — the lottery machine has no memory. Megabucks displays historical frequency as a reference heatmap only. The generation engine does <em>not</em> inject hot or cold numbers into picks; doing so would reduce pick quality by introducing a bias toward numbers that offer no mathematical advantage.
                    </p>

                    <h3 style={{ color: 'var(--accent-cyan)', marginTop: '16px', fontSize: '1.1rem' }}>III. Cryptographic Entropy &amp; CSPRNG Architecture</h3>
                    <p>
                        Megabucks sources entropy exclusively from <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>crypto.getRandomValues()</code> — the browser's CSPRNG, backed by the OS entropy pool (e.g., <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>/dev/urandom</code> on Linux, <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>BCryptGenRandom</code> on Windows). This produces 128 bits of non-deterministic entropy per generation session — statistically indistinguishable from the underlying physical process. The 128-bit seed initializes a 32-bit Shift-Register Generator (<code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>sfc32</code>) for fast uniform sampling over the target number range.
                    </p>
                    <p>
                        Prior versions seeded generation from the last draw's timestamp — a deterministic, low-entropy approach that introduced correlation between all tickets generated within the same second. The CSPRNG architecture eliminates this vulnerability entirely.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Theory;
