/**
 * Cocapn Hybrid IDE - Simple Worker
 * Basic deployment to test functionality
 */

// Simple in-memory authentication store
const users = {
  magnus: { password: 'tryme', role: 'beta_tester', name: 'Magnus' },
  casey: { password: 'fixme', role: 'developer', name: 'Casey' }
};

const sessionStore = new Map();

// Helper functions
function generateSessionId() {
  return crypto.randomUUID();
}

function validateLogin(username, password) {
  const user = users[username];
  if (!user) return false;

  // Simple password validation
  return user.password === password;
}

function createSession(user) {
  const sessionId = generateSessionId();
  const session = {
    id: sessionId,
    user: user,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
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

// Read HTML files
const loginHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cocapn Hybrid IDE - Login</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #3B82F6;
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        .logo p {
            color: #6B7280;
            margin: 5px 0 0 0;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #374151;
            font-weight: 500;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #3B82F6;
        }
        .login-button {
            width: 100%;
            padding: 12px;
            background: #3B82F6;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        .login-button:hover {
            background: #2563EB;
        }
        .error {
            color: #EF4444;
            font-size: 14px;
            margin-top: 10px;
            text-align: center;
        }
        .info {
            background: #F3F4F6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info p {
            margin: 5px 0;
            color: #6B7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>Cocapn</h1>
            <p>Beta Access</p>
        </div>

        <div class="info">
            <p><strong>Beta Testers</strong></p>
            <p>Username: magnus</p>
            <p>Password: tryme</p>
        </div>

        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="login-button">Sign In</button>
            <div id="error" class="error"></div>
        </form>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error');

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('cocapn_user', JSON.stringify(result.data.user));
                    localStorage.setItem('cocapn_session', result.data.session);
                    window.location.href = '/';
                } else {
                    errorDiv.textContent = 'Invalid username or password';
                }
            } catch (error) {
                errorDiv.textContent = 'Login failed. Please try again.';
            }
        });
    </script>
</body>
</html>`;

const mainHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cocapn Hybrid IDE</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #F9FAFB;
            color: #111827;
        }
        .header {
            background: white;
            padding: 16px 24px;
            border-bottom: 1px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .logo h1 {
            margin: 0;
            color: #3B82F6;
            font-size: 1.5em;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .user-name {
            font-weight: 500;
            color: #374151;
        }
        .logout-btn {
            padding: 8px 16px;
            background: #EF4444;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        }
        .logout-btn:hover {
            background: #DC2626;
        }
        .main-content {
            padding: 24px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .welcome-section {
            background: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 24px;
        }
        .welcome-section h2 {
            margin: 0 0 8px 0;
            color: #111827;
        }
        .welcome-section p {
            margin: 0;
            color: #6B7280;
            font-size: 18px;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
        }
        .dashboard-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .dashboard-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .dashboard-card h3 {
            margin: 0 0 12px 0;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .dashboard-card p {
            margin: 0 0 16px 0;
            color: #6B7280;
        }
        .dashboard-card .action-btn {
            padding: 8px 16px;
            background: #3B82F6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
        }
        .dashboard-card .action-btn:hover {
            background: #2563EB;
        }
        .icon {
            width: 24px;
            height: 24px;
            background: #E5E7EB;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">
            <div class="icon">🚀</div>
            <h1>Cocapn Hybrid IDE</h1>
        </div>
        <div class="user-info">
            <span class="user-name" id="userName">Magnus</span>
            <button class="logout-btn" onclick="logout()">Sign Out</button>
        </div>
    </header>

    <main class="main-content">
        <div class="welcome-section">
            <h2>Welcome to Cocapn Hybrid IDE</h2>
            <p>Experience the future of AI-powered development and learning.</p>
        </div>

        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><span class="icon">⚡</span> AI Simulation</h3>
                <p>Run physics and engineering simulations with advanced AI assistance.</p>
                <button class="action-btn" onclick="runSimulation()">Run Simulation</button>
            </div>

            <div class="dashboard-card">
                <h3><span class="icon">🎨</span> Design System</h3>
                <p>Generate professional UI components and design tokens.</p>
                <button class="action-btn" onclick="generateDesign()">Generate Design</button>
            </div>

            <div class="dashboard-card">
                <h3><span class="icon">🔧</span> Performance</h3>
                <p>Optimize your applications with advanced performance auditing.</p>
                <button class="action-btn" onclick="auditPerformance()">Run Audit</button>
            </div>

            <div class="dashboard-card">
                <h3><span class="icon">🔒</span> Security</h3>
                <p>Ensure enterprise-grade security and compliance.</p>
                <button class="action-btn" onclick="runSecurity()">Security Check</button>
            </div>

            <div class="dashboard-card">
                <h3><span class="icon">👥</span> Collaboration</h3>
                <p>Collaborate in real-time with your team.</p>
                <button class="action-btn" onclick="createSession()">Create Session</button>
            </div>

            <div class="dashboard-card">
                <h3><span class="icon">📊</span> Analytics</h3>
                <p>Track learning progress and gain insights.</p>
                <button class="action-btn" onclick="viewAnalytics()">View Analytics</button>
            </div>
        </div>
    </main>

    <script>
        // Check user authentication
        const userInfo = localStorage.getItem('cocapn_user');
        const sessionId = localStorage.getItem('cocapn_session');

        if (!userInfo || !sessionId) {
            window.location.href = '/login';
        } else {
            const user = JSON.parse(userInfo);
            document.getElementById('userName').textContent = user.name;
        }

        // Logout function
        function logout() {
            localStorage.removeItem('cocapn_user');
            localStorage.removeItem('cocapn_session');
            window.location.href = '/login';
        }

        // Dashboard actions
        function runSimulation() {
            alert('Simulation feature coming soon! This will run physics simulations with AI assistance.');
        }

        function generateDesign() {
            alert('Design system feature coming soon! This will generate professional UI components.');
        }

        function auditPerformance() {
            alert('Performance optimization feature coming soon! This will audit and optimize your applications.');
        }

        function runSecurity() {
            alert('Security audit feature coming soon! This will run enterprise security checks.');
        }

        function createSession() {
            alert('Collaboration feature coming soon! This will create real-time collaboration sessions.');
        }

        function viewAnalytics() {
            alert('Analytics feature coming soon! This will show learning progress and insights.');
        }
    </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle login page
    if (url.pathname === '/login') {
      return new Response(loginHTML, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // Handle authentication
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
              headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `sessionId=${session.id}; Path=/; HttpOnly; Secure; SameSite=Strict`
              }
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

    // Handle logout
    if (url.pathname === '/api/auth/logout') {
      const sessionId = request.headers.get('Cookie')?.split('sessionId=')[1];
      if (sessionId) {
        sessionStore.delete(sessionId);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'sessionId=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
        }
      });
    }

    // Handle main application
    if (url.pathname === '/') {
      const sessionId = request.headers.get('Cookie')?.split('sessionId=')[1];
      const session = validateSession(sessionId);

      if (!session) {
        return Response.redirect('/login', 302);
      }

      return new Response(mainHTML, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // Handle 404
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};