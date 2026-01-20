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
      return new Response(createMainPage(), {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Login page with enhanced design
    if (url.pathname === '/login') {
      return new Response(createLoginPage(), {
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
                    power_dissipation: 0.123
                  },
                  visualization_url: 'https://cocapn.ai/simulation/circuit-viz'
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

function createMainPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cocapn Hybrid IDE - AI-Powered Development Platform</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

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
            background: var(--background);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .gradient-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: -1;
            opacity: 0.05;
        }

        .navbar {
            background: var(--surface);
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
        }

        .feature-button {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .feature-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .simulation-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .simulation-content {
            background: var(--surface);
            padding: 2rem;
            border-radius: 1rem;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0.5rem;
            border-radius: 0.25rem;
            transition: all 0.3s ease;
        }

        .modal-close:hover {
            background: var(--border);
            color: var(--text-primary);
        }

        .circuit-diagram {
            background: var(--background);
            padding: 2rem;
            border-radius: 0.75rem;
            text-align: center;
            margin: 2rem 0;
            border: 2px dashed var(--border);
        }

        .circuit-flow {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin: 1rem 0;
        }

        .component {
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }

        .battery {
            background: #fef3c7;
            color: #92400e;
        }

        .resistor {
            background: #ddd6fe;
            color: #5b21b6;
        }

        .led {
            background: #fecaca;
            color: #991b1b;
        }

        .arrow {
            font-size: 1.5rem;
            color: var(--text-secondary);
        }

        .simulation-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
        }

        .control-btn {
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .start-btn {
            background: var(--success);
            color: white;
        }

        .start-btn:hover {
            background: #059669;
            transform: translateY(-2px);
        }

        .stop-btn {
            background: var(--error);
            color: white;
        }

        .stop-btn:hover {
            background: #dc2626;
            transform: translateY(-2px);
        }

        .results-panel {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 2rem;
            border-radius: 0.75rem;
            margin: 2rem 0;
            border-left: 4px solid var(--primary);
        }

        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }

        .result-item {
            background: var(--surface);
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
        }

        .result-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }

        .result-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-left: 0.5rem;
        }

        .status-on {
            background: var(--success);
            box-shadow: 0 0 10px var(--success);
        }

        .status-off {
            background: var(--error);
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hero h1 {
                font-size: 2.5rem;
            }

            .hero p {
                font-size: 1.1rem;
            }

            .container {
                padding: 1rem;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }

            .circuit-flow {
                flex-direction: column;
                gap: 0.5rem;
            }

            .arrow {
                transform: rotate(90deg);
            }
        }
    </style>
</head>
<body>
    <div class="gradient-bg"></div>

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
            <div class="feature-card">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-microchip"></i>
                    </div>
                    <h3 class="feature-title">AI Simulation</h3>
                </div>
                <p class="feature-description">
                    Run advanced physics and engineering simulations with real-time AI analysis. Experience circuit simulations with accurate electrical calculations.
                </p>
                <button class="feature-button" onclick="openSimulation()">
                    <i class="fas fa-play"></i> Start Simulation
                </button>
            </div>

            <div class="feature-card">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-palette"></i>
                    </div>
                    <h3 class="feature-title">Design System</h3>
                </div>
                <p class="feature-description">
                    Generate professional UI components and design systems with AI-powered creativity. Create beautiful, responsive interfaces instantly.
                </p>
                <button class="feature-button" onclick="generateDesign()">
                    <i class="fas fa-magic"></i> Generate Design
                </button>
            </div>

            <div class="feature-card">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <h3 class="feature-title">Performance</h3>
                </div>
                <p class="feature-description">
                    Optimize your applications with advanced performance auditing. Get real-time insights and recommendations for improvement.
                </p>
                <button class="feature-button" onclick="runPerformanceAudit()">
                    <i class="fas fa-chart-line"></i> Run Audit
                </button>
            </div>

            <div class="feature-card">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="feature-title">Security</h3>
                </div>
                <p class="feature-description">
                    Ensure enterprise-grade security with comprehensive auditing and vulnerability detection. Protect your applications with AI-powered analysis.
                </p>
                <button class="feature-button" onclick="runSecurityCheck()">
                    <i class="fas fa-lock"></i> Security Check
                </button>
            </div>

            <div class="feature-card">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-users-cog"></i>
                    </div>
                    <h3 class="feature-title">Collaboration</h3>
                </div>
                <p class="feature-description">
                    Collaborate in real-time with your team using advanced communication tools. Share projects, code, and ideas seamlessly.
                </p>
                <button class="feature-button" onclick="createCollaborationSession()">
                    <i class="fas fa-plus"></i> Create Session
                </button>
            </div>

            <div class="feature-card">
                <div class="feature-header">
                    <div class="feature-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <h3 class="feature-title">Analytics</h3>
                </div>
                <p class="feature-description">
                    Track your progress and gain valuable insights with advanced analytics. Monitor performance and user engagement in real-time.
                </p>
                <button class="feature-button" onclick="viewAnalytics()">
                    <i class="fas fa-analytics"></i> View Analytics
                </button>
            </div>
        </div>
    </div>

    <!-- Simulation Modal -->
    <div class="simulation-modal" id="simulationModal">
        <div class="simulation-content">
            <button class="modal-close" onclick="closeSimulation()">
                <i class="fas fa-times"></i>
            </button>
            
            <h2 style="margin-bottom: 1rem; color: var(--text-primary);">
                <i class="fas fa-microchip"></i> AI Circuit Simulation
            </h2>
            
            <div class="circuit-diagram">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Circuit Configuration</h3>
                <div class="circuit-flow">
                    <div class="component battery">
                        <i class="fas fa-battery-full"></i> 9V Battery
                    </div>
                    <span class="arrow">→</span>
                    <div class="component resistor">
                        <i class="fas fa-minus"></i> 330Ω Resistor
                    </div>
                    <span class="arrow">→</span>
                    <div class="component led">
                        <i class="fas fa-lightbulb"></i> LED
                    </div>
                    <span class="arrow">→</span>
                    <div class="component" style="background: #6b7280; color: white;">
                        <i class="fas fa-ground"></i> Ground
                    </div>
                </div>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    Current: 27mA | Power: 186mW | Efficiency: 76.3%
                </p>
            </div>

            <div class="simulation-controls">
                <button class="control-btn start-btn" onclick="startSimulation()">
                    <i class="fas fa-play"></i> Start Simulation
                </button>
                <button class="control-btn stop-btn" onclick="stopSimulation()">
                    <i class="fas fa-stop"></i> Stop Simulation
                </button>
            </div>

            <div class="results-panel" id="resultsPanel" style="display: none;">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">
                    <i class="fas fa-chart-line"></i> Real-time Results
                </h3>
                <div class="results-grid" id="resultsGrid">
                    <!-- Results will be populated by JavaScript -->
                </div>
            </div>
        </div>
    </div>

    <script>
        // Check user authentication
        const userInfo = localStorage.getItem('cocapn_user');
        const sessionId = localStorage.getItem('cocapn_session');

        if (!userInfo || !sessionId) {
            window.location.href = '/login';
        }

        function logout() {
            localStorage.removeItem('cocapn_user');
            localStorage.removeItem('cocapn_session');
            window.location.href = '/login';
        }

        let simulationInterval = null;
        let isSimulating = false;

        function openSimulation() {
            document.getElementById('simulationModal').style.display = 'flex';
        }

        function closeSimulation() {
            document.getElementById('simulationModal').style.display = 'none';
            stopSimulation();
        }

        async function startSimulation() {
            try {
                const response = await fetch('/api/agents/simulation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('cocapn_session')
                    },
                    body: JSON.stringify({
                        action: 'run_simulation',
                        parameters: {
                            project: {
                                type: 'circuit_simulation',
                                components: ['battery', 'resistor', 'led']
                            }
                        }
                    })
                });

                const result = await response.json();

                if (result.success) {
                    document.getElementById('resultsPanel').style.display = 'block';
                    updateResults(result.data);
                    startRealTimeUpdates();
                    
                    // Show success notification
                    showNotification('Simulation started successfully!', 'success');
                } else {
                    showNotification('Simulation failed: ' + result.error, 'error');
                }
            } catch (error) {
                showNotification('Simulation error: ' + error.message, 'error');
            }
        }

        function stopSimulation() {
            isSimulating = false;
            if (simulationInterval) {
                clearInterval(simulationInterval);
                simulationInterval = null;
            }
            showNotification('Simulation stopped', 'info');
        }

        function updateResults(data) {
            const resultsGrid = document.getElementById('resultsGrid');
            resultsGrid.innerHTML = 
                '<div class="result-item">' +
                '<div class="result-value">' + data.results.current.toFixed(3) + 'A</div>' +
                '<div class="result-label">Current</div>' +
                '</div>' +
                '<div class="result-item">' +
                '<div class="result-value">' + data.results.voltage_drop.toFixed(2) + 'V</div>' +
                '<div class="result-label">Voltage Drop</div>' +
                '</div>' +
                '<div class="result-item">' +
                '<div class="result-value">' + data.results.power.toFixed(3) + 'W</div>' +
                '<div class="result-label">Power</div>' +
                '</div>' +
                '<div class="result-item">' +
                '<div class="result-value">' + data.results.efficiency.toFixed(1) + '%</div>' +
                '<div class="result-label">Efficiency</div>' +
                '</div>' +
                '<div class="result-item">' +
                '<div class="result-value">' + data.results.led_state.toUpperCase() + 
                '<span class="status-indicator status-' + data.results.led_state + '"></span>' +
                '</div>' +
                '<div class="result-label">LED State</div>' +
                '</div>' +
                '<div class="result-item">' +
                '<div class="result-value">' + data.results.power_dissipation.toFixed(3) + 'W</div>' +
                '<div class="result-label">Power Dissipation</div>' +
                '</div>';
        }

        function startRealTimeUpdates() {
            if (simulationInterval) clearInterval(simulationInterval);
            
            isSimulating = true;
            simulationInterval = setInterval(() => {
                updateRealTimeData();
            }, 1000);
        }

        function updateRealTimeData() {
            const baseCurrent = 0.027;
            const baseVoltage = 6.897;
            const basePower = 0.186;
            const baseEfficiency = 76.3;

            const variation = (Math.random() - 0.5) * 0.002;
            const current = (baseCurrent + variation).toFixed(3);
            const voltage = (baseVoltage + variation * 10).toFixed(2);
            const power = (basePower + variation * 10).toFixed(3);
            const efficiency = (baseEfficiency + variation * 100).toFixed(1);

            // Update the first four result items
            const resultItems = document.querySelectorAll('.result-item');
            if (resultItems.length >= 6) {
                resultItems[0].querySelector('.result-value').textContent = current + 'A';
                resultItems[1].querySelector('.result-value').textContent = voltage + 'V';
                resultItems[2].querySelector('.result-value').textContent = power + 'W';
                resultItems[3].querySelector('.result-value').textContent = efficiency + '%';

                // Update LED state
                const ledState = parseFloat(current) > 0.020 ? 'ON' : 'OFF';
                resultItems[4].querySelector('.result-value').innerHTML = ledState + 
                    '<span class="status-indicator status-' + (ledState.toLowerCase()) + '"></span>';
                
                // Update power dissipation
                resultItems[5].querySelector('.result-value').textContent = (parseFloat(power) * 0.66).toFixed(3) + 'W';
            }
        }

        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = 
                'position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem; border-radius: 0.5rem; color: white; font-weight: 500; z-index: 1001; animation: slideIn 0.3s ease;';
            
            switch(type) {
                case 'success':
                    notification.style.background = 'var(--success)';
                    break;
                case 'error':
                    notification.style.background = 'var(--error)';
                    break;
                default:
                    notification.style.background = 'var(--primary)';
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Feature functions
        function generateDesign() {
            showNotification('Design system coming soon!', 'info');
        }

        function runPerformanceAudit() {
            showNotification('Performance audit coming soon!', 'info');
        }

        function runSecurityCheck() {
            showNotification('Security check coming soon!', 'info');
        }

        function createCollaborationSession() {
            showNotification('Collaboration features coming soon!', 'info');
        }

        function viewAnalytics() {
            showNotification('Analytics dashboard coming soon!', 'info');
        }

        // Close modal when clicking outside
        document.getElementById('simulationModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeSimulation();
            }
        });
    </script>

    <style>
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    </style>
</body>
</html>`;
}

function createLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Cocapn Hybrid IDE</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .background-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
        }

        .shape1 {
            width: 300px;
            height: 300px;
            top: -150px;
            right: -150px;
            animation: float 6s ease-in-out infinite;
        }

        .shape2 {
            width: 200px;
            height: 200px;
            bottom: -100px;
            left: -100px;
            animation: float 8s ease-in-out infinite reverse;
        }

        .shape3 {
            width: 150px;
            height: 150px;
            top: 50%;
            left: 10%;
            animation: float 7s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        .login-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 3rem;
            border-radius: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            width: 90%;
            max-width: 450px;
            position: relative;
            overflow: hidden;
        }

        .login-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
        }

        .logo-section {
            text-align: center;
            margin-bottom: 2.5rem;
        }

        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .logo-text {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .tagline {
            color: #6b7280;
            font-size: 1rem;
        }

        .info-section {
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            border: 1px solid #e2e8f0;
        }

        .info-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .credentials {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .credential-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
            background: white;
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
        }

        .credential-icon {
            width: 20px;
            color: #6366f1;
        }

        .credential-text {
            font-family: 'Courier New', monospace;
            font-weight: 500;
            color: #374151;
        }

        .form-section h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
        }

        .form-input {
            width: 100%;
            padding: 0.875rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 0.75rem;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
        }

        .form-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .login-button {
            width: 100%;
            padding: 0.875rem;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: none;
            border-radius: 0.75rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .login-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }

        .login-button:active {
            transform: translateY(0);
        }

        .error-message {
            background: #fef2f2;
            color: #dc2626;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid #fecaca;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
            display: none;
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

        @media (max-width: 768px) {
            .login-container {
                margin: 1rem;
                padding: 2rem;
            }
            
            .logo-text {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="background-shapes">
        <div class="shape shape1"></div>
        <div class="shape shape2"></div>
        <div class="shape shape3"></div>
    </div>

    <div class="login-container">
        <div class="logo-section">
            <div class="logo">
                <i class="fas fa-rocket"></i>
            </div>
            <h1 class="logo-text">Cocapn</h1>
            <p class="tagline">AI-Powered Development Platform</p>
        </div>

        <div class="info-section">
            <h3 class="info-title">
                <i class="fas fa-info-circle"></i>
                Beta Access Credentials
            </h3>
            <div class="credentials">
                <div class="credential-item">
                    <i class="fas fa-user credential-icon"></i>
                    <span class="credential-text">Username: magnus</span>
                </div>
                <div class="credential-item">
                    <i class="fas fa-lock credential-icon"></i>
                    <span class="credential-text">Password: tryme</span>
                </div>
            </div>
        </div>

        <form class="form-section" id="loginForm">
            <h2>Welcome Back</h2>
            
            <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input type="text" id="username" name="username" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" name="password" class="form-input" required>
            </div>
            
            <button type="submit" class="login-button" id="loginBtn">
                <i class="fas fa-sign-in-alt loading"></i>
                <span class="btn-text">Sign In</span>
            </button>
            
            <div class="error-message" id="errorMessage"></div>
        </form>
    </div>

    <script>
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
            btnText.style.display = 'none';
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
                    errorMessage.textContent = 'Login successful! Redirecting...';
                    errorMessage.style.background = '#d1fae5';
                    errorMessage.style.color = '#065f46';
                    errorMessage.style.borderColor = '#a7f3d0';
                    errorMessage.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    errorMessage.textContent = 'Invalid username or password';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                errorMessage.textContent = 'Login failed. Please check your connection.';
                errorMessage.style.display = 'block';
            } finally {
                // Reset UI
                btnText.style.display = 'inline';
                loading.classList.remove('show');
                loginBtn.disabled = false;
            }
        });

        // Auto-fill credentials for demo
        document.getElementById('username').value = 'magnus';
        document.getElementById('password').value = 'tryme';
    </script>
</body>
</html>`;
}
