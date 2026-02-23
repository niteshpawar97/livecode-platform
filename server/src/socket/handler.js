import { createOrJoinRoom, leaveRoom, updateCode, getRoom, getUsersInRoom } from './roomManager.js';
import { executeCode } from '../sandbox/executor.js';
import { canExecute, cleanup } from '../sandbox/rateLimiter.js';
import { MAX_CODE_LENGTH } from '../config/index.js';

function broadcastOnlineCount(io) {
  io.emit('online-count', { count: io.engine.clientsCount });
}

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    // socket.data.user is set by socketAuthMiddleware (from JWT)
    const authenticatedUser = socket.data.user;
    console.log(`User connected: ${socket.id} (${authenticatedUser.username})`);

    broadcastOnlineCount(io);

    const userRooms = new Set();

    socket.on('join-room', ({ roomId }) => {
      if (!roomId || typeof roomId !== 'string' || roomId.trim().length === 0) {
        socket.emit('error-message', { message: 'Invalid room ID' });
        return;
      }

      const cleanRoomId = roomId.trim().slice(0, 50);
      const username = authenticatedUser.username;

      // Find and kick old socket of same user in this room (duplicate tab)
      const existingUsers = getUsersInRoom(cleanRoomId);
      const oldEntry = existingUsers.find(u => u.username === username);
      if (oldEntry && oldEntry.id !== socket.id) {
        const oldSocket = io.sockets.sockets.get(oldEntry.id);
        if (oldSocket) {
          oldSocket.leave(cleanRoomId);
          oldSocket.emit('error-message', { message: 'You joined this room from another tab' });
        }
      }

      try {
        const { code, users } = createOrJoinRoom(cleanRoomId, socket.id, username);
        socket.join(cleanRoomId);
        userRooms.add(cleanRoomId);

        socket.emit('room-joined', { code, users, roomId: cleanRoomId });
        socket.to(cleanRoomId).emit('user-joined', { username, users });

        console.log(`${username} joined room: ${cleanRoomId}`);
      } catch (err) {
        socket.emit('error-message', { message: err.message });
      }
    });

    socket.on('code-change', ({ roomId, code }) => {
      if (!roomId || !userRooms.has(roomId)) return;
      if (typeof code !== 'string' || code.length > MAX_CODE_LENGTH) return;

      updateCode(roomId, code);
      socket.to(roomId).emit('code-update', { code, username: authenticatedUser.username });
    });

    socket.on('run-code', async ({ roomId }) => {
      if (!roomId || !userRooms.has(roomId)) return;

      if (!canExecute(socket.id)) {
        socket.emit('execution-result', {
          output: [],
          error: 'Rate limit exceeded. Please wait a few seconds before running again.'
        });
        return;
      }

      const room = getRoom(roomId);
      if (!room) return;

      const { output, error } = await executeCode(room.code);
      socket.emit('execution-result', { output, error });
    });

    socket.on('leave-room', ({ roomId }) => {
      if (!roomId || !userRooms.has(roomId)) return;

      socket.leave(roomId);
      userRooms.delete(roomId);

      const result = leaveRoom(roomId, socket.id);
      if (result) {
        socket.to(roomId).emit('user-left', {
          username: result.username,
          users: result.users
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id} (${authenticatedUser.username})`);

      for (const roomId of userRooms) {
        const result = leaveRoom(roomId, socket.id);
        if (result) {
          socket.to(roomId).emit('user-left', {
            username: result.username,
            users: result.users
          });
        }
      }

      userRooms.clear();
      cleanup(socket.id);
      broadcastOnlineCount(io);
    });
  });
}
