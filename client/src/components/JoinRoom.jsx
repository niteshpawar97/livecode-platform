import { useState } from 'react';
import './JoinRoom.css';

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

export default function JoinRoom({ onJoin, onLogout, user, initialRoomId }) {
  const [roomId, setRoomId] = useState(initialRoomId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoin(roomId.trim());
    }
  };

  return (
    <div className="join-room">
      <div className="join-room-card">
        <div className="join-room-header">
          <h1>Collab Code Editor</h1>
          <div className="user-info">
            <span>Logged in as <strong>{user.username}</strong></span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
        <p>Real-time collaborative JavaScript editor</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="roomId">Room ID</label>
            <div className="room-input-row">
              <input
                id="roomId"
                type="text"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                maxLength={50}
                required
              />
              <button
                type="button"
                className="generate-btn"
                onClick={() => setRoomId(generateRoomId())}
              >
                Random
              </button>
            </div>
          </div>

          <button type="submit" className="join-btn">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
