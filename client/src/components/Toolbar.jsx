import ThemeToggle from './ThemeToggle.jsx';

const USER_COLORS = ['#4ec9b0', '#ce9178', '#c586c0', '#569cd6', '#dcdcaa', '#9cdcfe', '#f44747', '#b5cea8'];

function getUserColor(index) {
  return USER_COLORS[index % USER_COLORS.length];
}

export default function Toolbar({ roomId, users, isConnected, onLeave, theme, onThemeToggle, lastEditor, onlineCount }) {
  const copyLink = () => {
    const url = new URL(window.location);
    url.searchParams.set('room', roomId);
    navigator.clipboard.writeText(url.toString());
  };

  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-surface-bar border-b border-line gap-2 flex-wrap">
      {/* Left — Room info */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-ok' : 'bg-danger'}`} />
        <span className="text-[13px] text-content-muted whitespace-nowrap">
          Room: <strong className="text-content">{roomId}</strong>
        </span>
        <button onClick={copyLink} title="Copy shareable link"
          className="py-0.5 px-2 bg-transparent border border-line rounded text-content-muted text-[11px] cursor-pointer whitespace-nowrap hover:bg-line">
          Copy Link
        </button>
      </div>

      {/* Center — Users */}
      <div className="flex items-center gap-1.5 flex-wrap flex-1 justify-center min-w-0">
        {users.map((u, i) => (
          <span key={u.id} className="inline-flex items-center gap-1 py-0.5 px-2 bg-badge border-l-2 rounded text-xs text-content whitespace-nowrap" style={{ borderColor: getUserColor(i) }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: getUserColor(i) }} />
            {u.username}
          </span>
        ))}
        {lastEditor && (
          <span className="text-[11px] text-content-muted whitespace-nowrap">
            editing: <strong className="text-accent">{lastEditor}</strong>
          </span>
        )}
      </div>

      {/* Right — Online, Theme, Leave */}
      <div className="flex items-center gap-2 shrink-0">
        {onlineCount > 0 && (
          <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 bg-ok/10 border border-ok/30 rounded-xl text-xs font-medium text-ok whitespace-nowrap">
            <span className="w-1.75 h-1.75 rounded-full bg-ok animate-[pulse-dot_2s_ease-in-out_infinite] shrink-0" />
            {onlineCount}
          </span>
        )}
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <button onClick={onLeave}
          className="py-1 px-3 bg-transparent border border-danger rounded-md text-danger text-xs cursor-pointer whitespace-nowrap hover:bg-danger/10">
          Leave
        </button>
      </div>
    </div>
  );
}
