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
                        So, how does Megabucks help? It's not magic; it’s about playing <em>smarter</em>.
                    </p>
                    <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>
                            <strong>The Birthday Problem:</strong> Most people pick lottery numbers based on birthdays or anniversaries. That means numbers from 1 to 31 are chosen WAY more often than numbers from 32 to 70. Megabucks avoids numbers 1 to 31. This doesn't help you win, but if you DO win, you are much less likely to have to share the giant jackpot with 10 other people who also played their grandma's birthday!
                        </li>
                        <li>
                            <strong>Hot and Cold:</strong> Imagine a bucket of paint. If you stir it, some colors clump together before mixing perfectly. Megabucks looks at the last 500 lottery drawings to see if certain numbers are "clumping" (being drawn a lot lately) or if they are "hiding" (haven't been drawn in a long time) and sprinkles them into your ticket.
                        </li>
                        <li>
                            <strong>The Physics Scatter:</strong> Instead of asking a computer to just guess a random number, Megabucks uses the exact time and numbers of the <em>last</em> drawing to calculate a chaotic, bouncing path—like dropping a pinball—to arrive at your numbers.
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
                        The Megabucks terminal abandons the fallacy of true clairvoyance in perfectly random cryptographic systems, instead optimizing for <strong>Expected Value (EV) maximization within parimutuel betting pools</strong> and exploring <strong>deterministic chaos modeling</strong>.
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

                    <h3 style={{ color: 'var(--accent-cyan)', marginTop: '16px', fontSize: '1.1rem' }}>II. Phase Space Heat-Mapping & Mean Reversion</h3>
                    <p>
                        While physical tumbling machines are built specifically to exhibit high thermodynamic entropy and approach a uniform geometric distribution $U(a,b)$ over $n$ draws, structural degradation, micro-variations in ball mass, and turbulent airflow asymmetries in pneumatic mixing columns can induce low-amplitude deviations.
                    </p>
                    <p>
                        Megabucks continuously parses the $n=500$ historical dataset to compute the variance $\sigma^2$ of individual number frequencies against the idealized uniform expectation value $E[X]$. The topological interface maps these variances onto a phase space. Positive outliers (Hot) are treated as transient momentum vectors. Extreme negative outliers (Cold) trigger the <strong>Mean Reversion Postulate</strong>—the statistical inevitability that, given a sufficiently large sample size $N \to \infty$, trailing components must regress toward the mean frequency. The algorithm injects these standard deviation outliers to exploit potential short-term mechanical biases.
                    </p>

                    <h3 style={{ color: 'var(--accent-cyan)', marginTop: '16px', fontSize: '1.1rem' }}>III. Deterministic Chaos & Monte Carlo Topography</h3>
                    <p>
                        Rather than relying on the uniformly distributed outputs of standard browser `Math.random()` PRNGs, Megabucks roots its entropy in observed physical state vectors.
                        The system constructs a 128-bit Cypher-Hash (`cyrb128`) seeded by concatenating the exact Cartesian coordinates (number set + timestamp) of the most recent physical drawing. This deterministic seed initializes a 32-bit Shift-Register Generator (`sfc32`), mathematically mirroring the sensitive dependence on initial conditions (the "Butterfly Effect") found in non-linear fluid dynamics. The generation matrix conceptually emulates a Monte Carlo collision simulation, mapping the previous draw's chaotic footprint into forward-projected vectors for the upcoming draw.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Theory;
