# 🛠️ Cocapn Developer Guide

Welcome to the Cocapn development guide! This comprehensive resource will help you set up your development environment, understand the codebase, and contribute to our AI-powered educational platform.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v16.0 or higher
- **npm**: v8.0 or higher
- **Git**: For version control
- **Cloudflare Account**: For deployment

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/SuperInstance/cocapn.git
cd cocapn

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure your environment
nano .env
```

### Environment Configuration

Create a `.env` file with your configuration:

```env
# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Application Configuration
NODE_ENV=development
PORT=8787

# AI Services Configuration
CF_AI_ACCOUNT_ID=your_ai_account_id
CF_AI_API_KEY=your_ai_api_key
```

---

## 🏗️ Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Cocapn Platform                              │
├─────────────────────────────────────────────────────────────────────┤
│  Frontend: HTML5/CSS3/JavaScript (ES6+)                            │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  │   Dashboard    │  │   Login UI     │  │  AI Services   │    │
│  │  │                │  │                │  │  Interface     │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  Backend: Cloudflare Workers (Serverless JavaScript)              │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  │   Auth Engine  │  │  AI Services   │  │   Physics      │    │
│  │  │                │  │                │  │   Engine       │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  Data Layer: Cloudflare Services                                  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  │      D1        │  │      KV        │  │      R2        │    │
│  │  │   Database     │  │   Cache        │  │   Storage      │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  Infrastructure: Cloudflare Global Network                          │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Workers Edge Network → Pages → R2 → KV → AI Services           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Frontend Layer
- **Technology**: Vanilla HTML5/CSS3/JavaScript
- **Responsibility**: User interface and interactions
- **Key Features**:
  - Responsive design
  - Real-time updates
  - AI service integration
  - Physics simulation visualization

#### 2. Backend Layer (Cloudflare Workers)
- **Technology**: JavaScript/TypeScript
- **Responsibility**: Business logic and API endpoints
- **Key Services**:
  - User authentication
  - AI service orchestration
  - Physics simulation
  - Data processing

#### 3. Data Layer
- **Cloudflare D1**: Primary database for structured data
- **Cloudflare KV**: Key-value store for caching and sessions
- **Cloudflare R2**: Object storage for files and assets

#### 4. AI Services Layer
- **Cloudflare Flux**: Text-to-image generation
- **Cloudflare TTS**: Text-to-speech synthesis
- **Cloudflare Vision**: Image analysis
- **Cloudflare Translation**: Multi-language support

---

## 📁 Project Structure

```
cocapn/
├── README.md                    # Project documentation
├── package.json                 # Dependencies and scripts
├── playwright.config.js         # Playwright testing configuration
├── worker.js                    # Main Cloudflare Worker entry point
├── deployment/
│   ├── worker.js               # Production worker
│   ├── deploy.sh               # Deployment script
│   └── package.json            # Deployment dependencies
├── docs/                       # Documentation
│   ├── USER_GUIDE.md           # User guide
│   ├── DEVELOPER_GUIDE.md     # This file
│   ├── ARCHITECTURE.md        # System architecture
│   └── API_REFERENCE.md       # API documentation
├── tests/                      # Test suite
│   ├── auth/                   # Authentication tests
│   ├── dashboard/              # Dashboard tests
│   ├── simulation/            # Physics simulation tests
│   ├── ui/                     # UI/UX tests
│   ├── performance/            # Performance tests
│   └── accessibility/          # Accessibility tests
├── scripts/                    # Utility scripts
│   └── test-platform-curl.sh  # Testing script
└── examples/                   # Example implementations
```

### Key Files Explained

#### `worker.js`
**Purpose**: Main Cloudflare Worker entry point
**Responsibilities**:
- Route incoming requests
- Handle authentication
- Coordinate AI services
- Manage user sessions

#### `package.json`
**Purpose**: Project configuration and dependencies
**Key Scripts**:
- `npm run dev`: Development server
- `npm run test:all`: Run all tests
- `npm run deploy`: Deploy to production

#### `playwright.config.js`
**Purpose**: Testing framework configuration
**Features**:
- Multi-browser testing
- Responsive design testing
- Performance monitoring
- Accessibility compliance

---

## 🔧 Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Run development server on specific port
PORT=3000 npm run dev

# Run with specific environment
NODE_ENV=development npm run dev
```

