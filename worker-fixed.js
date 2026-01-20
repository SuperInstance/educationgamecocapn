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

    // Modern main page
    if (url.pathname === '/') {
      return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cocapn Hybrid IDE - AI-Powered Development Platform</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        .subtitle {
            font-size: 1.5rem;
            color: #666;
            margin-bottom: 30px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .feature {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
        }
        .feature i {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .feature h3 {
            margin-bottom: 10px;
        }
        .get-started {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .get-started:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🤖 Cocapn</div>
        <h1 class="subtitle">AI-Powered IoT & Physics Game Platform</h1>
        
        <div class="features">
            <div class="feature">
                <i class="fas fa-rocket"></i>
                <h3>AI Simulation</h3>
                <p>Build incredible machines with AI-generated parts</p>
            </div>
            <div class="feature">
                <i class="fas fa-gamepad"></i>
                <h3>Gamified Learning</h3>
                <p>Learn physics through interactive gameplay</p>
            </div>
            <div class="feature">
                <i class="fas fa-cloud"></i>
                <h3>Cloudflare Powered</h3>
                <p>Fast, secure, and scalable platform</p>
            </div>
        </div>
        
        <button class="get-started" onclick="window.location.href='/login'">
            🚀 Get Started
        </button>
    </div>
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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        .login-form {
            margin-top: 30px;
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
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        .form-input:focus {
            outline: none;
            border-color: #667eea;
        }
        .login-button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .login-button:hover {
            transform: translateY(-2px);
        }
        .credentials {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .credential-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            font-family: monospace;
            font-weight: bold;
        }
        .credentials-title {
            font-weight: 600;
            margin-bottom: 15px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">🎮</div>
        <h1>Welcome to Cocapn</h1>
        <p style="color: #666; margin-bottom: 20px;">Level Up Your Skills!</p>
        
        <div class="credentials">
            <div class="credentials-title">Beta Player Login</div>
            <div class="credential-item">
                <i class="fas fa-user"></i>
                <span>Username: magnus</span>
            </div>
            <div class="credential-item">
                <i class="fas fa-lock"></i>
                <span>Password: tryme</span>
            </div>
        </div>
        
        <form class="login-form" id="loginForm">
            <div class="form-group">
                <label class="form-label" for="username">
                    <i class="fas fa-user"></i> Username
                </label>
                <input type="text" id="username" name="username" class="form-input" value="magnus" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="password">
                    <i class="fas fa-lock"></i> Password
                </label>
                <input type="password" id="password" name="password" class="form-input" value="tryme" required>
            </div>
            
            <button type="submit" class="login-button">
                <i class="fas fa-sign-in-alt"></i> Enter Game
            </button>
        </form>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

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
                    alert('🎉 Login successful! Welcome to Cocapn!');
                    window.location.href = '/';
                } else {
                    alert('❌ Invalid credentials. Try again!');
                }
            } catch (error) {
                alert('❌ Login failed. Please try again!');
            }
        });
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
