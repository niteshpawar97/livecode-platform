import dotenv from 'dotenv';
dotenv.config();

// Server
export const PORT = process.env.PORT || 3001;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Sandbox limits
export const MAX_CODE_LENGTH = 10000;
export const EXECUTION_TIMEOUT = 1000;
export const MAX_OUTPUT_LINES = 100;
export const MAX_ROOM_USERS = 10;

// Socket rate limiting
export const RATE_LIMIT_WINDOW = 10000;
export const RATE_LIMIT_MAX_EXECUTIONS = 5;

// Database
export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  database: process.env.DB_NAME || 'collab_editor',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql'
};

// JWT
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
export const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

// Auth rate limiting
export const AUTH_RATE_LIMIT_WINDOW_MS = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 900000;
export const AUTH_RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 10) || 5;

// Bcrypt
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