### Development Server Features

- **Hot reloading** for code changes
- **Error handling** with detailed logging
- **Debug mode** for development
- **Testing integration** for quality assurance

### Code Quality Standards

#### JavaScript/TypeScript Standards
```javascript
// Use const/let instead of var
const user = getCurrentUser();

// Use meaningful variable names
const sessionToken = generateSessionToken();

// Use async/await for asynchronous operations
async function getUserData() {
  const user = await fetchUser();
  return user;
}

// Use proper error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}
```

#### CSS Standards
```css
/* Use meaningful class names */
.dashboard-stats {
  /* styles */
}

/* Use CSS custom properties */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
}

/* Use responsive design */
@media (max-width: 768px) {
  .dashboard-stats {
    font-size: 14px;
  }
}
```

---

## 🧪 Testing Framework

### Testing Overview

We use **Playwright** for end-to-end testing and **curl** for API testing.

### Test Categories

#### 1. Authentication Tests (`tests/auth/`)
```javascript
// tests/auth/login.test.js
test('should display login page correctly', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toContainText('Cocapn');
});
```

#### 2. Dashboard Tests (`tests/dashboard/`)
```javascript
// tests/dashboard/main.test.js
test('should show user stats correctly', async ({ page }) => {
  const statCards = page.locator('.ai-stat-card');
  await expect(statCards).toHaveCount(4);
});
```

#### 3. UI Tests (`tests/ui/`)
```javascript
// tests/ui/responsive.test.js
test('should be responsive', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('.dashboard')).toBeVisible();
});
```

### Running Tests

```bash
# Run all tests
npm run test:all

# Run specific test categories
npm run test:login      # Authentication tests
npm run test:dashboard  # Dashboard tests
npm run test:ui         # UI tests
npm run test:performance # Performance tests
npm run test:accessibility # Accessibility tests

# Run tests in CI mode
npm run test:ci

# Generate test reports
npm run test:report
```

### Testing Best Practices

1. **Test user journeys, not individual components**
2. **Use meaningful test names**
3. **Maintain test isolation**
4. **Update tests with feature changes**
5. **Monitor test performance**

---

## 🚀 Deployment

### Cloudflare Workers Deployment

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to production
npm run deploy

# Deploy to staging
wrangler deploy --env staging
```

### Environment Variables

Create a `.dev.vars` file for development:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
CF_AI_ACCOUNT_ID=your_ai_account_id
CF_AI_API_KEY=your_ai_api_key
```

### Production Deployment

```bash
# Build the application
npm run build

# Deploy to production
wrangler deploy --env production

# Check deployment status
wrangler deployments list
```

---

## 🤖 AI Services Integration

### Cloudflare AI Services

#### Text-to-Image Generation (Flux)
```javascript
// Generate images using Cloudflare Flux
async function generateImage(prompt) {
  const response = await fetch('https://ai.cloudflare.com/v1/accounts/.../workflows/...', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt,
      model: 'flux-pro',
      width: 256,
      height: 256
    })
  });
  
  return await response.json();
}
```

#### Text-to-Speech (TTS)
```javascript
// Generate speech using Cloudflare TTS
async function generateSpeech(text) {
  const response = await fetch('https://api.cloudflare.com/client/v4/accounts/.../text-to-speech/speak', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      voice: 'alloy',
      model: 'streaming-voice'
    })
  });
  
  return await response.blob();
}
```

### AI Service Configuration

```javascript
// src/ai/services.js
export const AIServices = {
  flux: {
    endpoint: 'https://ai.cloudflare.com/v1/accounts/.../workflows/...',
    model: 'flux-pro',
    parameters: {
      width: 256,
      height: 256,
      steps: 20
    }
  },
  
  tts: {
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/.../text-to-speech/speak',
    model: 'streaming-voice',
    voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
  },
  
  vision: {
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/.../images/analyze',
    model: 'vision-v1'
  }
};
```

