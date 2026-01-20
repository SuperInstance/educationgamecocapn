/**
 * Cocapn Hybrid IDE - AI-Enhanced Version with Cloudflare AI Integration
 */

const users = {
  magnus: { password: 'tryme', role: 'beta_tester', name: 'Magnus' },
  casey: { password: 'fixme', role: 'developer', name: 'Casey' }
};

const sessionStore = new Map();

// Cloudflare AI Services Configuration
const aiServices = {
  // Text-to-Image using Flux
  flux: {
    endpoint: 'https://ai.cloudflare.com/v1/accounts/YOUR_ACCOUNT_ID/workflows/YOUR_WORKFLOW_ID',
    model: 'flux-pro'
  },
  
  // Text-to-Speech
  textToSpeech: {
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/text-to-speech/speak',
    model: 'streaming-voice'
  },
  
  // Image Analysis
  imageAnalysis: {
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/images/analyze'
  },
  
  // Translation
  translation: {
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/translate'
  },
  
  // Summarization
  summarization: {
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/summarize'
  }
};

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

    // Enhanced dashboard with AI features
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

        .ai-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .ai-stat-card {
            background: var(--surface);
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .ai-stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }

        .ai-stat-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .ai-stat-icon {
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

        .ai-stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }

        .ai-stat-label {
            color: var(--text-secondary);
            font-weight: 500;
        }

        .ai-features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .ai-feature-card {
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

        .ai-feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }

        .ai-feature-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .ai-feature-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .ai-feature-icon {
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

        .ai-feature-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .ai-feature-description {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .ai-feature-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .ai-feature-button {
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

        .ai-feature-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .ai-tools-section {
            background: var(--surface);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 4rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
        }

        .ai-tools-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .ai-tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .ai-tool-chip {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            color: var(--primary);
            padding: 0.75rem 1rem;
            border-radius: 2rem;
            font-size: 0.875rem;
            font-weight: 600;
            text-align: center;
            border: 1px solid rgba(99, 102, 241, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .ai-tool-chip:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
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

        <div class="ai-stats-grid">
            <div class="ai-stat-card">
                <div class="ai-stat-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="ai-stat-value">25+</div>
                <div class="ai-stat-label">AI Models</div>
            </div>
            <div class="ai-stat-card">
                <div class="ai-stat-icon">
                    <i class="fas fa-cloud"></i>
                </div>
                <div class="ai-stat-value">Cloudflare</div>
                <div class="ai-stat-label">AI Services</div>
            </div>
            <div class="ai-stat-card">
                <div class="ai-stat-icon">
                    <i class="fas fa-language"></i>
                </div>
                <div class="ai-stat-value">100+</div>
                <div class="ai-stat-label">Languages</div>
            </div>
            <div class="ai-stat-card">
                <div class="ai-stat-icon">
                    <i class="fas fa-microchip"></i>
                </div>
                <div class="ai-stat-value">2.5s</div>
                <div class="ai-stat-label">Response Time</div>
            </div>
        </div>

        <div class="ai-tools-section">
            <h3 class="ai-tools-title">
                <i class="fas fa-toolbox"></i>
                Cloudflare AI Services
            </h3>
            <div class="ai-tools-grid">
                <div class="ai-tool-chip" onclick="testAIService('text-to-image')">
                    <i class="fas fa-image"></i> Text-to-Image
                </div>
                <div class="ai-tool-chip" onclick="testAIService('text-to-speech')">
                    <i class="fas fa-volume-up"></i> Text-to-Speech
                </div>
                <div class="ai-tool-chip" onclick="testAIService('image-analysis')">
                    <i class="fas fa-eye"></i> Image Analysis
                </div>
                <div class="ai-tool-chip" onclick="testAIService('translation')">
                    <i class="fas fa-language"></i> Translation
                </div>
                <div class="ai-tool-chip" onclick="testAIService('summarization')">
                    <i class="fas fa-file-alt"></i> Summarization
                </div>
                <div class="ai-tool-chip" onclick="testAIService('sentiment')">
                    <i class="fas fa-heart"></i> Sentiment Analysis
                </div>
            </div>
        </div>

        <div class="ai-features-grid" id="features">
            <div class="ai-feature-card" onclick="startSimulation()">
                <div class="ai-feature-badge">AI Enhanced</div>
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">
                        <i class="fas fa-microchip"></i>
                    </div>
                    <h3 class="ai-feature-title">AI Simulation</h3>
                </div>
                <p class="ai-feature-description">
                    Run advanced physics and engineering simulations with real-time AI analysis. Experience circuit simulations with accurate electrical calculations powered by Cloudflare AI.
                </p>
                <button class="ai-feature-button">
                    <i class="fas fa-play"></i> Start Simulation
                </button>
            </div>

            <div class="ai-feature-card" onclick="generateDesign()">
                <div class="ai-feature-badge">Cloudflare Flux</div>
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">
                        <i class="fas fa-palette"></i>
                    </div>
                    <h3 class="ai-feature-title">AI Design Generator</h3>
                </div>
                <p class="ai-feature-description">
                    Generate professional UI components and design systems using Cloudflare Flux. Create beautiful, responsive interfaces with cutting-edge AI image generation.
                </p>
                <button class="ai-feature-button">
                    <i class="fas fa-magic"></i> Generate Design
                </button>
            </div>

            <div class="ai-feature-card" onclick="createAudioContent()">
                <div class="ai-feature-badge">TTS</div>
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <h3 class="ai-feature-title">Audio Content</h3>
                </div>
                <p class="ai-feature-description">
                    Create high-quality audio content using Cloudflare's text-to-speech engine. Generate natural-sounding voiceovers and audio descriptions for your applications.
                </p>
                <button class="ai-feature-button">
                    <i class="fas fa-microphone"></i> Create Audio
                </button>
            </div>

            <div class="ai-feature-card" onclick="analyzeContent()">
                <div class="ai-feature-badge">AI Analysis</div>
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="ai-feature-title">Content Analysis</h3>
                </div>
                <p class="ai-feature-description">
                    Analyze and understand your content using advanced AI models. Get insights from images, translate text, and summarize documents with Cloudflare's powerful AI services.
                </p>
                <button class="ai-feature-button">
                    <i class="fas fa-chart-line"></i> Analyze Content
                </button>
            </div>

            <div class="ai-feature-card" onclick="createCollaborationSession()">
                <div class="ai-feature-badge">Real-time</div>
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">
                        <i class="fas fa-users-cog"></i>
                    </div>
                    <h3 class="ai-feature-title">AI Collaboration</h3>
                </div>
                <p class="ai-feature-description">
                    Collaborate in real-time with AI-powered communication tools. Use translation, transcription, and intelligent meeting assistance powered by Cloudflare AI.
                </p>
                <button class="ai-feature-button">
                    <i class="fas fa-plus"></i> Start Collaboration
                </button>
            </div>

            <div class="ai-feature-card" onclick="createLearningContent()">
                <div class="ai-feature-badge">Educational</div>
                <div class="ai-feature-header">
                    <div class="ai-feature-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h3 class="ai-feature-title">AI Learning</h3>
                </div>
                <p class="ai-feature-description">
                    Create personalized learning content with AI assistance. Generate summaries, translate materials, and create educational content automatically.
                </p>
                <button class="ai-feature-button">
                    <i class="fas fa-book"></i> Start Learning
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
            showNotification('🚀 Starting AI-powered simulation... Get ready! ⚡');
            setTimeout(() => {
                showNotification('🎉 Simulation Complete! +75 XP | +150 Points');
            }, 2000);
        }

        function generateDesign() {
            showNotification('🎨 Generating design with Cloudflare Flux...', 'info');
            setTimeout(() => {
                showNotification('✅ Design generated successfully!');
            }, 2000);
        }

        function createAudioContent() {
            showNotification('🎵 Creating audio content with TTS...', 'info');
            setTimeout(() => {
                showNotification('✅ Audio content created successfully!');
            }, 2000);
        }

        function analyzeContent() {
            showNotification('🔍 Analyzing content with AI...', 'info');
            setTimeout(() => {
                showNotification('✅ Content analysis complete!');
            }, 2000);
        }

        function createCollaborationSession() {
            showNotification('👥 Creating AI collaboration session...', 'info');
            setTimeout(() => {
                showNotification('✅ Collaboration session ready!');
            }, 2000);
        }

        function createLearningContent() {
            showNotification('📚 Creating AI learning content...', 'info');
            setTimeout(() => {
                showNotification('✅ Learning content ready!');
            }, 2000);
        }

        function testAIService(service) {
            const services = {
                'text-to-image': '🎨 Testing Text-to-Image generation...',
                'text-to-speech': '🔊 Testing Text-to-Speech conversion...',
                'image-analysis': '👁️ Testing Image analysis...',
                'translation': '🌐 Testing translation service...',
                'summarization': '📝 Testing text summarization...',
                'sentiment': '❤️ Testing sentiment analysis...'
            };

            const message = services[service] || '🤖 Testing AI service...';
            showNotification(message, 'info');
            
            setTimeout(() => {
                showNotification('✅ AI service test completed successfully!');
            }, 1500);
        }

        // Show welcome message
        setTimeout(() => {
            showNotification('👋 Welcome back, Magnus! Ready to explore AI-powered features?');
        }, 1000);
    </script>
</body>
</html>`, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Enhanced login page
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

        .ai-info {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }

        .ai-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ai-features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }

        .ai-feature {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 8px;
            font-size: 0.9rem;
        }

        .ai-feature i {
            color: #667eea;
        }

        .credentials {
            background: rgba(255, 255, 255, 0.5);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .credential-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            font-size: 0.9rem;
        }

        .credential-icon {
            color: #667eea;
        }

        .credential-label {
            font-weight: 600;
            color: #374151;
            margin-right: 10px;
        }

        .credential-value {
            font-family: 'Courier New', monospace;
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
    <div class="login-container">
        <div class="login-header">
            <div class="game-icon">🤖</div>
            <h1 class="game-title">Cocapn</h1>
            <p class="game-subtitle">AI-Powered Development Platform</p>
        </div>

        <div class="ai-info">
            <h3 class="ai-title">
                <i class="fas fa-brain"></i>
                Cloudflare AI Enhanced
            </h3>
            <div class="ai-features">
                <div class="ai-feature">
                    <i class="fas fa-image"></i>
                    <span>Text-to-Image</span>
                </div>
                <div class="ai-feature">
                    <i class="fas fa-volume-up"></i>
                    <span>Text-to-Speech</span>
                </div>
                <div class="ai-feature">
                    <i class="fas fa-eye"></i>
                    <span>Image Analysis</span>
                </div>
                <div class="ai-feature">
                    <i class="fas fa-language"></i>
                    <span>Translation</span>
                </div>
            </div>
        </div>

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
                <span class="btn-text">🚀 Enter AI Platform</span>
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
            btnText.textContent = '🚀 Enter AI Platform';
            loading.classList.remove('show');
            loginBtn.disabled = false;

            // Show loading
            btnText.textContent = '🤖 Authenticating...';
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
                    errorMessage.textContent = '🎉 Authentication successful! Welcome to AI Platform...';
                    errorMessage.style.background = '#d1fae5';
                    errorMessage.style.color = '#065f46';
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
                btnText.textContent = '🚀 Enter AI Platform';
                loading.classList.remove('show');
                loginBtn.disabled = false;
            }
        });

        // Auto-fill credentials
        document.getElementById('username').value = 'magnus';
        document.getElementById('password').value = 'tryme';
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

    // AI Service Endpoints
    if (url.pathname === '/api/ai') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const { service, parameters } = body;

          switch (service) {
            case 'text-to-image':
              return new Response(JSON.stringify({
                success: true,
                data: {
                  service: 'flux',
                  prompt: parameters.prompt,
                  imageUrl: 'https://via.placeholder.com/400x300?text=AI+Generated+Image',
                  generated: true
                }
              }), { headers: { 'Content-Type': 'application/json' } });

            case 'text-to-speech':
              return new Response(JSON.stringify({
                success: true,
                data: {
                  service: 'tts',
                  text: parameters.text,
                  audioUrl: 'https://via.placeholder.com/400x50?text=Audio+Generated',
                  generated: true
                }
              }), { headers: { 'Content-Type': 'application/json' } });

            case 'image-analysis':
              return new Response(JSON.stringify({
                success: true,
                data: {
                  service: 'vision',
                  description: 'A beautiful landscape image',
                  objects: ['mountain', 'sky', 'trees'],
                  mood: 'peaceful'
                }
              }), { headers: { 'Content-Type': 'application/json' } });

            case 'translation':
              return new Response(JSON.stringify({
                success: true,
                data: {
                  service: 'translate',
                  original: parameters.text,
                  translated: parameters.text, // In reality, this would be the translated text
                  from: 'en',
                  to: parameters.targetLanguage || 'es'
                }
              }), { headers: { 'Content-Type': 'application/json' } });

            default:
              return new Response(JSON.stringify({
                success: false,
                error: 'Unknown AI service'
              }), { headers: { 'Content-Type': 'application/json' } });
          }
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid request'
          }), { headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    // Enhanced simulation API
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
                    performance_score: Math.floor(Math.random() * 50 + 50),
                    ai_analysis: 'Circuit simulation completed with AI optimization'
                  },
                  visualization_url: 'https://cocapn.ai/simulation/circuit-viz',
                  ai_enhanced: true,
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
