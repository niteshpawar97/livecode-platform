/**
 * GitHub Webhook Listener — Auto-deploy on push
 *
 * Runs on VPS, listens for GitHub push events,
 * pulls latest code and rebuilds Docker container.
 *
 * Setup:
 *   1. Copy this file to VPS: /home/deploy/webhook.js
 *   2. Set env: WEBHOOK_SECRET, REPO_DIR
 *   3. Run: node webhook.js
 *   4. Add webhook in GitHub repo → Settings → Webhooks
 *      - URL: http://your-vps-ip:9000/deploy
 *      - Secret: your-secret
 *      - Events: Just the push event
 */

import http from 'node:http';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const PORT = process.env.WEBHOOK_PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'change-this-secret';
const REPO_DIR = process.env.REPO_DIR || '/home/niketgroup-livecode/htdocs/livecode-platform';
const BRANCH = process.env.DEPLOY_BRANCH || 'master';

function verifySignature(payload, signature) {
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

function deploy() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] 🚀 Deploy started...`);

  try {
    // Pull latest code
    console.log('[1/3] git pull...');
    execSync(`cd ${REPO_DIR} && git fetch origin && git reset --hard origin/${BRANCH}`, { stdio: 'inherit' });

    // Rebuild & restart container
    console.log('[2/3] docker rebuild...');
    execSync(`cd ${REPO_DIR} && docker-compose up -d --build`, { stdio: 'inherit', timeout: 300000 });

    // Cleanup old images
    console.log('[3/3] cleanup...');
    execSync('docker image prune -f', { stdio: 'inherit' });

    console.log(`[${timestamp}] ✅ Deploy successful!\n`);
    return true;
  } catch (err) {
    console.error(`[${timestamp}] ❌ Deploy failed:`, err.message);
    return false;
  }
}

const server = http.createServer((req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', branch: BRANCH }));
    return;
  }

  // Deploy endpoint
  if (req.method === 'POST' && req.url === '/deploy') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      // Verify GitHub signature
      const sig = req.headers['x-hub-signature-256'];
      if (!verifySignature(body, sig)) {
        console.log('⚠️  Invalid signature — rejected');
        res.writeHead(401);
        res.end('Invalid signature');
        return;
      }

      // Check if push to correct branch
      try {
        const payload = JSON.parse(body);
        const ref = payload.ref || '';
        if (ref !== `refs/heads/${BRANCH}`) {
          console.log(`Skipping: push to ${ref}, not ${BRANCH}`);
          res.writeHead(200);
          res.end('Skipped: wrong branch');
          return;
        }

        const pusher = payload.pusher?.name || 'unknown';
        const commitMsg = payload.head_commit?.message || '';
        console.log(`📦 Push by ${pusher}: "${commitMsg.split('\n')[0]}"`);
      } catch {
        // If parse fails, still deploy
      }

      res.writeHead(200);
      res.end('Deploy triggered');

      // Deploy async (don't block response)
      setTimeout(deploy, 100);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🔗 Webhook listener on port ${PORT}`);
  console.log(`   Branch: ${BRANCH}`);
  console.log(`   Repo: ${REPO_DIR}`);
  console.log(`   Endpoint: POST /deploy`);
});
