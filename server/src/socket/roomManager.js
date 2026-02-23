import { MAX_ROOM_USERS } from '../config/index.js';

const rooms = new Map();

export function createOrJoinRoom(roomId, socketId, username) {
  let room = rooms.get(roomId);

  if (!room) {
    room = {
      code: '// Write your JavaScript here\nconsole.log("Hello, World!");\n',
      users: new Map()
    };
    rooms.set(roomId, room);
  }

  if (room.users.size >= MAX_ROOM_USERS) {
    throw new Error(`Room is full (max ${MAX_ROOM_USERS} users)`);
  }

  room.users.set(socketId, { id: socketId, username });

  return {
    code: room.code,
    users: getUsersInRoom(roomId)
  };
}

export function leaveRoom(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return null;

  const user = room.users.get(socketId);
  room.users.delete(socketId);

  if (room.users.size === 0) {
    rooms.delete(roomId);
  }

  return {
    username: user?.username || 'Unknown',
    users: getUsersInRoom(roomId)
  };
}

export function updateCode(roomId, code) {
  const room = rooms.get(roomId);
  if (room) {
    room.code = code;
  }
}

export function getRoom(roomId) {
  return rooms.get(roomId) || null;
}

export function getUsersInRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.users.values());
}

export function isUsernameActive(username) {
  const lower = username.toLowerCase();
  for (const room of rooms.values()) {
    for (const user of room.users.values()) {
      if (user.username.toLowerCase() === lower) return true;
    }
  }
  return false;
}
