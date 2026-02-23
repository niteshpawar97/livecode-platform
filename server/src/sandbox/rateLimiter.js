import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX_EXECUTIONS } from '../config/index.js';

const executionLog = new Map();

export function canExecute(socketId) {
  const now = Date.now();
  let timestamps = executionLog.get(socketId) || [];

  timestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (timestamps.length >= RATE_LIMIT_MAX_EXECUTIONS) {
    executionLog.set(socketId, timestamps);
    return false;
  }

  timestamps.push(now);
  executionLog.set(socketId, timestamps);
  return true;
}

export function cleanup(socketId) {
  executionLog.delete(socketId);
}
