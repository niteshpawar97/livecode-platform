import { useEffect, useRef } from 'react';

export default function OutputPanel({ output, error, onClear }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, error]);

  return (
    <div className="flex-2 min-w-0 flex flex-col bg-surface max-md:flex-none max-md:w-full max-md:h-[200px] max-md:border-t max-md:border-line">
      <div className="flex items-center justify-between px-3 py-2 bg-surface-bar border-b border-line text-[13px] font-semibold text-content-muted">
        <span>Output</span>
        <button onClick={onClear} className="py-1 px-2.5 bg-transparent border border-line rounded text-content-muted text-xs cursor-pointer hover:bg-line">Clear</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-base leading-relaxed">
        {output.length === 0 && !error && (
          <div className="text-content-muted italic">Run code to see output here...</div>
        )}
        {output.map((line, i) => (
          <div key={i} className="text-content whitespace-pre-wrap break-all py-px">{line}</div>
        ))}
        {error && <div className="text-danger whitespace-pre-wrap break-all py-1">{error}</div>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
