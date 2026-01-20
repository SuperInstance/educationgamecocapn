/**
 * Cocapn Hybrid IDE - FULLY GAMIFIED VERSION
 * Gaming platform with levels, achievements, and challenges
 */

const users = {
  magnus: { password: 'tryme', role: 'beta_tester', name: 'Magnus' },
  casey: { password: 'fixme', role: 'developer', name: 'Casey' }
};

const sessionStore = new Map();

// Game state system
const gameState = {
  magnus: {
    level: 5,
    xp: 1250,
    points: 8500,
    achievements: ['first_simulation', 'circuit_master', 'speed_demon', 'perfectionist'],
    streak: 3,
    challengesCompleted: 12,
    lastLogin: Date.now(),
    totalSimulations: 47,
    accuracy: 94.2,
    badges: ['🔥', '⚡', '🎯', '💎'],
    inventory: ['circuit_pro', 'simulation_boost', 'precision_chip'],
    currentQuest: 'defeat_the_circuit_dragon'
  }
};

const achievements = {
  first_simulation: { name: "First Steps", description: "Complete your first simulation", icon: "🎯", points: 100, xp: 50 },
  circuit_master: { name: "Circuit Master", description: "Complete 10 simulations", icon: "⚡", points: 500, xp: 250 },
  speed_demon: { name: "Speed Demon", description: "Complete simulation in under 30 seconds", icon: "🚀", points: 300, xp: 150 },
  perfectionist: { name: "Perfectionist", description: "Achieve 100% accuracy", icon: "💎", points: 1000, xp: 500 },
  dragon_slayer: { name: "Dragon Slayer", description: "Defeat the Circuit Dragon", icon: "🐉", points: 2000, xp: 1000 },
  xp_collector: { name: "XP Collector", description: "Reach Level 10", icon: "📈", points: 1500, xp: 750 },
  point_master: { name: "Point Master", description: "Earn 10,000 points", icon: "💰", points: 2000, xp: 1000 }
};

const challenges = [
  { id: 'daily_circuit', name: "Daily Circuit Challenge", description: "Complete 3 simulations today", xp: 200, points: 300, type: 'daily' },
  { id: 'speed_run', name: "Speed Run", description: "Complete simulation in 15 seconds", xp: 150, points: 200, type: 'timed' },
  { id: 'accuracy_master', name: "Accuracy Master", description: "Achieve 95%+ accuracy", xp: 250, points: 400, type: 'skill' },
  { id: 'streak_keeper', name: "Streak Keeper", description: "Maintain 7-day login streak", xp: 300, points: 500, type: 'streak' }
];

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

function calculateLevel(xp) {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2500) return 6;
  if (xp < 4000) return 7;
  if (xp < 6000) return 8;
  if (xp < 8500) return 9;
  return 10;
}

