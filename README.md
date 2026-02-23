# LiveCode Platform

A real-time collaborative JavaScript code editor where multiple users can join rooms, write code together, and execute it in a secure sandbox. Built with Node.js, React, Socket.io, and Monaco Editor.

## Features

- **Real-time collaboration** - Multiple users edit code simultaneously with live sync
- **Room system** - Create or join rooms by ID, shareable room links
- **Secure code execution** - JavaScript runs in a sandboxed worker thread with timeout protection
- **Event loop support** - setTimeout, setInterval, setImmediate, queueMicrotask all work in sandbox
- **Authentication** - Register/login with JWT (access + refresh tokens) or continue as guest
- **Dark/Light theme** - Toggle between themes, persisted in localStorage
- **Responsive UI** - Works on mobile, tablet, and desktop
- **User presence** - See who's in the room with colored badges
- **Code attribution** - See who last edited the code
- **Security hardened** - Helmet, rate limiting, bcrypt, httpOnly cookies, non-root Docker

## Tech Stack

**Server:**
- Node.js 22 + Express
- Socket.io (WebSocket)
- Sequelize ORM + MySQL
- JWT (jsonwebtoken) + bcryptjs
- vm2 + worker_threads (sandbox)
- Helmet, express-rate-limit, cookie-parser

**Client:**
- React 19 + Vite
- Monaco Editor (@monaco-editor/react)
- Socket.io Client
- CSS custom properties (theming)

**Deployment:**
- Docker (multi-stage build)
- Nginx (reverse proxy + WebSocket)

## Project Structure

```
realtime-collab-project/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── auth.js              # Auth API (login, register, refresh, guest)
│   │   ├── components/
│   │   │   ├── AuthForm.jsx/css      # Login/Register form
│   │   │   ├── CodeEditor.jsx/css    # Monaco Editor wrapper
│   │   │   ├── JoinRoom.jsx/css      # Room join screen
│   │   │   ├── OutputPanel.jsx/css   # Code execution output
│   │   │   ├── ThemeToggle.jsx/css   # Dark/Light theme toggle
│   │   │   └── Toolbar.jsx/css       # Top toolbar with user badges
│   │   ├── hooks/
│   │   │   └── useSocket.js          # Socket.io event handlers
│   │   ├── App.jsx/css               # Main app with auth + room flow
│   │   ├── main.jsx                  # Entry point
│   │   └── socket.js                 # Socket.io client connection
│   ├── index.html
│   ├── vite.config.js                # Vite config with API proxy
│   └── package.json
├── server/
│   ├── src/
│   │   ├── api/                      # REST API layer
│   │   │   ├── middleware/
│   │   │   │   └── auth.js           # JWT auth middleware (Express + Socket.io)
│   │   │   ├── routes/
│   │   │   │   └── auth.js           # Auth endpoints (register, login, refresh, logout, guest)
│   │   │   └── validators.js         # Input validation (email, password, username)
│   │   ├── config/
│   │   │   └── index.js              # All configuration constants
│   │   ├── db/                       # Database layer
│   │   │   ├── models/
│   │   │   │   ├── User.js           # User model (email, password, username)
│   │   │   │   ├── RefreshToken.js   # Refresh token model
│   │   │   │   └── index.js          # Model barrel export
│   │   │   └── index.js              # Sequelize connection + sync
│   │   ├── sandbox/                  # Code execution engine
│   │   │   ├── executor.js           # Spawns worker threads for execution
│   │   │   ├── worker.js             # Worker thread with VM2 + event loop
│   │   │   └── rateLimiter.js        # Execution rate limiter
│   │   ├── socket/                   # WebSocket layer
│   │   │   ├── handler.js            # Socket.io event handlers
│   │   │   └── roomManager.js        # Room state management
│   │   └── index.js                  # Express + Socket.io server entry
│   ├── .env                          # Environment variables (not committed)
│   └── package.json
├── nginx/
│   └── nginx.conf                    # Nginx reverse proxy config
├── .dockerignore
├── .env.example                      # Production env template
├── docker-compose.yml                # Docker Compose (app + nginx)
├── Dockerfile                        # Multi-stage Docker build
└── .gitignore
```

## Prerequisites

- **Node.js** 22+ (for local development)
- **MySQL** 8.x server (local or remote)
- **Docker** + **Docker Compose** (for containerized deployment)

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd realtime-collab-project
```

### 2. Setup MySQL database

Make sure MySQL is running, then create the database:

```sql
CREATE DATABASE collab_editor;
CREATE USER 'collab_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON collab_editor.* TO 'collab_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure server environment

```bash
cp .env.example server/.env
```

Edit `server/.env` with your local values:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=collab_editor
DB_USER=collab_user
DB_PASSWORD=your_password

