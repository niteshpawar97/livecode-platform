import { useState } from 'react';
import './AuthForm.css';

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
      await onAuth({
        mode,
        email,
        password,
        username
      });
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
    <div className="auth-form">
      <div className="auth-form-card">
        <h1>Collab Code Editor</h1>
        <p>Real-time collaborative JavaScript editor</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
          <button
            className={`auth-tab ${mode === 'guest' ? 'active' : ''}`}
            onClick={() => switchMode('guest')}
          >
            Guest
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {(mode === 'register' || mode === 'guest') && (
            <div className="input-group">
              <label htmlFor="auth-username">Username</label>
              <input
                id="auth-username"
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                required
              />
            </div>
          )}

          {mode !== 'guest' && (
            <>
              <div className="input-group">
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  placeholder={mode === 'login' ? 'Enter your password' : 'Min 8 chars, uppercase, lowercase, number'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {mode === 'guest' && (
            <p className="guest-note">No account needed. Session expires in 24 hours.</p>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (
              mode === 'login' ? 'Login' :
              mode === 'register' ? 'Register' :
              'Join as Guest'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
