import { useState } from 'react';

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
    <div className="flex items-center justify-center h-dvh bg-surface p-4">
      <div className="bg-surface-alt border border-line rounded-xl p-10 w-full max-w-105 text-center max-sm:p-6 max-sm:rounded-lg">
        <h1 className="text-accent text-2xl font-bold mb-2 max-sm:text-xl">LiveCode Platform</h1>
        <p className="text-content-muted text-sm mb-6">Real-time collaborative JavaScript editor</p>

        <div className="flex mb-6 border-b border-line">
          {['login', 'register', 'guest'].map(m => (
            <button key={m} onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 bg-transparent border-b-2 text-sm cursor-pointer transition-all max-sm:text-[13px] max-sm:py-2
                ${mode === m ? 'text-accent border-accent' : 'text-content-muted border-transparent'}`}>
              {m === 'login' ? 'Login' : m === 'register' ? 'Register' : 'Guest'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {(mode === 'register' || mode === 'guest') && (
            <div className="text-left mb-5">
              <label htmlFor="auth-username" className="block text-content-muted text-[13px] mb-1.5">Username</label>
              <input id="auth-username" type="text" placeholder="Enter your name" value={username}
                onChange={(e) => setUsername(e.target.value)} maxLength={30} required
                className="w-full py-2.5 px-3 bg-surface border border-line rounded-md text-content text-sm outline-none focus:border-accent" />
            </div>
          )}

          {mode !== 'guest' && (
            <>
              <div className="text-left mb-5">
                <label htmlFor="auth-email" className="block text-content-muted text-[13px] mb-1.5">Email</label>
                <input id="auth-email" type="email" placeholder="Enter your email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="w-full py-2.5 px-3 bg-surface border border-line rounded-md text-content text-sm outline-none focus:border-accent" />
              </div>
              <div className="text-left mb-5">
                <label htmlFor="auth-password" className="block text-content-muted text-[13px] mb-1.5">Password</label>
                <input id="auth-password" type="password"
                  placeholder={mode === 'login' ? 'Enter your password' : 'Min 8 chars, uppercase, lowercase, number'}
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full py-2.5 px-3 bg-surface border border-line rounded-md text-content text-sm outline-none focus:border-accent" />
              </div>
            </>
          )}

          {mode === 'guest' && (
            <p className="text-content-muted text-[13px] mb-4 italic">No account needed. Session expires in 24 hours.</p>
          )}

          {error && (
            <div className="bg-danger/10 border border-danger text-danger py-2.5 px-3 rounded-md text-[13px] mb-4 text-left">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-accent border-none rounded-md text-white text-[15px] font-semibold cursor-pointer mt-2 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Join as Guest'}
          </button>
        </form>
      </div>
    </div>
  );
}
