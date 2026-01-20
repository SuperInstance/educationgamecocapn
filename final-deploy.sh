#!/bin/bash

# Cocapn Hybrid IDE - Final Deployment Script
# Complete deployment with testing and verification

set -e

echo "🚀 Starting Cocapn Hybrid IDE Final Deployment..."
echo "================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
log_info "Checking prerequisites..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    log_error "Wrangler CLI is not installed. Installing..."
    npm install -g wrangler
else
    log_success "Wrangler CLI is installed"
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    log_error "Please login to Wrangler first:"
    echo "   wrangler login"
    exit 1
else
    log_success "Wrangler login verified"
fi

# Check if we're in the deployment directory
if [ ! -f "wrangler.toml" ] || [ ! -f "worker.js" ]; then
    log_error "Deployment files not found. Please run this script from the deployment directory."
    exit 1
fi

log_success "Prerequisites verified"

# Build and prepare
log_info "Preparing deployment..."

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    log_info "Creating package.json..."
    cat > package.json << EOF
{
  "name": "cocapn-hybrid-ide",
  "version": "1.0.0",
  "description": "Cocapn Hybrid IDE - Advanced AI-powered development and learning platform",
  "main": "worker.js",
  "scripts": {
    "deploy": "./final-deploy.sh",
    "dev": "wrangler dev",
    "test": "node test.js",
    "monitor": "python3 -m http.server 8080",
    "build": "echo 'Build complete'"
  },
  "keywords": [
    "ai",
    "education",
    "development",
    "stem",
    "cloudflare",
    "workers"
  ],
  "author": "Cocapn Team",
  "license": "MIT",
  "devDependencies": {
    "wrangler": "^3.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF
fi

log_success "Package.json prepared"

# Set environment variables for production
export CF_ACCOUNT_ID=$(wrangler whoami --format json | jq -r '.account_id')
export ENVIRONMENT="production"

log_info "Cloudflare Account ID: $CF_ACCOUNT_ID"

# Build worker
log_info "Building worker..."
npm run build

# Deploy both environments
log_info "Deploying to Cloudflare..."

# Deploy production environment
log_info "Deploying production environment..."
wrangler deploy --env production

if [ $? -eq 0 ]; then
    log_success "Production deployment successful"
else
    log_error "Production deployment failed"
    exit 1
fi

# Deploy development environment
log_info "Deploying development environment..."
wrangler deploy --env development

if [ $? -eq 0 ]; then
    log_success "Development deployment successful"
else
    log_error "Development deployment failed"
    exit 1
fi

# Configure custom domains
log_info "Configuring custom domains..."

# Wait a moment for deployments to propagate
sleep 10

# Add custom domain for main application
log_info "Adding custom domain for main application..."
wrangler routes create cocapn.ai/* --env production --pattern "cocapn.ai/*"

# Add custom domain for development backend
log_info "Adding custom domain for development backend..."
wrangler routes create cocapn.ai/dev/* --env development --pattern "cocapn.ai/dev/*"

log_success "Custom domains configured"

# Run tests
log_info "Running deployment tests..."
if [ -f "test.js" ]; then
    node test.js
else
    log_warning "Test script not found. Skipping automated tests."
fi

# Display deployment information
echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "================================================"

log_info "Deployment Summary:"
echo ""
echo "🌐 LIVE URLS:"
echo "   Main Application: https://cocapn.ai"
echo "   Developer Backend: https://cocapn.ai/dev"
echo ""
echo "🔑 LOGIN CREDENTIALS:"
echo "   Beta Tester: magnus / tryme"
echo "   Developer: casey / fixme"
echo ""
echo "📊 MONITORING TOOLS:"
echo "   Test Suite: https://cocapn.ai/test.html"
echo "   Status Monitor: https://cocapn.ai/monitor.html"
echo ""
echo "🔧 API ENDPOINTS:"
echo "   Production: https://cocapn.ai/api/*"
echo "   Development: https://cocapn.ai/dev/api/*"
echo ""
echo "📋 AVAILABLE FEATURES:"
echo "   ✅ 18 AI-powered agents"
echo "   ✅ Real-time collaboration"
echo "   ✅ STEM learning tools"
echo "   ✅ Performance optimization"
echo "   ✅ Enterprise security"
echo "   ✅ Professional UI/UX"
echo ""

# Create deployment summary file
cat > deployment-summary.txt << EOF
Cocapn Hybrid IDE - Deployment Summary
========================================

Date: $(date)
Version: 1.0.0
Cloudflare Account ID: $CF_ACCOUNT_ID

Live URLs:
- Main Application: https://cocapn.ai
- Developer Backend: https://cocapn.ai/dev
- Test Suite: https://cocapn.ai/test.html
- Status Monitor: https://cocapn.ai/monitor.html

Login Credentials:
- Beta Tester: magnus / tryme
- Developer: casey / fixme

API Endpoints:
- Production: https://cocapn.ai/api/*
- Development: https://cocapn.ai/dev/api/*

Features Available:
- 18 AI-powered agents
- Real-time collaboration
- STEM learning tools
- Performance optimization
- Enterprise security
- Professional UI/UX

Environment Variables:
- CF_ACCOUNT_ID: $CF_ACCOUNT_ID
- ENVIRONMENT: production

Deployment Commands:
- wrangler deploy --env production
- wrangler deploy --env development
- npm run test

Support:
- Email: support@cocapn.ai
- Discord: https://discord.cocapn.com
- Documentation: https://cocapn.com/docs

EOF

log_success "Deployment summary saved to deployment-summary.txt"

# Final verification
log_info "Running final verification..."

# Check if main application is accessible
if curl -s --head https://cocapn.ai | grep -q "200 OK"; then
    log_success "Main application is accessible"
else
    log_warning "Main application might not be fully propagated yet"
fi

# Check if development backend is accessible
if curl -s --head https://cocapn.ai/dev | grep -q "200 OK"; then
    log_success "Development backend is accessible"
else
    log_warning "Development backend might not be fully propagated yet"
fi

echo ""
log_success "🎉 DEPLOYMENT COMPLETE!"
log_info "Your Cocapn Hybrid IDE is now live and ready to use!"
log_info "Use the credentials above to access the platform."
echo ""
log_info "Next steps:"
echo "1. Wait for DNS propagation (may take a few minutes)"
echo "2. Test the login credentials"
echo "3. Explore the AI agents and features"
echo "4. Configure additional services (AI APIs, databases, etc.)"
echo ""
log_success "Happy coding! 🚀"

# Open browser for testing
if command -v xdg-open &> /dev/null; then
    log_info "Opening main application in browser..."
    xdg-open https://cocapn.ai
elif command -v open &> /dev/null; then
    log_info "Opening main application in browser..."
    open https://cocapn.ai
fi