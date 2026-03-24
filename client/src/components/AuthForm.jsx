import { useState } from 'react';

const TAB_ICONS = {
  login: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  register: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  guest: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onAuth({ mode, email, password, username });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="relative flex items-center justify-center h-dvh bg-surface p-4 overflow-hidden hero-grid">
      {/* Floating orbs */}
      <div className="absolute top-[15%] left-[10%] w-60 h-60 bg-accent/15 rounded-full blur-[100px] animate-[glow-pulse_4s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-48 h-48 bg-ok/10 rounded-full blur-[80px] animate-[glow-pulse_5s_ease-in-out_infinite_1s] pointer-events-none" />

      <div className="relative w-full max-w-[440px] animate-[fade-up_0.5s_ease-out]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-lg">&#9889;</div>
          <span className="text-2xl font-extrabold text-content">Live<span className="text-accent">Code</span></span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 glow-accent max-sm:p-6">
          <h2 className="text-xl font-bold text-content text-center mb-1">Welcome Back</h2>
          <p className="text-sm text-content-muted text-center mb-6">Sign in to start collaborating</p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-surface rounded-xl mb-6">
            {['login', 'register', 'guest'].map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-all border-none
                  ${mode === m ? 'bg-accent text-white shadow-[0_2px_10px_rgba(0,122,204,0.3)]' : 'bg-transparent text-content-muted hover:text-content'}`}>
                {TAB_ICONS[m]}
                {m === 'login' ? 'Login' : m === 'register' ? 'Register' : 'Guest'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {(mode === 'register' || mode === 'guest') && (
              <div className="text-left mb-4">
                <label htmlFor="auth-username" className="block text-content-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <input id="auth-username" type="text" placeholder="Enter your name" value={username}
                    onChange={(e) => setUsername(e.target.value)} maxLength={30} required
                    className="w-full py-3 pl-10 pr-3 bg-surface border border-line rounded-xl text-content text-sm outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,122,204,0.1)]" />
                </div>
              </div>
            )}

            {mode !== 'guest' && (
              <>
                <div className="text-left mb-4">
                  <label htmlFor="auth-email" className="block text-content-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" /></svg>
                    </span>
                    <input id="auth-email" type="email" placeholder="you@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)} required
                      className="w-full py-3 pl-10 pr-3 bg-surface border border-line rounded-xl text-content text-sm outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,122,204,0.1)]" />
                  </div>
                </div>
                <div className="text-left mb-4">
                  <label htmlFor="auth-password" className="block text-content-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    </span>
                    <input id="auth-password" type="password"
                      placeholder={mode === 'login' ? 'Enter password' : 'Min 8 chars, upper, lower, number'}
                      value={password} onChange={(e) => setPassword(e.target.value)} required
                      className="w-full py-3 pl-10 pr-3 bg-surface border border-line rounded-xl text-content text-sm outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,122,204,0.1)]" />
                  </div>
                </div>
              </>
            )}

            {mode === 'guest' && (
              <div className="flex items-start gap-2 py-3 px-4 glass rounded-xl mb-4 text-[13px] text-content-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5 text-accent"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                No account needed. Session expires in 24 hours.
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 py-3 px-4 bg-danger/10 border border-danger/30 rounded-xl text-[13px] text-danger mb-4 text-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="group w-full py-3.5 bg-accent border-none rounded-xl text-white text-[15px] font-bold cursor-pointer mt-2 transition-all hover:shadow-[0_0_25px_rgba(0,122,204,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                  Please wait...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Join as Guest'}
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-content-muted mt-6">
          Open source &middot; Free forever &middot; No credit card required
        </p>
      </div>
    </div>
  );
}
