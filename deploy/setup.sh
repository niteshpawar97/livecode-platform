#!/bin/bash
# ─── VPS Auto-Deploy Setup Script ───
# Run this ONCE on your VPS to set everything up
#
# Usage: bash setup.sh

set -e

REPO_URL="https://github.com/niteshpawar97/livecode-platform.git"
DEPLOY_DIR="/home/niketgroup-livecode/htdocs"
REPO_DIR="$DEPLOY_DIR/livecode-platform"
WEBHOOK_SECRET="$(openssl rand -hex 20)"

echo "═══════════════════════════════════════"
echo "  LiveCode — VPS Auto-Deploy Setup"
echo "═══════════════════════════════════════"

# 1. Clone repo
echo ""
echo "[1/4] Cloning repo..."
mkdir -p $DEPLOY_DIR
if [ -d "$REPO_DIR" ]; then
  echo "  Repo already exists, pulling latest..."
  cd $REPO_DIR && git pull origin master
else
  git clone $REPO_URL $REPO_DIR
fi

# 2. Create systemd service for webhook
echo "[2/4] Creating webhook service..."
cat > /etc/systemd/system/livecode-webhook.service << UNIT
[Unit]
Description=LiveCode GitHub Webhook Listener
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$REPO_DIR/deploy
Environment=WEBHOOK_PORT=9000
Environment=WEBHOOK_SECRET=$WEBHOOK_SECRET
Environment=REPO_DIR=$REPO_DIR
Environment=DEPLOY_BRANCH=master
ExecStart=/usr/bin/node webhook.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable livecode-webhook
systemctl start livecode-webhook

# 3. First deploy
echo "[3/4] Running first deploy..."
cd $REPO_DIR
docker-compose up -d --build

# 4. Print summary
echo ""
echo "═══════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════"
echo ""
echo "  Webhook URL:    http://YOUR_VPS_IP:9000/deploy"
echo "  Webhook Secret: $WEBHOOK_SECRET"
echo "  Health Check:   http://YOUR_VPS_IP:9000/health"
echo ""
echo "  📋 Next Steps:"
echo "  1. Go to GitHub → Repo → Settings → Webhooks"
echo "  2. Add webhook:"
echo "     URL:     http://YOUR_VPS_IP:9000/deploy"
echo "     Secret:  $WEBHOOK_SECRET"
echo "     Events:  Just the push event"
echo "  3. Done! Every push to master auto-deploys."
echo ""
echo "  🔧 Commands:"
echo "     Status:  systemctl status livecode-webhook"
echo "     Logs:    journalctl -u livecode-webhook -f"
echo "     Restart: systemctl restart livecode-webhook"
echo "═══════════════════════════════════════"
