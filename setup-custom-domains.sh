#!/bin/bash

# Cocapn Hybrid IDE - Custom Domain Setup Script
# This script helps configure custom domains for your deployed workers

set -e

echo "🌐 Setting up custom domains for Cocapn Hybrid IDE"
echo "================================================"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo ""
echo "📋 Current Deployed URLs:"
echo "Production: https://cocapn-hybrid-ide.casey-digennaro.workers.dev"
echo "Development: https://cocapn-dev-backend.casey-digennaro.workers.dev"
echo ""

echo "🎯 Target Custom Domains:"
echo "Main Application: https://cocapn.ai"
echo "Developer Backend: https://cocapn.ai/dev"
echo ""

echo "📋 Setup Instructions:"
echo "1. Add cocapn.ai to your Cloudflare account"
echo "2. Configure DNS records:"
echo "   CNAME www -> proxy"
echo "   CNAME @ -> proxy"
echo "3. Wait for DNS propagation"
echo "4. Enable proxy (orange cloud) for DNS records"
echo ""

echo "📝 Manual Configuration Steps:"
echo ""
echo "Step 1: Add cocapn.ai to Cloudflare"
echo "1. Go to https://dash.cloudflare.com"
echo "2. Add domain: cocapn.ai"
echo "3. Complete DNS setup"
echo ""
echo "Step 2: Configure Workers routes"
echo "1. Go to Workers & Pages section"
echo "2. Select 'cocapn-hybrid-ide' worker"
echo "3. Go to 'Triggers' -> 'Custom Domains'"
echo "4. Add custom domain: cocapn.ai"
echo "5. Add route: cocapn.ai/*"
echo ""
echo "Step 3: Configure development backend"
echo "1. Select 'cocapn-dev-backend' worker"
echo "2. Go to 'Triggers' -> 'Custom Domains'"
echo "3. Add custom domain: cocapn.ai"
echo "4. Add route: cocapn.ai/dev/*"
echo ""

echo "🔧 Alternative Setup via Cloudflare Dashboard:"
echo "1. Log in to Cloudflare Dashboard"
echo "2. Navigate to Workers & Pages"
echo "3. Select your workers"
echo "4. Add custom domains manually"
echo ""

echo "✅ Configuration Complete When:"
echo "- https://cocapn.ai redirects to your main application"
echo "- https://cocapn.ai/dev redirects to your developer backend"
echo "- All API endpoints are accessible"
echo ""

echo "🧪 Testing After Setup:"
echo "1. Open https://cocapn.ai"
echo "2. Login with: magnus / tryme"
echo "3. Test developer backend: https://cocapn.ai/dev"
echo "4. Login with: casey / fixme"
echo ""

echo "🎉 Setup Complete!"
echo "Your Cocapn Hybrid IDE will be available at:"
echo "Main Application: https://cocapn.ai"
echo "Developer Backend: https://cocapn.ai/dev"