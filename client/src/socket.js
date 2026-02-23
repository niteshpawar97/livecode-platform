import { io } from 'socket.io-client';
import { getAccessToken } from './api/auth.js';

// In production: same origin (empty string), in dev: through Vite proxy
const socketOptions = {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  withCredentials: true,
  auth: (cb) => {
    cb({ token: getAccessToken() });
  }
};

// If VITE_SERVER_URL is set, use it; otherwise connect to same origin
const serverUrl = import.meta.env.VITE_SERVER_URL || '';

export const socket = serverUrl ? io(serverUrl, socketOptions) : io(socketOptions);
