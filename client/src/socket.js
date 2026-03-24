import { io } from 'socket.io-client';
import { getAccessToken } from './api/auth.js';

// In production: same origin (empty string), in dev: through Vite proxy
const socketOptions = {
  autoConnect: false,
  transports: ['polling', 'websocket'],
  withCredentials: true,
  auth: (cb) => {
    cb({ token: getAccessToken() });
  }
};

// Dev: connect directly to backend (avoids Vite WS proxy issues)
// Production: same origin
const serverUrl = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

export const socket = serverUrl ? io(serverUrl, socketOptions) : io(socketOptions);
