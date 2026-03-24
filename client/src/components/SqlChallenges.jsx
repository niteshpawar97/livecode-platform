import { useState } from 'react';

const DIFF_COLORS = { basic: '#4ec9b0', intermediate: '#dcdcaa', advanced: '#f44747' };
const DIFF_LABELS = { basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced' };

/* ─── Animated Loader: person working on laptop ─── */
function CodingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="animate-[float_2s_ease-in-out_infinite]">
        {/* Desk */}
        <rect x="15" y="70" width="90" height="4" rx="2" fill="var(--border)" />
        <rect x="25" y="74" width="4" height="16" rx="1" fill="var(--border)" />
        <rect x="91" y="74" width="4" height="16" rx="1" fill="var(--border)" />

        {/* Laptop base */}
        <rect x="30" y="58" width="50" height="12" rx="2" fill="var(--bg-toolbar)" stroke="var(--border)" strokeWidth="1" />

        {/* Laptop screen */}
        <rect x="33" y="28" width="44" height="30" rx="2" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1.5" />

        {/* Code lines on screen (animated) */}
        <rect x="38" y="34" width="20" height="2" rx="1" fill="var(--accent)" opacity="0.8">
          <animate attributeName="width" values="20;28;20" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <rect x="38" y="39" width="14" height="2" rx="1" fill="var(--success)" opacity="0.6">
          <animate attributeName="width" values="14;22;14" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="38" y="44" width="24" height="2" rx="1" fill="var(--accent)" opacity="0.5">
          <animate attributeName="width" values="24;16;24" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <rect x="38" y="49" width="10" height="2" rx="1" fill="var(--success)" opacity="0.4">
          <animate attributeName="width" values="10;18;10" dur="1.3s" repeatCount="indefinite" />
        </rect>

        {/* Cursor blink */}
        <rect x="48" y="49" width="2" height="3" fill="var(--accent)">
          <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
        </rect>

        {/* Person - body */}
        <circle cx="88" cy="35" r="7" fill="var(--accent)" opacity="0.8" />
        <rect x="84" y="42" width="8" height="16" rx="3" fill="var(--accent)" opacity="0.6" />

        {/* Person - arms typing */}
        <line x1="84" y1="48" x2="72" y2="58" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
          <animate attributeName="x2" values="72;70;72" dur="0.5s" repeatCount="indefinite" />
        </line>
        <line x1="92" y1="48" x2="78" y2="58" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
          <animate attributeName="x2" values="78;80;78" dur="0.5s" repeatCount="indefinite" />
        </line>

        {/* Coffee cup */}
        <rect x="10" y="60" width="10" height="10" rx="2" fill="var(--bg-toolbar)" stroke="var(--border)" strokeWidth="1" />
        <path d="M20 63 Q24 63 24 67 Q24 70 20 70" stroke="var(--border)" strokeWidth="1" fill="none" />
        {/* Steam */}
        <path d="M13 58 Q14 54 13 50" stroke="var(--text-secondary)" strokeWidth="0.8" fill="none" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M16 57 Q17 53 16 49" stroke="var(--text-secondary)" strokeWidth="0.8" fill="none" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite" />
        </path>
      </svg>
      <div className="text-sm text-content-muted font-medium animate-pulse">Loading challenges...</div>
    </div>
  );
}

