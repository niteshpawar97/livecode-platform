import { useState } from 'react';

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function JoinRoom({ onJoin, onLogout, user, initialRoomId }) {
  const [roomId, setRoomId] = useState(initialRoomId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim()) onJoin(roomId.trim());
  };

  return (
    <div className="relative flex items-center justify-center h-dvh bg-surface p-4 overflow-hidden hero-grid">
      {/* Floating orbs */}
      <div className="absolute top-[20%] right-[15%] w-56 h-56 bg-accent/15 rounded-full blur-[100px] animate-[glow-pulse_4s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[15%] w-44 h-44 bg-ok/10 rounded-full blur-[80px] animate-[glow-pulse_5s_ease-in-out_infinite_1s] pointer-events-none" />

      <div className="relative w-full max-w-[440px] animate-[fade-up_0.5s_ease-out]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-lg">&#9889;</div>
          <span className="text-2xl font-extrabold text-content">Live<span className="text-accent">Code</span></span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 glow-accent max-sm:p-6">
          {/* User info bar */}
          <div className="flex items-center justify-between p-3 bg-surface rounded-xl mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-ok/15 flex items-center justify-center text-ok font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-content">{user.username}</div>
                <div className="text-[11px] text-content-muted">{user.isGuest ? 'Guest (24h)' : 'Registered'}</div>
              </div>
            </div>
            <button onClick={onLogout}
              className="py-1.5 px-3 bg-transparent border border-line rounded-lg text-content-muted text-xs font-semibold cursor-pointer transition-all hover:border-danger hover:text-danger hover:bg-danger/5">
              Logout
            </button>
          </div>

          <h2 className="text-xl font-bold text-content text-center mb-1">Join a Room</h2>
          <p className="text-sm text-content-muted text-center mb-6">Enter a room ID or generate a random one</p>

          <form onSubmit={handleSubmit}>
            <div className="text-left mb-5">
              <label htmlFor="roomId" className="block text-content-muted text-xs font-semibold mb-1.5 uppercase tracking-wider">Room ID</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                  </span>
                  <input id="roomId" type="text" placeholder="e.g. my-room" value={roomId}
                    onChange={(e) => setRoomId(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                    maxLength={50} required
                    className="w-full py-3 pl-10 pr-3 bg-surface border border-line rounded-xl text-content text-sm outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,122,204,0.1)]" />
                </div>
                <button type="button" onClick={() => setRoomId(generateRoomId())}
                  className="py-3 px-4 glass rounded-xl text-content text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-all hover:scale-105 hover:text-accent border-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1"><path d="M21.5 2v6h-6" /><path d="M2.5 22v-6h6" /><path d="M22 11.5A10 10 0 003.2 7.2" /><path d="M2 12.5a10 10 0 0018.8 4.3" /></svg>
                  Random
                </button>
              </div>
            </div>

            <button type="submit"
              className="group w-full py-3.5 bg-accent border-none rounded-xl text-white text-[15px] font-bold cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(0,122,204,0.4)] hover:scale-[1.02] active:scale-[0.98]">
              <span className="inline-flex items-center gap-2">
                Join Room
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </button>
          </form>

          {/* Quick info */}
          <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-content-muted">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
              Max 10 users
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Instant execute
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
              Share link
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
