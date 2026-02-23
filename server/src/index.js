import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, CORS_ORIGIN } from './config/index.js';
import { initDatabase } from './db/index.js';
import { registerSocketHandlers } from './socket/handler.js';
import { authRouter } from './api/routes/auth.js';
import { socketAuthMiddleware } from './api/middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Trust first proxy (Nginx) so rate limiter gets real client IP from X-Forwarded-For
if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "blob:"],
      workerSrc: ["'self'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'", "data:"],
      imgSrc: ["'self'", "data:", "blob:"],
    }
  } : false
}));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);

// Production: serve built client files
if (isProduction) {
  const clientPath = path.join(__dirname, '..', 'public');
  app.use(express.static(clientPath));

  // SPA fallback: any non-API route serves index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Verify JWT before allowing socket connection
io.use(socketAuthMiddleware);

registerSocketHandlers(io);

initDatabase()
  .then(() => {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} [${isProduction ? 'production' : 'development'}]`);
      console.log(`CORS origin: ${CORS_ORIGIN}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
