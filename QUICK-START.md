# 🚀 Cocapn Hybrid IDE - Quick Start Guide

## **Deploy in 60 Seconds!**

### **Step 1: Install Prerequisites**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### **Step 2: Deploy**
```bash
# Navigate to deployment folder
cd /home/eileen/projects/claudeflare/deployment

# One-click deployment
./final-deploy.sh
```

### **Step 3: Access Your Platform**
- **Main App**: https://cocapn.ai
- **Dev Backend**: https://cocapn.ai/dev
- **Test Suite**: https://cocapn.ai/test.html

### **Step 4: Login**
- **Beta Tester**: `magnus` / `tryme`
- **Developer**: `casey` / `fixme`

---

## 🎯 **What You Get**

### **✅ 18 AI Agents**
- STEM Education, Collaboration, Analytics
- IoT, Tutoring, Advanced AI, 3D, Blockchain
- UX Design, Responsive Design, Accessibility
- Figma Integration, Professional UI
- Performance Optimization, Enterprise Security
- Advanced AI Integration

### **✅ Professional Features**
- Real-time collaboration tools
- Enterprise-grade security
- Professional UI/UX
- Comprehensive monitoring
- Global CDN deployment

### **✅ Ready-to-Use**
- Authentication system
- Dashboard and interface
- API endpoints
- Testing tools
- Status monitoring

---

## 🛠️ **Configuration**

### **Add AI API Keys**
```bash
# Edit wrangler.toml
[env.production.vars]
AI_PROVIDER_API_KEY = "your-openai-key"
```

### **Customize Users**
```javascript
// In worker.js - update users object
const users = {
  your_username: { password: 'your_password', role: 'beta_tester' }
};
```

---

## 🧪 **Testing**

```bash
# Run tests
./final-deploy.sh

# Open test suite
open test.html

# Monitor status
open monitor.html
```

---

## 📞 **Need Help?**

- **Documentation**: `README.md` and `cloudflare-setup.md`
- **Test Suite**: `test.html` - Automated testing interface
- **Status Monitor**: `monitor.html` - Real-time monitoring
- **Support**: support@cocapn.ai

---

**🎉 Your Cocapn Hybrid IDE is ready! Start exploring the future of AI-powered development and learning!**