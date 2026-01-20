# Cloudflare Deployment Guide for Cocapn Hybrid IDE

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Install Prerequisites**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### **Step 2: Configure Your Account**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add your domain (cocapn.ai) to Cloudflare
3. Ensure DNS records are properly configured:
   ```
   A record: @ -> 192.0.2.1 (your server IP)
   CNAME: www -> @
   ```

### **Step 3: Deploy the Application**
```bash
# Navigate to deployment directory
cd /home/eileen/projects/claudeflare/deployment

# Run deployment script
./deploy.sh
```

### **Step 4: Configure Custom Domain**
1. In Cloudflare Dashboard, go to "Workers"
2. Select your worker (cocapn-hybrid-ide)
3. Go to "Triggers" → "Custom Domains"
4. Add your domain: `cocapn.ai`

## 🔧 **Advanced Configuration**

### **Environment Variables Setup**
Create a `.env` file in the deployment directory:

```env
# Production Environment
AI_PROVIDER_API_KEY=your-openai-api-key
DATABASE_URL=your-database-connection-string
REDIS_URL=your-redis-connection-string
JWT_SECRET=your-jwt-secret-key
ANALYTICS_ID=your-google-analytics-id

# Development Environment
DEV_AI_API_KEY=dev-openai-key
DEV_DATABASE_URL=dev-database-connection
```

### **Worker Configuration**
Update `wrangler.toml` with your specific settings:

```toml
name = "cocapn-hybrid-ide"
main = "worker.js"
compatibility_date = "2024-01-15"

[env.production]
vars = {
  AI_PROVIDER_API_KEY = "your-api-key",
  ENVIRONMENT = "production"
}

[[routes]]
zone_id = "your-zone-id"
pattern = "cocapn.ai/*"
custom_domain = true
```

### **KV Namespace for Session Storage**
1. Create KV Namespace in Cloudflare Dashboard
2. Update namespace ID in `wrangler.toml`
3. Enable session persistence

## 🎯 **Available Endpoints**

### **Main Application**
- **Production**: `https://cocapn.ai`
- **Login**: `https://cocapn.ai/login`
- **Beta Tester Access**: `magnus` / `tryme`

### **Developer Backend**
- **Production**: `https://cocapn.ai/dev`
- **Login**: `https://cocapn.ai/dev/login`
- **Developer Access**: `casey` / `fixme`

### **API Endpoints**
All API endpoints are available at:
- `https://cocapn.ai/api/`
- `https://cocapn.ai/dev/api/`

## 🔒 **Security Configuration**

### **Rate Limiting**
```toml
[[limits]]
key = "ip_addr"
value = "100"
```

### **CORS Headers**
```javascript
// Add to worker.js
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://cocapn.ai',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
```

### **Authentication**
```javascript
// Session validation function
function validateSession(sessionId) {
  if (!sessionId) return null;
  return KV.get(`session_${sessionId}`);
}
```

## 📊 **Monitoring and Analytics**

### **Enable Observability**
```toml
[observability]
enabled = true
head_sampling_rate = 1
```

### **Error Tracking**
```javascript
// Error logging integration
addEventListener('error', (event) => {
  console.error('Worker error:', event.error);
  // Send to your error tracking service
});
```

### **Performance Monitoring**
```javascript
// Add to fetch handler
const startTime = Date.now();
await fetch(request);
const duration = Date.now() - startTime;
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Deployment Failed**
```bash
# Check Wrangler status
wrangler whoami

# Check deployment logs
wrangler tail cocapn-hybrid-ide
```

#### **2. Custom Domain Not Working**
```bash
# Verify DNS configuration
nslookup cocapn.ai

# Check Worker triggers
wrangler triggers list
```

#### **3. Authentication Issues**
```javascript
// Test session creation
curl -X POST https://cocapn.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"magnus","password":"tryme"}'
```

### **Debug Mode**
```bash
# Enable debug logging
wrangler dev --env development --debug

# Test locally
wrangler tail --format pretty
```

## 🔄 **Update and Maintenance**

### **Update Deployment**
```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
./deploy.sh
```

### **Session Cleanup**
```javascript
// Add cleanup function
async function cleanupExpiredSessions() {
  const sessions = await KV.list();
  for (const session of sessions) {
    const sessionData = await KV.get(session.name);
    if (sessionData && sessionData.expiresAt < Date.now()) {
      await KV.delete(session.name);
    }
  }
}
```

### **Backup and Restore**
```bash
# Export configuration
wrangler kv list --binding=SESSIONS > backup.json

# Import configuration
wrangler kv import --binding=SESSIONS backup.json
```

## 📞 **Support**

### **Cloudflare Resources**
- **Documentation**: [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- **Community**: [Cloudflare Workers Community](https://community.cloudflare.com/)
- **Status**: [Cloudflare Status](https://www.cloudflarestatus.com/)

### **Cocapn Support**
- **Email**: support@cocapn.ai
- **Discord**: [Cocapn Discord Server](https://discord.cocapn.com)
- **Issues**: [GitHub Issues](https://github.com/cocapn/hybrid-ide/issues)

## 🎉 **Deployment Complete!**

Your Cocapn Hybrid IDE is now deployed and ready to use:

### **Access URLs**
- **Main Application**: `https://cocapn.ai`
- **Developer Backend**: `https://cocapn.ai/dev`

### **Login Credentials**
- **Beta Tester**: `magnus` / `tryme`
- **Developer**: `casey` / `fixme`

### **Features Available**
- ✅ 18 AI-powered agents
- ✅ Real-time collaboration
- ✅ STEM learning tools
- ✅ Performance optimization
- ✅ Enterprise security
- ✅ Advanced AI integration

Start exploring the future of AI-powered development and learning! 🚀

---

**Need help?** Contact support@cocapn.ai or visit our Discord server for real-time assistance.