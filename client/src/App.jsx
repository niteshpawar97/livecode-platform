import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket.js';
import { useSocket } from './hooks/useSocket.js';
import { login, register, guestLogin, logout, refreshAccessToken, restoreGuestSession } from './api/auth.js';
import AuthForm from './components/AuthForm.jsx';
import JoinRoom from './components/JoinRoom.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import OutputPanel from './components/OutputPanel.jsx';
import Toolbar from './components/Toolbar.jsx';

function getRoomFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('room');
}

function updateUrl(newRoomId) {
  const url = new URL(window.location);
  if (newRoomId) {
    url.searchParams.set('room', newRoomId);
  } else {
    url.searchParams.delete('room');
  }
  window.history.replaceState({}, '', url);
}

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
}

export default function App() {
  const { isConnected } = useSocket();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme);
  const [lastEditor, setLastEditor] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // On mount: try to restore session (guest from sessionStorage, registered from refresh token)
  useEffect(() => {
    const guestSession = restoreGuestSession();
    if (guestSession) {
      setUser(guestSession.user);
      setAuthLoading(false);
      return;
    }

    refreshAccessToken()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  // Auto-join room from URL after auth is ready
  useEffect(() => {
    if (authLoading || !user || roomId) return;

    const urlRoom = getRoomFromUrl();
    if (urlRoom) {
      socket.connect();
      socket.emit('join-room', { roomId: urlRoom });
    }
  }, [authLoading, user, roomId]);

  // Socket event listeners
  useEffect(() => {
    function onRoomJoined(data) {
      setCode(data.code);
      setUsers(data.users);
      setRoomId(data.roomId);
      updateUrl(data.roomId);
      setLastEditor(null);
    }

    function onCodeUpdate(data) {
      setCode(data.code);
      if (data.username) {
        setLastEditor(data.username);
      }
    }

    function onUserJoined(data) {
      setUsers(data.users);
    }

    function onUserLeft(data) {
      setUsers(data.users);
    }

    function onExecutionResult(data) {
      setOutput(data.output || []);
      setError(data.error || null);
    }

    function onErrorMessage(data) {
      setError(data.message);
    }

    function onOnlineCount(data) {
      setOnlineCount(data.count);
    }

    function onConnectError(err) {
      if (err.message === 'Authentication required' || err.message === 'Invalid or expired token') {
        refreshAccessToken()
          .then(() => socket.connect())
          .catch(() => {
            setUser(null);
            setRoomId(null);
            updateUrl(null);
          });
      }
    }

    socket.on('room-joined', onRoomJoined);
    socket.on('code-update', onCodeUpdate);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);
    socket.on('execution-result', onExecutionResult);
    socket.on('error-message', onErrorMessage);
    socket.on('connect_error', onConnectError);
    socket.on('online-count', onOnlineCount);

    return () => {
      socket.off('room-joined', onRoomJoined);
      socket.off('code-update', onCodeUpdate);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
      socket.off('execution-result', onExecutionResult);
      socket.off('error-message', onErrorMessage);
      socket.off('connect_error', onConnectError);
      socket.off('online-count', onOnlineCount);
    };
  }, []);

  const handleAuth = useCallback(async ({ mode, email, password, username }) => {
    let data;
    if (mode === 'login') {
      data = await login(email, password);
    } else if (mode === 'register') {
      data = await register(email, password, username);
    } else {
      data = await guestLogin(username);
    }
    setUser(data.user);
  }, []);

  const handleLogout = useCallback(async () => {
    if (roomId) {
      socket.emit('leave-room', { roomId });
      socket.disconnect();
    }
    await logout();
    setUser(null);
    setRoomId(null);
    updateUrl(null);
    setCode('');
    setOutput([]);
    setError(null);
    setUsers([]);
    setLastEditor(null);
  }, [roomId]);

  const handleJoin = useCallback((newRoomId) => {
    socket.connect();
    socket.emit('join-room', { roomId: newRoomId });
  }, []);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    setLastEditor(null);
    if (roomId) {
      socket.emit('code-change', { roomId, code: newCode });
    }
  }, [roomId]);

  const handleRun = useCallback(() => {
    if (roomId) {
      setOutput([]);
      setError(null);
      socket.emit('run-code', { roomId });
    }
  }, [roomId]);

  const handleLeave = useCallback(() => {
    if (roomId) {
      socket.emit('leave-room', { roomId });
    }
    socket.disconnect();
    setRoomId(null);
    updateUrl(null);
    setCode('');
    setOutput([]);
    setError(null);
    setUsers([]);
    setLastEditor(null);
  }, [roomId]);

  const handleClearOutput = useCallback(() => {
    setOutput([]);
    setError(null);
  }, []);

  if (authLoading) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  if (!roomId) {
    return (
      <JoinRoom
        onJoin={handleJoin}
        onLogout={handleLogout}
        user={user}
        initialRoomId={getRoomFromUrl()}
      />
    );
  }

  return (
    <div className="app">
      <Toolbar
        roomId={roomId}
        users={users}
        isConnected={isConnected}
        onRun={handleRun}
        onLeave={handleLeave}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        lastEditor={lastEditor}
        onlineCount={onlineCount}
      />
      <div className="editor-layout">
        <CodeEditor code={code} onCodeChange={handleCodeChange} theme={theme} />
        <OutputPanel output={output} error={error} onClear={handleClearOutput} />
      </div>
    </div>
  );
}
