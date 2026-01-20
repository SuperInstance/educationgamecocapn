#!/bin/bash

# Cocapn Hybrid IDE Deployment Script
# Deploy to Cloudflare Workers

set -e

echo "🚀 Starting Cocapn Hybrid IDE deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it first:"
    echo "   npm install -g wrangler"
    exit 1
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "❌ Please login to Wrangler first:"
    echo "   wrangler login"
    exit 1
fi

echo "✅ Wrangler CLI is ready"

# Build the worker
echo "🔨 Building worker..."
npm run build

# Create necessary directories
mkdir -p deployment
cp dist/worker.js deployment/worker.js
cp deployment/wrangler.toml deployment/

# Deploy to production (main cocapn.ai)
echo "🚀 Deploying to cocapn.ai..."
cd deployment

wrangler deploy --env production

echo "✅ Successfully deployed to cocapn.ai"

# Deploy development backend (cocapn.ai/dev)
echo "🚀 Deploying development backend..."
wrangler deploy --env development

echo "✅ Successfully deployed development backend"

# Create deployment summary
echo ""
echo "📋 Deployment Summary:"
echo "   Main Application: https://cocapn.ai"
echo "   Dev Backend: https://cocapn.ai/dev"
echo ""
echo "🔑 Login Credentials:"
echo "   Beta Tester: magnus / tryme"
echo "   Developer: casey / fixme"
echo ""
echo "🎉 Deployment complete! Your Cocapn Hybrid IDE is now live."