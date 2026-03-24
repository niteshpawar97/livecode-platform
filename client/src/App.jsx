import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket.js';
import { useSocket } from './hooks/useSocket.js';
import { login, register, guestLogin, logout, refreshAccessToken, restoreGuestSession } from './api/auth.js';
import AuthForm from './components/AuthForm.jsx';
import JoinRoom from './components/JoinRoom.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import OutputPanel from './components/OutputPanel.jsx';
import SqlOutput from './components/SqlOutput.jsx';
import SqlChallenges from './components/SqlChallenges.jsx';
import Toolbar from './components/Toolbar.jsx';
import LanguageSidebar from './components/LanguageSidebar.jsx';
import LandingPage from './components/LandingPage.jsx';

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
  const [showLanding, setShowLanding] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlCode, setSqlCode] = useState('-- Try any query! Example: Top 3 highest paid per department\nSELECT\n  d.name AS department,\n  e.name AS employee,\n  e.salary,\n  e.city\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id\nWHERE e.salary > (\n  SELECT AVG(salary) FROM employees\n)\nORDER BY e.salary DESC');
  const [sqlMode, setSqlMode] = useState('playground'); // 'playground' | 'challenges'
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(false);

  // Prefetch challenges as soon as user is authenticated (background)
  useEffect(() => {
    if (!user) return;
    setChallengesLoading(true);
    fetch('/api/execute-sql/challenges')
      .then(r => r.json())
      .then(data => setChallenges(data.challenges || []))
      .catch(() => {})
      .finally(() => setChallengesLoading(false));
  }, [user]);

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
      if (data.sqlCode) setSqlCode(data.sqlCode);
      setUsers(data.users);
      setRoomId(data.roomId);
      updateUrl(data.roomId);
      setLastEditor(null);
    }

    function onCodeUpdate(data) {
      if (data.language === 'sql') {
        setSqlCode(data.code);
      } else {
        setCode(data.code);
      }
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
      socket.emit('code-change', { roomId, code: newCode, language: 'javascript' });
    }
  }, [roomId]);

  const handleSqlCodeChange = useCallback((newCode) => {
    setSqlCode(newCode);
    setLastEditor(null);
    if (roomId) {
      socket.emit('code-change', { roomId, code: newCode, language: 'sql' });
    }
  }, [roomId]);

  const handleRunSql = useCallback(async () => {
    setSqlResult(null);
    setSqlError(null);
    setSqlLoading(true);
    try {
      const res = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSqlError(data.error || 'Query failed.');
      } else {
        setSqlResult(data);
      }
    } catch (err) {
      setSqlError('Network error. Could not reach the server.');
    } finally {
      setSqlLoading(false);
    }
  }, [sqlCode]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!activeChallenge) return;
    setSqlLoading(true);
    setVerifyResult(null);
    setSqlResult(null);
    setSqlError(null);
    try {
      const res = await fetch('/api/execute-sql/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: activeChallenge.id, query: sqlCode }),
      });
      const data = await res.json();
      setVerifyResult(data);
      if (data.userResult) {
        setSqlResult(data.userResult);
      }
      if (data.userError) {
        setSqlError(data.userError);
      }
    } catch {
      setSqlError('Network error.');
    } finally {
      setSqlLoading(false);
    }
  }, [activeChallenge, sqlCode]);

  const handleRun = useCallback(() => {
    if (language === 'sql') {
      if (sqlMode === 'challenges' && activeChallenge) {
        handleSubmitAnswer();
      } else {
        handleRunSql();
      }
      return;
    }
    if (roomId) {
      setOutput([]);
      setError(null);
      socket.emit('run-code', { roomId });
    }
  }, [roomId, language, handleRunSql, sqlMode, activeChallenge, handleSubmitAnswer]);

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

  const handleClearSqlOutput = useCallback(() => {
    setSqlResult(null);
    setSqlError(null);
  }, []);

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  const handleSelectChallenge = useCallback((challenge) => {
    setActiveChallenge(challenge);
    setVerifyResult(null);
    if (challenge) {
      setSqlCode('-- Q' + challenge.id + ': ' + challenge.title + '\n-- ' + challenge.question + '\n\n');
    }
  }, []);

  const handleSqlModeChange = useCallback((mode) => {
    setSqlMode(mode);
    setActiveChallenge(null);
    setVerifyResult(null);
    setSqlResult(null);
    setSqlError(null);
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-surface text-content-muted text-base">
        Loading...
      </div>
    );
  }

  if (!user && showLanding) {
    return (
      <LandingPage
        onGetStarted={() => setShowLanding(false)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
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
    <div className="flex flex-col h-dvh overflow-hidden">
      <Toolbar
        roomId={roomId}
        users={users}
        isConnected={isConnected}
        onLeave={handleLeave}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        lastEditor={lastEditor}
        onlineCount={onlineCount}
      />
      <div className="flex flex-1 min-h-0 max-md:flex-col">
        {/* Left Sidebar — Language selector */}
        <LanguageSidebar
          language={language}
          onLanguageChange={handleLanguageChange}
          sqlMode={sqlMode}
          onSqlModeChange={handleSqlModeChange}
        />

        {/* Editor + Output area */}
        {language === 'javascript' ? (
          <>
            <CodeEditor code={code} onCodeChange={handleCodeChange} theme={theme} language="javascript" onRun={handleRun} runLabel="Run Code" />
            <OutputPanel output={output} error={error} onClear={handleClearOutput} />
          </>
        ) : (
          <>
            {sqlMode === 'challenges' && (
              <div className="w-75 min-w-65 max-w-85 border-r border-line overflow-hidden flex flex-col bg-surface max-md:w-full max-md:max-w-full max-md:h-50 max-md:min-w-0 max-md:border-r-0 max-md:border-b max-md:border-line">
                <SqlChallenges
                  challenges={challenges}
                  loading={challengesLoading}
                  onSelectChallenge={handleSelectChallenge}
                  activeChallenge={activeChallenge}
                  verifyResult={verifyResult}
                  onClearResult={() => setVerifyResult(null)}
                />
              </div>
            )}
            <CodeEditor code={sqlCode} onCodeChange={handleSqlCodeChange} theme={theme} language="sql"
              onRun={handleRun}
              runLabel={sqlMode === 'challenges' && activeChallenge ? 'Submit Answer' : 'Run Query'} />
            <SqlOutput result={sqlResult} error={sqlError} loading={sqlLoading} onClear={handleClearSqlOutput} />
          </>
        )}
      </div>
    </div>
  );
}