# JWT Secrets (generate your own)
JWT_ACCESS_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_REFRESH_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Security
BCRYPT_SALT_ROUNDS=10
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=10
```

### 4. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 5. Start development servers

Open two terminals:

```bash
# Terminal 1 - Start server (auto-restarts on changes)
cd server
npm run dev
```

```bash
# Terminal 2 - Start client (hot reload)
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

The Vite dev server proxies `/api` and `/socket.io` requests to the backend at port 3001, so cookies and WebSocket work seamlessly.

---

## Docker Deployment

### Architecture

```
Internet -> Nginx (:80) -> Node.js App (:3001) -> MySQL (external)
```

- **Nginx** handles HTTP traffic, reverse proxies to the app, supports WebSocket upgrade
- **Node.js App** serves the built React client + API + Socket.io
- **MySQL** runs on a separate server (not in Docker)

### Local Docker Testing

#### 1. Create production `.env` in project root

```bash
cp .env.example .env
```

Edit `.env`:

```env
CORS_ORIGIN=http://localhost

DB_HOST=host.docker.internal    # Points to host machine's MySQL
DB_PORT=3306
DB_NAME=collab_editor
DB_USER=collab_user
DB_PASSWORD=your_password

JWT_ACCESS_SECRET=your_random_64_char_hex
JWT_REFRESH_SECRET=another_random_64_char_hex
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

BCRYPT_SALT_ROUNDS=10
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=10
```

> **Note:** `host.docker.internal` allows the Docker container to reach MySQL running on your host machine. On Linux, you may need to add `extra_hosts: ["host.docker.internal:host-gateway"]` to the app service in docker-compose.yml.

#### 2. Build and run

```bash
docker compose up --build
```

The app will be available at **http://localhost** (port 80 via Nginx).

#### 3. Stop

```bash
docker compose down
```

### VPS / Cloud Deployment

#### 1. Server setup

SSH into your VPS and install Docker:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
```

#### 2. Upload project

```bash
# From your local machine
scp -r realtime-collab-project user@your-vps-ip:~/
```

Or clone from git:

```bash
ssh user@your-vps-ip
git clone <your-repo-url>
cd realtime-collab-project
```

#### 3. Configure environment

```bash
cp .env.example .env
nano .env
```

Set production values:

```env
CORS_ORIGIN=https://yourdomain.com

DB_HOST=your-mysql-server-ip
DB_PORT=3306
DB_NAME=collab_editor
DB_USER=collab_user
DB_PASSWORD=your_secure_password

JWT_ACCESS_SECRET=<generate a random 64-char hex>
JWT_REFRESH_SECRET=<generate another random 64-char hex>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

BCRYPT_SALT_ROUNDS=12
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=10
```

#### 4. MySQL setup

On your MySQL server, create the database and user:

```sql
CREATE DATABASE collab_editor;
CREATE USER 'collab_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON collab_editor.* TO 'collab_user'@'%';
FLUSH PRIVILEGES;
```

Make sure MySQL allows connections from your VPS IP.

#### 5. Deploy

```bash
docker compose up -d --build
```

The app will be live on port 80.

#### 6. Useful commands

```bash
# View logs
docker compose logs -f

# Restart
docker compose restart

# Rebuild after code changes
docker compose up -d --build

# Stop
docker compose down
```

### Adding HTTPS (SSL)

For production with a domain, add SSL via Certbot. Update `docker-compose.yml` to mount certs and update `nginx.conf` with SSL configuration, or use a reverse proxy like Cloudflare or Caddy in front.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `collab_editor` | Database name |
| `DB_USER` | `root` | Database user |
| `DB_PASSWORD` | - | Database password |
| `JWT_ACCESS_SECRET` | - | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | - | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRY` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token lifetime |
| `BCRYPT_SALT_ROUNDS` | `10` | Password hashing rounds |
| `AUTH_RATE_LIMIT_WINDOW_MS` | `900000` | Auth rate limit window (15 min) |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | `5` | Max auth requests per window |

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register with email, password, username |
| `POST` | `/api/auth/login` | No | Login with email and password |
| `POST` | `/api/auth/refresh` | Cookie | Refresh access token |
| `POST` | `/api/auth/logout` | Cookie | Logout (clears refresh token) |
| `POST` | `/api/auth/guest` | No | Get guest session with username |
| `GET` | `/api/auth/me` | Bearer | Get current user info |
| `GET` | `/health` | No | Health check |

## Sandbox Limits

| Limit | Value |
|---|---|
| Max code length | 10,000 characters |
| Execution timeout | 1 second |
| Max output lines | 100 |
| Max users per room | 10 |
| Code execution rate limit | 5 per 10 seconds |
