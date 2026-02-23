import { useEffect, useRef } from 'react';
import './OutputPanel.css';

export default function OutputPanel({ output, error, onClear }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, error]);

  return (
    <div className="output-panel">
      <div className="output-header">
        <span>Output</span>
        <button onClick={onClear} className="clear-btn">Clear</button>
      </div>
      <div className="output-content">
        {output.length === 0 && !error && (
          <div className="output-placeholder">Run code to see output here...</div>
        )}
        {output.map((line, i) => (
          <div key={i} className="output-line">{line}</div>
        ))}
        {error && <div className="output-error">{error}</div>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
