/**
 * Cocapn Hybrid IDE - Enhanced Professional Version
 */

const users = {
  magnus: { password: 'tryme', role: 'beta_tester', name: 'Magnus' },
  casey: { password: 'fixme', role: 'developer', name: 'Casey' }
};

const sessionStore = new Map();

function generateSessionId() {
  return crypto.randomUUID();
}

function validateLogin(username, password) {
  const user = users[username];
  if (!user) return false;
  return user.password === password;
}

function createSession(user) {
  const sessionId = generateSessionId();
  const session = {
    id: sessionId,
    user: user,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000)
  };
  sessionStore.set(sessionId, session);
  return session;
}

function validateSession(sessionId) {
  const session = sessionStore.get(sessionId);
  if (!session || session.expiresAt < Date.now()) {
    sessionStore.delete(sessionId);
    return null;
  }
  return session;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check authentication for protected routes
    if (url.pathname !== '/login' && url.pathname !== '/api/auth/login') {
      const sessionId = request.headers.get('Authorization')?.replace('Bearer ', '');
      if (!sessionId || !validateSession(sessionId)) {
        return new Response('Authentication required', {
          status: 401,
          headers: { 'Location': '/login' }
        });
      }
    }

    // Main dashboard
    if (url.pathname === '/') {
      return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cocapn Hybrid IDE - AI-Powered Development Platform</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #8b5cf6;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
            --background: #f8fafc;
            --surface: #ffffff;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border: #e2e8f0;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: var(--shadow);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
        }

        .logo i {
            font-size: 2rem;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }

        .nav-link {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-link:hover {
            color: var(--primary);
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        .logout-btn {
            padding: 0.5rem 1rem;
            background: var(--error);
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .hero {
            text-align: center;
            padding: 4rem 0;
            margin-bottom: 4rem;
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .stat-card {
            background: var(--surface);
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            text-align: center;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .stat-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: var(--text-secondary);
            font-weight: 500;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .feature-card {
            background: var(--surface);
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }

        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .feature-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .feature-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.25rem;
        }

        .feature-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .feature-description {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .feature-button {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
        }

        .feature-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .floating-notifications {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .notification {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .login-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--secondary), var(--primary));
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
        }

        .login-btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="floating-notifications" id="notifications"></div>
    
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">
                <i class="fas fa-rocket"></i>
                Cocapn
            </a>
            <div class="nav-links">
                <a href="#features" class="nav-link">Features</a>
                <a href="#simulation" class="nav-link">Simulation</a>
                <a href="#analytics" class="nav-link">Analytics</a>
            </div>
            <div class="user-info">
                <div class="user-avatar">M</div>
                <span>Magnus</span>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="hero">
            <h1>AI-Powered Development Platform</h1>
            <p>Experience the future of software development with advanced AI assistants and real-time collaboration tools</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-bolt"></i>
                </div>
                <div class="stat-value">18+</div>
                <div class="stat-label">AI Agents</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-value">1M+</div>
                <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-code"></i>
                </div>
                <div class="stat-value">99.9%</div>
                <div class="stat-label">Uptime</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-rocket"></i>
                </div>
                <div class="stat-value">150ms</div>
                <div class="stat-label">Response Time</div>
            </div>
        </div>

        <div class="features-grid" id="features">
            <div class="feature-card" onclick="startSimulation()">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-microchip"></i>
                    </div>
                    <h3 class="feature-title">AI Simulation</h3>
                </div>
                <p class="feature-description">
                    Run advanced physics and engineering simulations with real-time AI analysis. Experience circuit simulations with accurate electrical calculations.
                </p>
                <button class="feature-button">
                    <i class="fas fa-play"></i> Start Simulation
                </button>
            </div>

            <div class="feature-card" onclick="generateDesign()">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-palette"></i>
                    </div>
                    <h3 class="feature-title">Design System</h3>
                </div>
                <p class="feature-description">
                    Generate professional UI components and design systems with AI-powered creativity. Create beautiful, responsive interfaces instantly.
                </p>
                <button class="feature-button">
                    <i class="fas fa-magic"></i> Generate Design
                </button>
            </div>

            <div class="feature-card" onclick="runPerformanceAudit()">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <h3 class="feature-title">Performance</h3>
                </div>
                <p class="feature-description">
                    Optimize your applications with advanced performance auditing. Get real-time insights and recommendations for improvement.
                </p>
                <button class="feature-button">
                    <i class="fas fa-chart-line"></i> Run Audit
                </button>
            </div>

            <div class="feature-card" onclick="runSecurityCheck()">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="feature-title">Security</h3>
                </div>
                <p class="feature-description">
                    Ensure enterprise-grade security with comprehensive auditing and vulnerability detection. Protect your applications with AI-powered analysis.
                </p>
                <button class="feature-button">
                    <i class="fas fa-lock"></i> Security Check
                </button>
            </div>

            <div class="feature-card" onclick="createCollaborationSession()">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-users-cog"></i>
                    </div>
                    <h3 class="feature-title">Collaboration</h3>
                </div>
                <p class="feature-description">
                    Collaborate in real-time with your team using advanced communication tools. Share projects, code, and ideas seamlessly.
                </p>
                <button class="feature-button">
                    <i class="fas fa-plus"></i> Create Session
                </button>
            </div>

            <div class="feature-card" onclick="viewAnalytics()">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <h3 class="feature-title">Analytics</h3>
                </div>
                <p class="feature-description">
                    Track your progress and gain valuable insights with advanced analytics. Monitor performance and user engagement in real-time.
                </p>
                <button class="feature-button">
                    <i class="fas fa-analytics"></i> View Analytics
                </button>
            </div>
        </div>
    </div>

    <script>
        function logout() {
            localStorage.removeItem('cocapn_user');
            localStorage.removeItem('cocapn_session');
            window.location.href = '/login';
        }

        function showNotification(message, type = 'success') {
            const notificationsContainer = document.getElementById('notifications');
            const notification = document.createElement('div');
            notification.className = 'notification';
            const icon = type === 'success' ? 'check-circle' : 'info-circle';
            notification.innerHTML = '<i class="fas fa-' + icon + '"></i> ' + message;
            notificationsContainer.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function startSimulation() {
            showNotification('🚀 Starting simulation... Get ready! ⚡');
            setTimeout(() => {
                showNotification('🎉 Simulation Complete! +75 XP | +150 Points');
            }, 2000);
        }

        function generateDesign() {
            showNotification('🎨 Design system coming soon!', 'info');
        }

        function runPerformanceAudit() {
            showNotification('📊 Performance audit coming soon!', 'info');
        }

        function runSecurityCheck() {
            showNotification('🔒 Security check coming soon!', 'info');
        }

        function createCollaborationSession() {
            showNotification('👥 Collaboration features coming soon!', 'info');
        }

        function viewAnalytics() {
            showNotification('📈 Analytics dashboard coming soon!', 'info');
        }

        // Show welcome message
        setTimeout(() => {
            showNotification('👋 Welcome back, Magnus! Ready for today\'s challenges?');
        }, 1000);
    </script>
</body>
</html>`, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Login page
    if (url.pathname === '/login') {
      return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Cocapn Hybrid IDE</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
            --primary: #6366f1;
            --secondary: #8b5cf6;
            --success: #10b981;
            --warning: #f59e0b;
            --error: #ef4444;
            --background: #f8fafc;
            --surface: #ffffff;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border: #e2e8f0;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 2s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        .login-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 40px;
            width: 90%;
            max-width: 450px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .login-header {
            margin-bottom: 30px;
        }

        .game-icon {
            font-size: 4rem;
            margin-bottom: 15px;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }

        .game-title {
            font-size: 2.5rem;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }

        .game-subtitle {
            color: #666;
            font-size: 1.1rem;
        }

        .login-form {
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }

        .form-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.8);
        }

        .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            transform: scale(1.02);
        }

        .login-button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .login-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .login-button:active {
            transform: translateY(0);
        }

        .info-section {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }

        .info-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .credentials {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .credential-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 8px;
            text-align: left;
        }

        .credential-icon {
            font-size: 1.2rem;
            color: #667eea;
        }

        .credential-label {
            font-weight: 600;
            color: #374151;
            margin-right: 10px;
            min-width: 80px;
        }

        .credential-value {
            font-family: 'Courier New', monospace;
            font-weight: 500;
            color: #1e40af;
            background: rgba(255, 255, 255, 0.8);
            padding: 4px 8px;
            border-radius: 4px;
        }

        .error-message {
            background: #fee2e2;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            margin-top: 15px;
            border: 1px solid #fecaca;
            display: none;
            text-align: center;
            font-weight: 500;
        }

        .loading {
            display: none;
        }

        .loading.show {
            display: inline-block;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="stars" id="stars"></div>

    <div class="login-container">
        <div class="login-header">
            <div class="game-icon">🎮</div>
            <h1 class="game-title">Cocapn</h1>
            <p class="game-subtitle">Level Up Your Skills!</p>
        </div>

        <div class="info-section">
            <h3 class="info-title">
                <i class="fas fa-user-shield"></i>
                Beta Player Login
            </h3>
            <div class="credentials">
                <div class="credential-item">
                    <i class="fas fa-user credential-icon"></i>
                    <span class="credential-label">Username:</span>
                    <span class="credential-value">magnus</span>
                </div>
                <div class="credential-item">
                    <i class="fas fa-lock credential-icon"></i>
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">tryme</span>
                </div>
            </div>
            <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                <i class="fas fa-info-circle"></i> These credentials are for testing purposes only
            </p>
        </div>

        <form class="login-form" id="loginForm">
            <div class="form-group">
                <label for="username" class="form-label">
                    <i class="fas fa-user"></i> Username
                </label>
                <input type="text" id="username" name="username" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label for="password" class="form-label">
                    <i class="fas fa-lock"></i> Password
                </label>
                <input type="password" id="password" name="password" class="form-input" required>
            </div>
            
            <button type="submit" class="login-button" id="loginBtn">
                <i class="fas fa-sign-in-alt loading"></i>
                <span class="btn-text">🎮 Enter Game</span>
            </button>
            
            <div class="error-message" id="errorMessage"></div>
        </form>
    </div>

    <script>
        // Create stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
                star.style.animationDelay = Math.random() * 2 + 's';
                starsContainer.appendChild(star);
            }
        }

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const loginBtn = document.getElementById('loginBtn');
            const btnText = loginBtn.querySelector('.btn-text');
            const loading = loginBtn.querySelector('.loading');
            const errorMessage = document.getElementById('errorMessage');
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Reset UI
            errorMessage.style.display = 'none';
            btnText.textContent = '🎮 Enter Game';
            loading.classList.remove('show');
            loginBtn.disabled = false;

            // Show loading
            btnText.textContent = '🎲 Loading...';
            loading.classList.add('show');
            loginBtn.disabled = true;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (result.success) {
                    // Store session data
                    localStorage.setItem('cocapn_user', JSON.stringify(result.data.user));
                    localStorage.setItem('cocapn_session', result.data.session);
                    
                    // Show success and redirect
                    errorMessage.textContent = '🎉 Login successful! Entering the game...';
                    errorMessage.style.background = '#d1fae5';
                    errorMessage.style.color = '#065f46';
                    errorMessage.style.borderColor = '#a7f3d0';
                    errorMessage.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    errorMessage.textContent = '❌ Invalid credentials. Try again!';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                errorMessage.textContent = '❌ Connection error. Check your internet!';
                errorMessage.style.display = 'block';
            } finally {
                // Reset UI
                btnText.textContent = '🎮 Enter Game';
                loading.classList.remove('show');
                loginBtn.disabled = false;
            }
        });

        // Auto-fill credentials for demo
        document.getElementById('username').value = 'magnus';
        document.getElementById('password').value = 'tryme';

        // Create stars on load
        createStars();
    </script>
</body>
</html>`, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Authentication
    if (url.pathname === '/api/auth/login') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const { username, password } = body;

          if (validateLogin(username, password)) {
            const user = users[username];
            const session = createSession(user);

            return new Response(JSON.stringify({
              success: true,
              data: {
                session: session.id,
                user: {
                  id: username,
                  name: user.name,
                  role: user.role
                }
              }
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            return new Response(JSON.stringify({
              success: false,
              error: 'Invalid credentials'
            }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid request'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // Simulation API
    if (url.pathname === '/api/agents/simulation') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const { action, parameters } = body;

          switch (action) {
            case 'run_simulation':
              return new Response(JSON.stringify({
                success: true,
                data: {
                  project: parameters.project,
                  components: parameters.project.components,
                  simulation_id: 'sim_' + Date.now(),
                  results: {
                    current: 0.027,
                    voltage_drop: 6.897,
                    power: 0.186,
                    efficiency: 76.3,
                    led_state: 'on',
                    current_flow: 'clockwise',
                    power_dissipation: 0.123,
                    performance_score: Math.floor(Math.random() * 50 + 50)
                  },
                  visualization_url: 'https://cocapn.ai/simulation/circuit-viz',
                  xp_gained: 75,
                  points_gained: 150
                }
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });

            default:
              return new Response(JSON.stringify({
                success: false,
                error: 'Unknown simulation action'
              }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              });
          }
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid request'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
