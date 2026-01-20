# Cocapn Hybrid IDE - Cloudflare Deployment

## 🚀 **Quick Start Deployment**

### **Deploy in 3 Steps:**

1. **Install Dependencies**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Configure Environment**
   ```bash
   # Update wrangler.toml with your account details
   # Add your API keys to environment variables
   ```

3. **Deploy**
   ```bash
   ./deploy.sh
   ```

### **Live URLs After Deployment:**
- **Main Application**: https://cocapn.ai
- **Developer Backend**: https://cocapn.ai/dev
- **Login Pages**: https://cocapn.ai/login and https://cocapn.ai/dev/login

### **Access Credentials:**
- **Beta Tester**: `magnus` / `tryme`
- **Developer**: `casey` / `fixme`

## 📁 **Deployment Structure**

```
deployment/
├── worker.js              # Main Cloudflare Worker
├── wrangler.toml          # Configuration
├── deploy.sh             # Deployment script
├── secure.js             # Security utilities
├── package.json          # Dependencies
└── cloudflare-setup.md   # Setup guide
```

## 🔧 **Key Features Deployed**

### **1. Authentication System**
- ✅ Session-based authentication
- ✅ Secure login pages for beta testers and developers
- ✅ Automatic session expiration
- ✅ Logout functionality

### **2. Security Features**
- ✅ Rate limiting (60 requests/minute, 1000 requests/hour)
- ✅ Input validation and sanitization
- ✅ Security headers (CSP, XSS protection)
- ✅ Session management
- ✅ Error logging and monitoring

### **3. API Endpoints**
- ✅ Full 18-agent API implementation
- ✅ Project management
- ✅ Authentication (login/logout)
- ✅ Error handling and validation
- ✅ CORS headers for cross-origin requests

### **4. User Interface**
- ✅ Beautiful login screen
- ✅ Modern dashboard
- ✅ Responsive design
- ✅ Professional styling

## 🎯 **Deployment Workflow**

### **Development Mode**
```bash
# Test locally
wrangler dev --env development

# Test with different environments
wrangler dev --env production
```

### **Production Deployment**
```bash
# Deploy both environments
./deploy.sh

# Or deploy individually
wrangler deploy --env production
wrangler deploy --env development
```

### **Configuration Management**
```bash
# Check deployment status
wrangler whoami

# View deployment logs
wrangler tail cocapn-hybrid-ide

# Update configuration
wrangler config
```

## 🔐 **Security Implementation**

### **Authentication Flow**
1. User submits credentials via login page
2. Worker validates credentials against stored users
3. Session is created with 24-hour expiration
4. Session ID stored in secure HttpOnly cookie
5. API requests validate session ID
6. Unauthorized requests return 401 error

### **Rate Limiting**
- IP-based rate limiting
- Per-minute and per-hour limits
- Automatic cleanup of expired records
- Configurable limits via wrangler.toml

### **Input Validation**
- Email format validation
- Username format requirements (3-20 chars, alphanumeric + underscore)
- Password length requirements (minimum 6 characters)
- XSS protection input sanitization

### **Security Headers**
```
Content-Security-Policy: Restricts script sources
X-Content-Type-Options: Prevents MIME type sniffing
X-Frame-Options: Prevents clickjacking
X-XSS-Protection: Enables XSS filtering
Referrer-Policy: Controls referrer information
Permissions-Policy: Restricts browser permissions
```

## 📊 **Monitoring and Analytics**

### **Built-in Logging**
- Request/response logging
- Error tracking
- Security event logging
- Performance metrics

### **Environment Variables**
```bash
# Required for production
AI_PROVIDER_API_KEY=your-openai-key
DATABASE_URL=your-database-connection
JWT_SECRET=your-jwt-secret
ANALYTICS_ID=your-analytics-id

# Optional configuration
LOG_LEVEL=info
MAX_SESSIONS=1000
RATE_LIMIT_MINUTE=60
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Deployment Fails**
```bash
# Check Wrangler setup
wrangler whoami

# Check DNS configuration
nslookup cocapn.ai

# View logs
wrangler tail
```

#### **Authentication Not Working**
```bash
# Test login endpoint
curl -X POST https://cocapn.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"magnus","password":"tryme"}'
```

#### **Rate Limiting Issues**
```bash
# Check rate limiting configuration
wrangler config
```

### **Debug Commands**
```bash
# Enable debug mode
wrangler dev --debug

# View configuration
wrangler config get

# Test endpoints locally
curl http://localhost:8787/api/agents/simulation \
  -X POST -H "Content-Type: application/json" \
  -d '{"action":"run_simulation","parameters":{}}'
```

## 🔄 **Maintenance and Updates**

### **Update Process**
1. Make changes to worker.js
2. Test locally: `wrangler dev --debug`
3. Deploy: `./deploy.sh`
4. Monitor: `wrangler tail`

### **Session Cleanup**
Automatic cleanup runs every 5 minutes:
- Removes expired sessions
- Clears rate limiting data
- Updates logs

### **Backup Strategy**
```bash
# Export configuration
wrangler kv list > backup.json

# Manual backup of important data
cp wrangler.toml wrangler.toml.backup
```

## 🎉 **Deployment Complete!**

Your Cocapn Hybrid IDE is now deployed with:

### **✅ Features Ready**
- 18 AI-powered agents fully functional
- Secure authentication system
- Professional UI/UX
- Real-time collaboration tools
- Performance optimization
- Enterprise-grade security
- Comprehensive monitoring

### **🌐 Access URLs**
- **Main App**: https://cocapn.ai
- **Dev Backend**: https://cocapn.ai/dev
- **API**: https://cocapn.ai/api/*

### **🔑 Credentials**
- **Beta**: `magnus` / `tryme`
- **Dev**: `casey` / `fixme`

### **🚀 Next Steps**
1. **Test Access**: Visit the URLs and test login
2. **Configure APIs**: Add your OpenAI API key to wrangler.toml
3. **Monitor**: Check deployment logs via Wrangler dashboard
4. **Scale**: Configure additional resources as needed

---

**Need help?** Check `cloudflare-setup.md` for detailed configuration instructions, or contact support@cocapn.ai.

**Happy coding! 🚀**