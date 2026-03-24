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
    <div className="flex items-center justify-center h-dvh bg-surface p-4">
      <div className="bg-surface-alt border border-line rounded-xl p-10 w-full max-w-105 text-center max-sm:p-6 max-sm:rounded-lg">
        <h1 className="text-accent text-2xl font-bold mb-3 max-sm:text-xl">LiveCode Platform</h1>
        <div className="flex items-center justify-center gap-3 mb-2 text-[13px] text-content-muted">
          <span>Logged in as <strong className="text-ok">{user.username}</strong></span>
          <button onClick={onLogout}
            className="py-1 px-3 bg-transparent border border-danger rounded text-danger text-xs cursor-pointer hover:bg-danger/10">
            Logout
          </button>
        </div>
        <p className="text-content-muted text-sm mb-8">Real-time collaborative JavaScript editor</p>

        <form onSubmit={handleSubmit}>
          <div className="text-left mb-5">
            <label htmlFor="roomId" className="block text-content-muted text-[13px] mb-1.5">Room ID</label>
            <div className="flex gap-2">
              <input id="roomId" type="text" placeholder="Enter room ID" value={roomId}
                onChange={(e) => setRoomId(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                maxLength={50} required
                className="flex-1 py-2.5 px-3 bg-surface border border-line rounded-md text-content text-sm outline-none focus:border-accent" />
              <button type="button" onClick={() => setRoomId(generateRoomId())}
                className="py-2.5 px-4 bg-surface-bar border border-line rounded-md text-content text-[13px] cursor-pointer whitespace-nowrap hover:bg-line">
                Random
              </button>
            </div>
          </div>
          <button type="submit"
            className="w-full py-3 bg-accent border-none rounded-md text-white text-[15px] font-semibold cursor-pointer mt-2 hover:opacity-90">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