---

## 🔐 Security Implementation

### Authentication System

```javascript
// src/auth/manager.js
export class AuthManager {
  async validateLogin(username, password) {
    // Validate credentials against user database
    const user = await this.getUser(username);
    if (!user) return false;
    
    // Verify password (using secure hashing)
    const isValid = await this.verifyPassword(password, user.password);
    return isValid;
  }
  
  async createSession(user) {
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    };
    
    // Store session in KV
    await this.kv.put(`session:${sessionId}`, JSON.stringify(session));
    return session;
  }
}
```

### Security Headers

```javascript
// src/security/headers.js
export const SecurityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
```

---

## 📊 Performance Optimization

### Caching Strategy

```javascript
// src/cache/manager.js
export class CacheManager {
  async get(key) {
    const cached = await this.kv.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  
  async set(key, value, ttl = 3600) {
    await this.kv.put(key, JSON.stringify(value), {
      expirationTtl: ttl
    });
  }
  
  async generateKey(prefix, ...params) {
    const hash = await this.hashParams(...params);
    return `${prefix}:${hash}`;
  }
}
```

### Performance Monitoring

```javascript
// src/monitoring/performance.js
export class PerformanceMonitor {
  async trackMetric(name, value, tags = {}) {
    const metric = {
      name,
      value,
      tags,
      timestamp: Date.now(),
      source: 'worker'
    };
    
    await this.metrics.push(metric);
  }
  
  async getPerformanceReport() {
    return {
      responseTime: await this.getAverageResponseTime(),
      errorRate: await this.getErrorRate(),
      throughput: await this.getThroughput(),
      memoryUsage: await this.getMemoryUsage()
    };
  }
}
```

---

## 🌍 Internationalization (i18n)

### Multi-language Support

```javascript
// src/i18n/manager.js
export class I18nManager {
  constructor() {
    this.translations = {
      en: {
        'welcome': 'Welcome to Cocapn',
        'login': 'Login',
        'dashboard': 'Dashboard'
      },
      es: {
        'welcome': 'Bienvenido a Cocapn',
        'login': 'Iniciar sesión',
        'dashboard': 'Panel de control'
      }
    };
  }
  
  translate(key, language = 'en') {
    return this.translations[language]?.[key] || key;
  }
  
  async detectLanguage(headers) {
    const acceptLanguage = headers.get('accept-language') || 'en';
    return acceptLanguage.split(',')[0].split('-')[0];
  }
}
```

---

## 📱 Responsive Design

### CSS Media Queries

```css
/* Base styles */
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* Tablet styles */
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    padding: 15px;
  }
}

/* Mobile styles */
@media (max-width: 480px) {
  .dashboard {
    grid-template-columns: 1fr;
    padding: 10px;
  }
}
```

### JavaScript Responsive Handling

```javascript
// src/ui/responsive.js
export class ResponsiveHandler {
  constructor() {
    this.viewports = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1280, height: 720 }
    };
  }
  
  getCurrentViewport() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width <= 480) return 'mobile';
    if (width <= 768) return 'tablet';
    return 'desktop';
  }
  
  adjustLayoutForViewport(viewport) {
    const dimensions = this.viewports[viewport];
    document.documentElement.style.setProperty('--viewport-width', dimensions.width + 'px');
    document.documentElement.style.setProperty('--viewport-height', dimensions.height + 'px');
  }
}
```

---

## 🧮 API Reference

### Authentication API

#### POST `/api/auth/login`
```javascript
{
  "username": "string",
  "password": "string"
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "session": "string",
    "user": {
      "id": "string",
      "name": "string",
      "role": "string"
    }
  }
}
```

### AI Services API

#### POST `/api/ai`
```javascript
{
  "service": "text-to-image|text-to-speech|image-analysis|translation",
  "parameters": {
    "prompt": "string",
    "model": "string"
  }
}
```

