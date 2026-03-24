import { useState, useEffect, useRef } from 'react';

function SchemaPanel({ schema }) {
  const [open, setOpen] = useState(false);

  if (!schema || schema.length === 0) return null;

  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full py-1.5 px-3 bg-surface-alt border-none cursor-pointer text-xs font-semibold text-accent text-left hover:bg-surface-bar">
        <span className="text-[10px] w-3">{open ? '\u25BE' : '\u25B8'}</span>
        <span>Tables ({schema.length})</span>
        {!open && (
          <span className="font-normal text-content-muted text-[11px] ml-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {schema.map(t => t.table).join(' \u00B7 ')}
          </span>
        )}
      </button>
      {open && (
        <div className="flex flex-col gap-px py-1.5 px-2.5 bg-surface-alt max-h-[220px] overflow-y-auto">
          {schema.map((t) => (
            <div key={t.table} className="flex items-start gap-2 py-1.5 px-2 rounded text-[11px] font-mono hover:bg-surface-bar">
              <span className="font-bold text-accent min-w-20 shrink-0 pt-px">{t.table}</span>
              <span className="flex flex-wrap gap-x-2 gap-y-0.5 flex-1">
                {t.columns.map((col) => (
                  <span key={col.name} className="inline-flex items-center gap-0.5 text-content">
                    {col.name}
                    <span className="text-content-muted text-[10px]">{col.type}</span>
                    {col.key && <span className="text-[9px] py-0 px-1 rounded-sm bg-accent/15 text-accent font-bold">{col.key}</span>}
                  </span>
                ))}
              </span>
              <span className="text-content-muted text-[10px] shrink-0 pt-px">{t.rowCount} rows</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SqlOutput({ result, error, loading, onClear }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [result, error]);

  return (
    <div className="flex-2 min-w-0 flex flex-col bg-surface max-md:flex-none max-md:w-full max-md:h-50 max-md:border-t max-md:border-line">
      <div className="flex items-center justify-between px-3 py-2 bg-surface-bar border-b border-line text-[13px] font-semibold text-content-muted">
        <span>SQL Result</span>
        <button onClick={onClear} className="py-1 px-2.5 bg-transparent border border-line rounded text-content-muted text-xs cursor-pointer hover:bg-line">Clear</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <svg width="100" height="85" viewBox="0 0 120 100" fill="none" className="animate-[float_2s_ease-in-out_infinite]">
              <rect x="15" y="70" width="90" height="4" rx="2" fill="var(--border)" />
              <rect x="25" y="74" width="4" height="16" rx="1" fill="var(--border)" />
              <rect x="91" y="74" width="4" height="16" rx="1" fill="var(--border)" />
              <rect x="30" y="58" width="50" height="12" rx="2" fill="var(--bg-toolbar)" stroke="var(--border)" strokeWidth="1" />
              <rect x="33" y="28" width="44" height="30" rx="2" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1.5" />
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
              <rect x="48" y="49" width="2" height="3" fill="var(--accent)">
                <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
              </rect>
              <circle cx="88" cy="35" r="7" fill="var(--accent)" opacity="0.8" />
              <rect x="84" y="42" width="8" height="16" rx="3" fill="var(--accent)" opacity="0.6" />
              <line x1="84" y1="48" x2="72" y2="58" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
                <animate attributeName="x2" values="72;70;72" dur="0.5s" repeatCount="indefinite" />
              </line>
              <line x1="92" y1="48" x2="78" y2="58" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
                <animate attributeName="x2" values="78;80;78" dur="0.5s" repeatCount="indefinite" />
              </line>
              <rect x="10" y="60" width="10" height="10" rx="2" fill="var(--bg-toolbar)" stroke="var(--border)" strokeWidth="1" />
              <path d="M20 63 Q24 63 24 67 Q24 70 20 70" stroke="var(--border)" strokeWidth="1" fill="none" />
              <path d="M13 58 Q14 54 13 50" stroke="var(--text-secondary)" strokeWidth="0.8" fill="none" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M16 57 Q17 53 16 49" stroke="var(--text-secondary)" strokeWidth="0.8" fill="none" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite" />
              </path>
            </svg>
            <div className="text-sm text-accent font-medium animate-pulse">Running query...</div>
          </div>
        )}

        {!loading && !result && !error && (
          <div className="p-3 text-content-muted italic">
            Run a SELECT query to see results here...
            <div className="mt-3.5 flex flex-col gap-1 not-italic">
              <div className="text-xs font-bold text-content mb-0.5">Available Tables:</div>
              <div className="text-xs font-mono text-accent font-semibold py-0.5">departments <span className="font-normal text-content-muted text-[11px]">(id, name, budget, location)</span></div>
              <div className="text-xs font-mono text-accent font-semibold py-0.5">employees <span className="font-normal text-content-muted text-[11px]">(id, name, email, department_id, salary, city, hire_date, manager_id)</span></div>
              <div className="text-xs font-mono text-accent font-semibold py-0.5">products <span className="font-normal text-content-muted text-[11px]">(id, name, category, price, stock)</span></div>
              <div className="text-xs font-mono text-accent font-semibold py-0.5">customers <span className="font-normal text-content-muted text-[11px]">(id, name, email, city, country, joined_date)</span></div>
              <div className="text-xs font-mono text-accent font-semibold py-0.5">orders <span className="font-normal text-content-muted text-[11px]">(id, customer_id, product_id, quantity, total_amount, order_date, status)</span></div>
              <div className="text-xs font-mono text-accent font-semibold py-0.5">students <span className="font-normal text-content-muted text-[11px]">(id, name, class, city)</span></div>
              <div className="text-xs font-mono text-accent font-semibold py-0.5">marks <span className="font-normal text-content-muted text-[11px]">(id, student_id, subject, score)</span></div>
            </div>
            <div className="mt-2 text-[13px] text-content-muted not-italic">
              <strong className="text-content">Try:</strong> SELECT * FROM employees
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="p-3 text-danger whitespace-pre-wrap break-all">{error}</div>
        )}

        {!loading && result && (
          <>
            {result.schema && <SchemaPanel schema={result.schema} />}

            {result.columns.length > 0 && (
              <div className="overflow-x-auto flex-1">
                <table className="w-full border-collapse text-[13px] font-mono">
                  <thead>
                    <tr>
                      {result.columns.map((col, i) => (
                        <th key={i} className="sticky top-0 bg-surface-bar py-2 px-3 text-left font-semibold text-accent border-b-2 border-line whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-accent/5">
                        {row.map((cell, j) => (
                          <td key={j} className="py-1.5 px-3 border-b border-line text-content whitespace-nowrap">
                            {cell === null ? <span className="text-content-muted italic">NULL</span> : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="py-2 px-3 text-xs text-content-muted border-t border-line">{result.message}</div>
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
