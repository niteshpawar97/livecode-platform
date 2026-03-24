/**
 * GitHub Webhook Listener — Auto-deploy on push
 */

const http = require('node:http');
const crypto = require('node:crypto');
const { execSync } = require('node:child_process');

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
  console.log('\n[' + timestamp + '] Deploy started...');

  try {
    console.log('[1/3] git pull...');
    execSync('cd ' + REPO_DIR + ' && git fetch origin && git reset --hard origin/' + BRANCH, { stdio: 'inherit' });

    console.log('[2/3] docker rebuild...');
    execSync('cd ' + REPO_DIR + ' && docker-compose up -d --build', { stdio: 'inherit', timeout: 300000 });

    console.log('[3/3] cleanup...');
    execSync('docker image prune -f', { stdio: 'inherit' });

    console.log('[' + timestamp + '] Deploy successful!\n');
    return true;
  } catch (err) {
    console.error('[' + timestamp + '] Deploy failed:', err.message);
    return false;
  }
}

const server = http.createServer(function (req, res) {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', branch: BRANCH }));
    return;
  }

  if (req.method === 'GET' && req.url === '/deploy') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Use POST to trigger deploy' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/deploy') {
    var body = '';
    req.on('data', function (chunk) { body += chunk; });
    req.on('end', function () {
      var sig = req.headers['x-hub-signature-256'];
      if (!verifySignature(body, sig)) {
        console.log('Invalid signature — rejected');
        res.writeHead(401);
        res.end('Invalid signature');
        return;
      }

      try {
        var payload = JSON.parse(body);
        var ref = payload.ref || '';
        if (ref !== 'refs/heads/' + BRANCH) {
          console.log('Skipping: push to ' + ref);
          res.writeHead(200);
          res.end('Skipped: wrong branch');
          return;
        }
        var pusher = (payload.pusher && payload.pusher.name) || 'unknown';
        var msg = (payload.head_commit && payload.head_commit.message) || '';
        console.log('Push by ' + pusher + ': "' + msg.split('\n')[0] + '"');
      } catch (e) {}

      res.writeHead(200);
      res.end('Deploy triggered');
      setTimeout(deploy, 100);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, function () {
  console.log('Webhook listener on port ' + PORT);
  console.log('Branch: ' + BRANCH);
  console.log('Repo: ' + REPO_DIR);
});