export default function SqlChallenges({ challenges = [], loading = false, onSelectChallenge, activeChallenge, verifyResult, onClearResult }) {
  const [filter, setFilter] = useState('all');
  const [showHint, setShowHint] = useState(false);

  const filtered = filter === 'all' ? challenges : challenges.filter(c => c.difficulty === filter);
  const currentIndex = activeChallenge ? filtered.findIndex(c => c.id === activeChallenge.id) : -1;
  const prevChallenge = currentIndex > 0 ? filtered[currentIndex - 1] : null;
  const nextChallenge = currentIndex < filtered.length - 1 ? filtered[currentIndex + 1] : null;

  const goTo = (challenge) => {
    onSelectChallenge(challenge);
    setShowHint(false);
    onClearResult();
  };

  /* ─── Loading state ─── */
  if (loading || challenges.length === 0) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between py-2.5 px-3 bg-surface-bar border-b border-line">
          <span className="text-[13px] font-bold text-content">SQL Challenges</span>
        </div>
        <CodingLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Challenge list */}
      {!activeChallenge && (
        <>
          <div className="flex items-center justify-between py-2.5 px-3 bg-surface-bar border-b border-line">
            <span className="text-[13px] font-bold text-content">SQL Challenges</span>
            <span className="text-[11px] text-content-muted py-0.5 px-2 bg-surface-alt rounded-xl">{challenges.length} Questions</span>
          </div>
          <div className="flex gap-1 py-2 px-3 border-b border-line flex-wrap">
            {['all', 'basic', 'intermediate', 'advanced'].map(f => (
              <button key={f}
                className={`py-1 px-2.5 border rounded-xl text-[11px] cursor-pointer whitespace-nowrap transition-colors
                  ${filter === f ? 'bg-accent text-white border-accent' : 'bg-transparent text-content-muted border-line hover:bg-surface-alt'}`}
                onClick={() => setFilter(f)}>
                {f === 'all' ? `All (${challenges.length})` : `${DIFF_LABELS[f]} (${challenges.filter(c => c.difficulty === f).length})`}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
            {filtered.map((c) => (
              <button key={c.id}
                className="flex flex-col gap-1 py-2.5 px-3 border border-line rounded-lg bg-surface-alt cursor-pointer text-left transition-colors hover:border-accent"
                onClick={() => goTo(c)}>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-accent bg-accent/10 py-px px-1.5 rounded">Q{c.id}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: DIFF_COLORS[c.difficulty] }}>{DIFF_LABELS[c.difficulty]}</span>
                </div>
                <div className="text-[13px] font-medium text-content">{c.title}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Active challenge */}
      {activeChallenge && (
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between py-2 px-3 bg-surface-bar border-b border-line">
            <button onClick={() => goTo(null)}
              className="py-1 px-2.5 bg-transparent border border-line rounded text-accent text-xs font-semibold cursor-pointer hover:bg-surface-alt">
              &larr; All Questions
            </button>
            <span className="text-[11px] text-content-muted font-semibold py-0.5 px-2 bg-surface-alt rounded-lg">
              {currentIndex + 1} / {filtered.length}
            </span>
          </div>

          <div className="p-3.5 border-b border-line">
            <div className="flex gap-2 items-center mb-2">
              <span className="text-[11px] font-bold text-accent bg-accent/10 py-px px-1.5 rounded">Q{activeChallenge.id}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: DIFF_COLORS[activeChallenge.difficulty] }}>{DIFF_LABELS[activeChallenge.difficulty]}</span>
            </div>
            <h3 className="text-base font-bold text-content mb-2">{activeChallenge.title}</h3>
            <p className="text-sm text-content leading-relaxed mb-2.5">{activeChallenge.question}</p>

            <button onClick={() => setShowHint(!showHint)}
              className="py-1.5 px-3 border border-line rounded-md bg-transparent text-content-muted text-xs cursor-pointer hover:bg-surface-alt">
              {showHint ? 'Hint hide' : 'Hint show'}
            </button>
            {showHint && (
              <div className="mt-2 py-2 px-3 bg-[rgba(220,220,170,0.1)] border-l-[3px] border-l-[#dcdcaa] rounded-r-md text-[13px] text-[#dcdcaa] font-mono">
                {activeChallenge.hint}
              </div>
            )}
          </div>

          {/* Verify result */}
          {verifyResult && (
            <div className={`p-3.5 m-2.5 rounded-lg border ${verifyResult.correct ? 'border-ok bg-ok/8' : 'border-danger bg-danger/8'}`}>
              <div className={`text-base font-bold mb-1.5 ${verifyResult.correct ? 'text-ok' : 'text-danger'}`}>
                {verifyResult.correct ? 'Sahi Jawab!' : 'Galat Jawab'}
              </div>
              <p className="text-[13px] text-content mb-3 leading-snug">{verifyResult.explanation}</p>

              <div className="mb-2.5">
                <div className="text-xs font-semibold text-content-muted mb-1.5">
                  {verifyResult.correct ? 'Aapne ye query likhi:' : 'Sahi Query (Answer):'}
                </div>
                <pre className="py-2.5 px-3 bg-surface border border-line rounded-md font-mono text-xs text-accent whitespace-pre-wrap break-all overflow-x-auto">
                  {verifyResult.correctQuery}
                </pre>
              </div>

              {!verifyResult.correct && verifyResult.expectedResult && (
                <div className="mt-2.5">
                  <div className="text-xs font-semibold text-content-muted mb-1.5">Expected Result:</div>
                  <div className="overflow-x-auto border border-line rounded-md">
                    <table className="w-full border-collapse text-[11px] font-mono">
                      <thead>
                        <tr>
                          {verifyResult.expectedResult.columns.map((col, i) => (
                            <th key={i} className="bg-surface-bar py-1.5 px-2 text-left font-semibold text-accent border-b border-line">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {verifyResult.expectedResult.rows.slice(0, 5).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="py-1 px-2 border-b border-line text-content">{cell === null ? 'NULL' : String(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {verifyResult.expectedResult.rowCount > 5 && (
                      <div className="py-1 px-2 text-[11px] text-content-muted text-center">...aur {verifyResult.expectedResult.rowCount - 5} rows</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prev / Next */}
          <div className="flex gap-2 p-3 mt-auto border-t border-line bg-surface-bar">
            <button onClick={() => goTo(prevChallenge)} disabled={!prevChallenge}
              className="flex-1 py-2 px-3 border border-line rounded-md bg-surface-alt text-content text-xs font-semibold cursor-pointer transition-colors hover:border-accent hover:bg-surface-bar disabled:opacity-30 disabled:cursor-not-allowed">
              &larr; Prev
            </button>
            <button onClick={() => goTo(nextChallenge)} disabled={!nextChallenge}
              className="flex-1 py-2 px-3 border border-line rounded-md bg-surface-alt text-content text-xs font-semibold cursor-pointer transition-colors hover:border-accent hover:bg-surface-bar disabled:opacity-30 disabled:cursor-not-allowed">
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