### Simulation API

#### POST `/api/agents/simulation`
```javascript
{
  "action": "run_simulation",
  "parameters": {
    "project": {
      "type": "circuit_simulation",
      "components": ["array"]
    }
  }
}
```

---

## 🤝 Contributing Guidelines

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes**
4. **Run tests**: `npm run test:all`
5. **Commit changes**: `git commit -m 'feat: add new feature'`
6. **Push to branch**: `git push origin feature/new-feature`
7. **Create a Pull Request**

### Code Style Guidelines

#### JavaScript/TypeScript
```javascript
// Use meaningful variable names
const userName = 'john_doe'; // Good
const u = 'john_doe'; // Bad

// Use async/await for async operations
async function getUserData() {
  const user = await fetchUser();
  return user;
}

// Handle errors properly
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}
```

#### CSS
```css
/* Use meaningful class names */
.dashboard-stats {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

/* Use CSS custom properties */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
}

/* Use responsive design */
@media (max-width: 768px) {
  .dashboard-stats {
    flex-direction: column;
  }
}
```

### Git Commit Guidelines

#### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Test changes
- **chore**: Build process or auxiliary tool changes

#### Examples
```
feat(auth): add two-factor authentication
fix(ui): resolve responsive design issues on mobile
docs(api): update API documentation
test(auth): add authentication tests
```

---

## 🔧 Development Tools

### Essential Tools

#### 1. VS Code Extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright"
  ]
}
```

#### 2. Chrome Extensions
- **React Developer Tools**: For debugging
- **Redux DevTools**: State management
- **Lighthouse**: Performance analysis
- **Web Developer**: Web development tools

#### 3. Command Line Tools
```bash
# Install essential tools
npm install -g wrangler prettier eslint

# Format code
prettier --write .

# Lint code
eslint .

# Type check
tsc --noEmit
```

### Development Environment Setup

```bash
# 1. Clone and install
git clone https://github.com/SuperInstance/cocapn.git
cd cocapn
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your configuration

# 3. Install development tools
npm install -g @playwright/test

# 4. Install browsers for Playwright
npx playwright install

# 5. Run development server
npm run dev
```

---

## 📈 Monitoring & Analytics

### Performance Monitoring

#### Response Time Tracking
```javascript
// src/monitoring/response-time.js
export class ResponseTimeMonitor {
  async trackRequest(url, method, duration) {
    const metric = {
      url,
      method,
      duration,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    await this.metrics.push('response_time', metric);
  }
  
  async getAverageResponseTime(period = '24h') {
    const metrics = await this.metrics.get('response_time', period);
    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }
}
```

#### Error Tracking
```javascript
// src/monitoring/errors.js
export class ErrorTracker {
  async trackError(error, context = {}) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    await this.errors.push(errorReport);
    await this.alertIfCritical(errorReport);
  }
  
  async alertIfCritical(errorReport) {
    if (errorReport.severity === 'critical') {
      await this.sendAlert(errorReport);
    }
  }
}
```

### Analytics Dashboard

#### Key Metrics to Track
1. **User Engagement**: Active users, session duration
2. **Performance**: Response times, error rates
3. **AI Services**: Usage, response quality
4. **Business Metrics**: Conversion rates, user growth

### Reporting

#### Daily Reports
```javascript
// src/reports/daily.js
export class DailyReporter {
  async generateDailyReport() {
    return {
      date: new Date().toISOString(),
      summary: {
        activeUsers: await this.getActiveUsers(),
        responseTime: await this.getAverageResponseTime(),
        errorRate: await this.getErrorRate(),
        aiServiceUsage: await this.getAIServiceUsage()
      }
    };
  }
}
```

---

## 🎯 Best Practices

### Code Quality

#### 1. Write Clean, Readable Code
```javascript
// Good
function calculateUserScore(userActivities) {
  const baseScore = 100;
  const activityBonus = userActivities.length * 10;
  return baseScore + activityBonus;
}