function getXpForLevel(level) {
  if (level <= 1) return 0;
  if (level <= 2) return 100;
  if (level <= 3) return 300;
  if (level <= 4) return 600;
  if (level <= 5) return 1000;
  if (level <= 6) return 1500;
  if (level <= 7) return 2500;
  if (level <= 8) return 4000;
  if (level <= 9) return 6000;
  return 8500;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Main gamified dashboard
    if (url.pathname === '/') {
      return new Response(createGamifiedDashboard(), {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Login page with gamified elements
    if (url.pathname === '/login') {
      return new Response(createGamifiedLogin(), {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Game API endpoints
    if (url.pathname === '/api/game/user') {
      return new Response(JSON.stringify(gameState.magnus), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/game/achievements') {
      return new Response(JSON.stringify(achievements), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/game/challenges') {
      return new Response(JSON.stringify(challenges), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
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

    // Gamified simulation API
    if (url.pathname === '/api/agents/simulation') {
      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const { action, parameters } = body;

          switch (action) {
            case 'run_simulation':
              // Calculate simulation performance
              const startTime = Date.now();
              const simulationTime = Math.random() * 20000 + 5000; // 5-25 seconds
              
              setTimeout(() => {
                const endTime = Date.now();
                const totalTime = endTime - startTime;
                
                // Award XP and points based on performance
                let xpGained = 50;
                let pointsGained = 100;
                
                if (totalTime < 10000) {
                  xpGained += 100; // Speed bonus
                  pointsGained += 200;
                }
                
                if (Math.random() > 0.1) { // 90% success rate
                  xpGained += 25;
                  pointsGained += 50;
                }
                
                // Update game state
                gameState.magnus.xp += xpGained;
                gameState.magnus.points += pointsGained;
                gameState.magnus.totalSimulations++;
                
                // Check for level up
                const newLevel = calculateLevel(gameState.magnus.xp);
                if (newLevel > gameState.magnus.level) {
                  gameState.magnus.level = newLevel;
                }
                
                // Check achievements
                if (gameState.magnus.totalSimulations >= 1) {
                  gameState.magnus.achievements.push('first_simulation');
                }
                if (gameState.magnus.totalSimulations >= 10) {
                  gameState.magnus.achievements.push('circuit_master');
                }
                
              }, simulationTime);

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

function createGamifiedDashboard() {
  const userState = gameState.magnus;
  const nextLevelXp = getXpForLevel(userState.level + 1);
  const progressXp = userState.xp - getXpForLevel(userState.level);
  const levelProgress = Math.min((progressXp / (nextLevelXp - getXpForLevel(userState.level))) * 100, 100);

  const achievementsList = Object.entries(achievements).filter(([key, achievement]) => 
    userState.achievements.includes(key)
  );

  const successIcon = 'fa-check-circle';
  const infoIcon = 'fa-info-circle';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎮 Cocapn Hybrid IDE - Gamified Experience</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        .game-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 2;
        }

        .game-header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .player-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .stat-value {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .level-progress {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
        }

        .progress-bar {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            height: 20px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            background: linear-gradient(90deg, #10b981, #3b82f6);
            height: 100%;
            width: ${levelProgress}%;
            transition: width 0.5s ease;
            position: relative;
        }

        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 0.8rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .game-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .game-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #f093fb, #f5576c, #4facfe, #00f2fe);
        }

        .game-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .game-card-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .game-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .game-title {
            font-size: 1.3rem;
            font-weight: bold;
            color: #333;
        }

        .game-description {
            color: #666;
            margin-bottom: 20px;
            line-height: 1.4;
        }

        .game-rewards {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            font-size: 0.9rem;
        }

        .game-button {
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

        .game-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .game-button:active {
            transform: translateY(-1px);
        }

        .achievements-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .achievements-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .achievement-card {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
        }

        .achievement-card:hover {
            transform: translateY(-3px);
        }

        .achievement-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .achievement-name {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .achievement-desc {
            font-size: 0.8rem;
            opacity: 0.9;
        }

        .floating-notifications {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .notification {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.5s ease;
        }

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

        .login-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f093fb, #f5576c);
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

        .challenges-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .challenges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }

        .challenge-card {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .challenge-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }

        .challenge-desc {
            font-size: 0.9rem;
            margin-bottom: 15px;
            opacity: 0.9;
        }

        .challenge-rewards {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .reward-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
        }

        .challenge-button {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .challenge-button:hover {
            background: white;
            color: #4facfe;
        }
    </style>
</head>
<body>
    <div class="particles" id="particles"></div>
    
    <div class="floating-notifications" id="notifications"></div>
    
    <button class="login-btn" onclick="location.href='/login'">
        <i class="fas fa-sign-in-alt"></i> Login
    </button>

    <div class="game-container">
        <div class="game-header">
            <div class="player-stats">
                <div class="stat-card">
                    <div class="stat-icon">🎮</div>
                    <div class="stat-value">${userState.level}</div>
                    <div class="stat-label">Level</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">${userState.xp}</div>
                    <div class="stat-label">XP</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💎</div>
                    <div class="stat-value">${userState.points}</div>
                    <div class="stat-label">Points</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value">${userState.streak}</div>
                    <div class="stat-label">Day Streak</div>
                </div>
            </div>
            
            <div class="level-progress">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span><strong>Level ${userState.level}</strong></span>
                    <span><strong>Level ${userState.level + 1}</strong></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill">
                        <div class="progress-text">${Math.floor(levelProgress)}%</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="achievements-section">
            <h2 class="section-title">
                <i class="fas fa-trophy"></i> Achievements (${userState.achievements.length}/7)
            </h2>
            <div class="achievements-grid">
                ${achievementsList.map(([key, achievement]) => `
                    <div class="achievement-card">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="challenges-section">
            <h2 class="section-title">
                <i class="fas fa-flag"></i> Active Challenges (${userState.challengesCompleted}/20)
            </h2>
            <div class="challenges-grid">
                ${challenges.map(challenge => `
                    <div class="challenge-card">
                        <div class="challenge-title">${challenge.name}</div>
                        <div class="challenge-desc">${challenge.description}</div>
                        <div class="challenge-rewards">
                            <div class="reward-badge">+${challenge.xp} XP | +${challenge.points} PTS</div>
                            <button class="challenge-button" onclick="startChallenge('${challenge.id}')">
                                Start
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="game-grid">
            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">⚡</div>
                    <div class="game-title">AI Circuit Challenge</div>
                </div>
                <div class="game-description">
                    Test your skills with advanced circuit simulations. Complete challenges to earn XP and unlock new abilities!
                </div>
                <div class="game-rewards">
                    <i class="fas fa-gift"></i> +75 XP | +150 Points | +2 Streak
                </div>
                <button class="game-button" onclick="startSimulation('circuit')">
                    <i class="fas fa-play"></i> Start Challenge
                </button>
            </div>

            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">🎯</div>
                    <div class="game-title">Speed Simulation</div>
                </div>
                <div class="game-description">
                    Race against time to complete simulations as fast as possible. Beat the clock for bonus rewards!
                </div>
                <div class="game-rewards">
                    <i class="fas fa-gift"></i> +100 XP | +200 Points | Speed Badge
                </div>
                <button class="game-button" onclick="startSimulation('speed')">
                    <i class="fas fa-rocket"></i> Go Speed Run
                </button>
            </div>

            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">🏆</div>
                    <div class="game-title">Dragon Quest</div>
                </div>
                <div class="game-description">
                    Face the legendary Circuit Dragon! Complete this epic quest to become a true master of electronics.
                </div>
                <div class="game-rewards">
                    <i class="fas fa-gift"></i> +500 XP | +1000 Points | Dragon Slayer Title
                </div>
                <button class="game-button" onclick="startSimulation('dragon')">
                    <i class="fas fa-dragon"></i> Fight Dragon
                </button>
            </div>

            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">📊</div>
                    <div class="game-title">Precision Training</div>
                </div>
                <div class="game-description">
                    Hone your skills with precision-based simulations. Achieve perfect accuracy to unlock rare rewards!
                </div>
                <div class="game-rewards">
                    <i class="fas fa-gift"></i> +125 XP | +250 Points | Precision Chip
                </div>
                <button class="game-button" onclick="startSimulation('precision')">
                    <i class="fas fa-crosshairs"></i> Train Precision
                </button>
            </div>

            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">🎪</div>
                    <div class="game-title">Daily Challenge</div>
                </div>
                <div class="game-description">
                    Complete the daily challenge to maintain your streak and earn special bonuses. New challenges every day!
                </div>
                <div class="game-rewards">
                    <i class="fas fa-gift"></i> +200 XP | +300 Points | Daily Bonus
                </div>
                <button class="game-button" onclick="startSimulation('daily')">
                    <i class="fas fa-calendar-day"></i> Today's Challenge
                </button>
            </div>

            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">💎</div>
                    <div class="game-title">Ultimate Mode</div>
                </div>
                <div class="game-description">
                    Test your limits in the ultimate simulation challenge. Only the best can master this difficult mode!
                </div>
                <div class="game-rewards">
                    <i class="fas fa-gift"></i> +300 XP | +500 Points | Master Title
                </div>
                <button class="game-button" onclick="startSimulation('ultimate')">
                    <i class="fas fa-crown"></i> Ultimate Challenge
                </button>
            </div>
        </div>
    </div>

    <script>
        // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = Math.random() * 6 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Show notifications
        function showNotification(message, type = 'success') {
            const notificationsContainer = document.getElementById('notifications');
            const notification = document.createElement('div');
            notification.className = 'notification';
            const icon = type === 'success' ? 'check-circle' : 'info-circle';
            notification.innerHTML = 
                '<i class="fas fa-' + icon + '"></i> ' + message;
            notificationsContainer.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Start simulation
        async function startSimulation(type) {
            showNotification('Starting simulation... Get ready! ⚡');
            
            try {
                const response = await fetch('/api/agents/simulation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'run_simulation',
                        parameters: {
                            project: {
                                type: type + '_simulation',
                                components: ['battery', 'resistor', 'led']
                            }
                        }
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Show rewards
                    setTimeout(() => {
                        showNotification('🎉 Simulation Complete! +' + result.data.xp_gained + ' XP | +' + result.data.points_gained + ' Points');
                        
                        // Add some visual celebration
                        createCelebration();
                    }, 2000);
                } else {
                    showNotification('❌ Simulation failed. Try again!', 'error');
                }
            } catch (error) {
                showNotification('❌ Error starting simulation. Check your connection!', 'error');
            }
        }

        // Start challenge
        function startChallenge(challengeId) {
            showNotification('🚀 Challenge started! Good luck! 🚀');
            // Here you would track challenge progress
        }

        // Create celebration effect
        function createCelebration() {
            const celebration = document.createElement('div');
            celebration.style.cssText = 
                'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; z-index: 9999; animation: celebration 2s ease-out forwards;';
            celebration.innerHTML = '🎉🎊🎁';
            document.body.appendChild(celebration);
            
            setTimeout(() => {
                celebration.remove();
            }, 2000);
        }

        // Add celebration animation
        const style = document.createElement('style');
        style.textContent = '@keyframes celebration { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(0); opacity: 0; } }';
        document.head.appendChild(style);

        // Initialize particles on load
        createParticles();

        // Show welcome message
        setTimeout(() => {
            showNotification('👋 Welcome back, Magnus! Ready for today\'s challenges?');
        }, 1000);
    </script>
</body>
</html>`;
}

function createGamifiedLogin() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎮 Login to Cocapn Gamified Platform</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
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
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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
            transform: translateY(-1px);
        }

        .credentials-card {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }

        .credentials-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .credential-item {
            background: rgba(255, 255, 255, 0.2);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .credential-icon {
            font-size: 1.2rem;
        }

        .credential-text {
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }

        .error-message {
            background: #fee2e2;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            margin-top: 15px;
            border: 1px solid #fecaca;
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

        <div class="credentials-card">
            <h3 class="credentials-title">
                <i class="fas fa-gamepad"></i>
                Beta Player Login
            </h3>
            <div class="credential-item">
                <i class="fas fa-user credential-icon"></i>
                <span class="credential-text">Username: magnus</span>
            </div>
            <div class="credential-item">
                <i class="fas fa-lock credential-icon"></i>
                <span class="credential-text">Password: tryme</span>
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

        // Auto-fill credentials
        document.getElementById('username').value = 'magnus';
        document.getElementById('password').value = 'tryme';

        // Create stars on load
        createStars();
    </script>
</body>
</html>`;
}
