import ThemeToggle from './ThemeToggle.jsx';
import './Toolbar.css';

const USER_COLORS = ['#4ec9b0', '#ce9178', '#c586c0', '#569cd6', '#dcdcaa', '#9cdcfe', '#f44747', '#b5cea8'];

function getUserColor(index) {
  return USER_COLORS[index % USER_COLORS.length];
}

export default function Toolbar({ roomId, users, isConnected, onRun, onLeave, theme, onThemeToggle, lastEditor, onlineCount }) {
  const copyLink = () => {
    const url = new URL(window.location);
    url.searchParams.set('room', roomId);
    navigator.clipboard.writeText(url.toString());
  };

  return (
    <div className="toolbar">
      <div className="toolbar-row toolbar-top">
        <div className="toolbar-left">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
          <span className="room-label">
            Room: <strong>{roomId}</strong>
          </span>
          <button className="copy-btn" onClick={copyLink} title="Copy shareable link">
            Copy Link
          </button>
        </div>

        <div className="toolbar-center">
          <button id="run-btn" className="run-btn" onClick={onRun}>
            Run Code
            <span className="shortcut">Ctrl+Enter</span>
          </button>
        </div>

        <div className="toolbar-right">
          {onlineCount > 0 && (
            <span className="online-count" title="Users online on platform">
              <span className="online-pulse" />
              {onlineCount} online
            </span>
          )}
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <button className="leave-btn" onClick={onLeave}>
            Leave
          </button>
        </div>
      </div>

      <div className="toolbar-row toolbar-bottom">
        <div className="users-list">
          {users.map((u, i) => (
            <span key={u.id} className="user-badge" style={{ borderColor: getUserColor(i) }}>
              <span className="user-dot" style={{ background: getUserColor(i) }} />
              {u.username}
            </span>
          ))}
        </div>
        {lastEditor && (
          <span className="last-editor">
            Editing: <strong>{lastEditor}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