// Bad
function calc(u) {
  return 100 + u.a.length * 10;
}
```

#### 2. Use Proper Error Handling
```javascript
// Good
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}

// Bad
const result = riskyOperation();
if (!result) {
  // No error handling
}
```

#### 3. Write Tests
```javascript
// Good
test('should calculate user score correctly', () => {
  const activities = [{}, {}, {}];
  const score = calculateUserScore(activities);
  expect(score).toBe(130);
});

// Bad
// No tests
```

### Performance

#### 1. Optimize Database Queries
```javascript
// Good - Use indexes and efficient queries
const user = await db.select('*').from('users').where('id', userId).first();

// Bad - N+1 queries
const users = await db.select('*').from('users');
users.forEach(user => {
  const posts = await db.select('*').from('posts').where('userId', user.id);
});
```

#### 2. Use Caching
```javascript
// Good - Cache frequently accessed data
const cachedData = await cache.get('popular_posts');
if (cachedData) return cachedData;

const posts = await db.select('*').from('posts').where('popular', true);
await cache.set('popular_posts', posts, 3600);
return posts;

// Bad - No caching
return await db.select('*').from('posts').where('popular', true);
```

### Security

#### 1. Validate User Input
```javascript
// Good - Validate and sanitize input
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase().trim();
}

// Bad - No validation
const userEmail = req.body.email; // Could be anything
```

#### 2. Use Environment Variables
```javascript
// Good - Use environment variables
const databaseUrl = process.env.DATABASE_URL;

// Bad - Hardcode values
const databaseUrl = 'postgres://user:pass@localhost:5432/db';
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. Deployment Issues
```bash
# Check Cloudflare login
wrangler whoami

# Check deployment status
wrangler deployments list

# Redeploy
wrangler deploy
```

#### 3. Test Failures
```bash
# Run specific test
npm run test:login

# Run with verbose output
npm run test:all -- --verbose

# Check test coverage
npm run test:coverage
```

### Debugging Techniques

#### 1. Use Console Logging
```javascript
// Good - Use meaningful log messages
console.log('Processing user:', userId);
console.log('API response:', response);

// Bad - Use debug logging
console.log('Debug info: ' + someVar);
```

#### 2. Use Breakpoints
```javascript
// Use debugger statements
function processData(data) {
  debugger; // Execution will stop here
  return processedData;
}
```

#### 3. Use Browser DevTools
- **Network Tab**: Check API calls
- **Console**: View logs and errors
- **Elements**: Inspect DOM
- **Performance**: Analyze performance

---

## 🎊 Next Steps

### For New Developers
1. **Read the codebase**: Understand the architecture
2. **Run the tests**: See how tests work
3. **Make a small change**: Submit a pull request
4. **Review code**: Learn from existing code
5. **Join discussions**: Participate in community

### For Experienced Developers
1. **Contribute advanced features**: AI services, physics engine
2. **Improve performance**: Optimize database queries, caching
3. **Add tests**: Increase test coverage
4. **Documentation**: Update and improve docs
5. **Mentor others**: Help new developers

### Community Resources
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Share ideas and get help
- **Documentation**: Complete guides and API reference
- **Code of Conduct**: Community guidelines

---

## 📞 Support

### Getting Help

1. **Documentation**: Check this guide and other docs
2. **Issues**: Search GitHub issues first
3. **Discussions**: Ask questions in discussions
4. **Community**: Join Discord or Slack

### Reporting Issues

When reporting issues, include:
- **Environment**: Node.js version, OS
- **Error Messages**: Complete error messages
- **Steps to Reproduce**: How to reproduce the issue
- **Expected vs Actual**: What should happen vs what happens

### Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

---

## 🎯 Congratulations!

You're now ready to contribute to the Cocapn platform! Remember:

- **Read the code** before making changes
- **Write tests** for new features
- **Follow standards** for code quality
- **Communicate** with the community
- **Have fun** building the future of education!

**Happy coding! 🚀**

---
*For more information, see our [Architecture Overview](ARCHITECTURE.md) and [API Reference](API_REFERENCE.md).*
