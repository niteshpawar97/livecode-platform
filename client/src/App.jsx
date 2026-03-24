import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
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

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
}

/* ─── Playground (Room) Page ─── */
function PlaygroundPage({ theme, onThemeToggle }) {
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  const { isConnected } = useSocket();

  const [roomId, setRoomId] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [lastEditor, setLastEditor] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlCode, setSqlCode] = useState('-- Try any query!\nSELECT\n  d.name AS department,\n  e.name AS employee,\n  e.salary\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id\nORDER BY e.salary DESC');
  const [sqlMode, setSqlMode] = useState('playground');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(false);

  // Prefetch challenges
  useEffect(() => {
    setChallengesLoading(true);
    fetch('/api/execute-sql/challenges')
      .then(r => r.json())
      .then(data => setChallenges(data.challenges || []))
      .catch(() => {})
      .finally(() => setChallengesLoading(false));
  }, []);

  // Join room on mount
  useEffect(() => {
    if (!urlRoomId) return;
    socket.connect();
    socket.emit('join-room', { roomId: urlRoomId });

    return () => {
      socket.emit('leave-room', { roomId: urlRoomId });
      socket.disconnect();
    };
  }, [urlRoomId]);

  // Socket listeners
  useEffect(() => {
    function onRoomJoined(data) {
      setCode(data.code);
      if (data.sqlCode) setSqlCode(data.sqlCode);
      setUsers(data.users);
      setRoomId(data.roomId);
      setLastEditor(null);
    }
    function onCodeUpdate(data) {
      if (data.language === 'sql') setSqlCode(data.code);
      else setCode(data.code);
      if (data.username) setLastEditor(data.username);
    }
    function onUserJoined(data) { setUsers(data.users); }
    function onUserLeft(data) { setUsers(data.users); }
    function onExecutionResult(data) { setOutput(data.output || []); setError(data.error || null); }
    function onErrorMessage(data) { setError(data.message); }
    function onOnlineCount(data) { setOnlineCount(data.count); }
    function onConnectError(err) {
      if (err.message === 'Authentication required' || err.message === 'Invalid or expired token') {
        refreshAccessToken().then(() => socket.connect()).catch(() => navigate('/login'));
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
  }, [navigate]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    setLastEditor(null);
    if (urlRoomId) socket.emit('code-change', { roomId: urlRoomId, code: newCode, language: 'javascript' });
  }, [urlRoomId]);

  const handleSqlCodeChange = useCallback((newCode) => {
    setSqlCode(newCode);
    setLastEditor(null);
    if (urlRoomId) socket.emit('code-change', { roomId: urlRoomId, code: newCode, language: 'sql' });
  }, [urlRoomId]);

  const handleRunSql = useCallback(async () => {
    setSqlResult(null); setSqlError(null); setSqlLoading(true);
    try {
      const res = await fetch('/api/execute-sql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: sqlCode }) });
      const data = await res.json();
      if (!res.ok) setSqlError(data.error || 'Query failed.');
      else setSqlResult(data);
    } catch { setSqlError('Network error.'); }
    finally { setSqlLoading(false); }
  }, [sqlCode]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!activeChallenge) return;
    setSqlLoading(true); setVerifyResult(null); setSqlResult(null); setSqlError(null);
    try {
      const res = await fetch('/api/execute-sql/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ challengeId: activeChallenge.id, query: sqlCode }) });
      const data = await res.json();
      setVerifyResult(data);
      if (data.userResult) setSqlResult(data.userResult);
      if (data.userError) setSqlError(data.userError);
    } catch { setSqlError('Network error.'); }
    finally { setSqlLoading(false); }
  }, [activeChallenge, sqlCode]);

  const handleRun = useCallback(() => {
    if (language === 'sql') {
      if (sqlMode === 'challenges' && activeChallenge) handleSubmitAnswer();
      else handleRunSql();
      return;
    }
    if (urlRoomId) { setOutput([]); setError(null); socket.emit('run-code', { roomId: urlRoomId }); }
  }, [urlRoomId, language, handleRunSql, sqlMode, activeChallenge, handleSubmitAnswer]);

  const handleLeave = useCallback(() => {
    if (urlRoomId) socket.emit('leave-room', { roomId: urlRoomId });
    socket.disconnect();
    navigate('/join');
  }, [urlRoomId, navigate]);

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-surface">
      {/* Premium Toolbar */}
      <Toolbar
        roomId={roomId || urlRoomId}
        users={users}
        isConnected={isConnected}
        onLeave={handleLeave}
        theme={theme}
        onThemeToggle={onThemeToggle}
        lastEditor={lastEditor}
        onlineCount={onlineCount}
      />
      <div className="flex flex-1 min-h-0 max-md:flex-col">
        <LanguageSidebar
          language={language}
          onLanguageChange={setLanguage}
          sqlMode={sqlMode}
          onSqlModeChange={(mode) => { setSqlMode(mode); setActiveChallenge(null); setVerifyResult(null); setSqlResult(null); setSqlError(null); }}
        />
        {language === 'javascript' ? (
          <>
            <CodeEditor code={code} onCodeChange={handleCodeChange} theme={theme} language="javascript" onRun={handleRun} runLabel="Run Code" />
            <OutputPanel output={output} error={error} onClear={() => { setOutput([]); setError(null); }} />
          </>
        ) : (
          <>
            {sqlMode === 'challenges' && (
              <div className="w-75 min-w-65 max-w-85 border-r border-line overflow-hidden flex flex-col bg-surface max-md:w-full max-md:max-w-full max-md:h-50 max-md:min-w-0 max-md:border-r-0 max-md:border-b max-md:border-line">
                <SqlChallenges
                  challenges={challenges} loading={challengesLoading}
                  onSelectChallenge={(c) => { setActiveChallenge(c); setVerifyResult(null); if (c) setSqlCode('-- Q' + c.id + ': ' + c.title + '\n-- ' + c.question + '\n\n'); }}
                  activeChallenge={activeChallenge} verifyResult={verifyResult}
                  onClearResult={() => setVerifyResult(null)}
                />
              </div>
            )}
            <CodeEditor code={sqlCode} onCodeChange={handleSqlCodeChange} theme={theme} language="sql"
              onRun={handleRun} runLabel={sqlMode === 'challenges' && activeChallenge ? 'Submit Answer' : 'Run Query'} />
            <SqlOutput result={sqlResult} error={sqlError} loading={sqlLoading} onClear={() => { setSqlResult(null); setSqlError(null); }} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main App with Routes ─── */
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Restore session
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

  const handleAuth = useCallback(async ({ mode, email, password, username }) => {
    let data;
    if (mode === 'login') data = await login(email, password);
    else if (mode === 'register') data = await register(email, password, username);
    else data = await guestLogin(username);
    setUser(data.user);
    navigate('/join');
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    setUser(null);
    navigate('/');
  }, [navigate]);

  const handleJoin = useCallback((newRoomId) => {
    navigate('/room/' + newRoomId);
  }, [navigate]);

  if (authLoading) {
    return (
      <div className="relative flex items-center justify-center h-dvh bg-surface overflow-hidden hero-grid">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative flex flex-col items-center gap-4 animate-[fade-up_0.4s_ease-out]">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-xl">&#9889;</div>
          <div className="text-lg font-bold text-content">Live<span className="text-accent">Code</span></div>
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={
        user ? <Navigate to="/join" replace /> :
        <LandingPage onGetStarted={() => navigate('/login')} theme={theme} onThemeToggle={handleThemeToggle} />
      } />

      {/* Auth */}
      <Route path="/login" element={
        user ? <Navigate to="/join" replace /> :
        <AuthForm onAuth={handleAuth} />
      } />

      {/* Join Room */}
      <Route path="/join" element={
        !user ? <Navigate to="/login" replace /> :
        <JoinRoom onJoin={handleJoin} onLogout={handleLogout} user={user} />
      } />

      {/* Playground */}
      <Route path="/room/:roomId" element={
        !user ? <Navigate to="/login" replace /> :
        <PlaygroundPage theme={theme} onThemeToggle={handleThemeToggle} />
      } />

      {/* Legacy ?room= redirect */}
      <Route path="*" element={<LegacyRedirect user={user} theme={theme} onThemeToggle={handleThemeToggle} />} />
    </Routes>
  );
}

/* Handle old ?room=xyz URLs */
function LegacyRedirect({ user }) {
  const [searchParams] = useSearchParams();
  const room = searchParams.get('room');
  if (room) return <Navigate to={`/room/${room}`} replace />;
  return <Navigate to={user ? '/join' : '/'} replace />;
}
