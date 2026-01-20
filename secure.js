/**
 * Security utilities for Cocapn Hybrid IDE
 */

// Security headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: api.cocapn.ai;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Rate limiting configuration
const rateLimits = {
  ip: new Map(),
  requests: new Map()
};

// Session management
class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = setInterval(() => this.cleanupExpiredSessions(), 300000); // 5 minutes
  }

  createSession(user) {
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      user,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      lastActivity: Date.now()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    session.lastActivity = Date.now();
    return session;
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
      }
    }
  }

  revokeSession(sessionId) {
    this.sessions.delete(sessionId);
  }
}

// Rate limiting middleware
class RateLimiter {
  constructor(requestsPerMinute = 60, requestsPerHour = 1000) {
    this.requestsPerMinute = requestsPerMinute;
    this.requestsPerHour = requestsPerHour;
    this.ipRequests = new Map();
  }

  checkRateLimit(ip) {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const hour = Math.floor(now / 3600000);

    if (!this.ipRequests.has(ip)) {
      this.ipRequests.set(ip, { minutes: {}, hours: {} });
    }

    const requests = this.ipRequests.get(ip);

    // Check minute limit
    if (!requests.minutes[minute]) {
      requests.minutes[minute] = 1;
    } else {
      requests.minutes[minute]++;
    }

    // Check hour limit
    if (!requests.hours[hour]) {
      requests.hours[hour] = 1;
    } else {
      requests.hours[hour]++;
    }

    const minuteRequests = requests.minutes[minute];
    const hourRequests = requests.hours[hour];

    if (minuteRequests > this.requestsPerMinute || hourRequests > this.requestsPerHour) {
      return false;
    }

    return true;
  }

  cleanup() {
    const now = Date.now();
    const currentMinute = Math.floor(now / 60000);
    const currentHour = Math.floor(now / 3600000);

    for (const [ip, requests] of this.ipRequests) {
      // Clean old minutes
      Object.keys(requests.minutes).forEach(minute => {
        if (minute < currentMinute - 1) {
          delete requests.minutes[minute];
        }
      });

      // Clean old hours
      Object.keys(requests.hours).forEach(hour => {
        if (hour < currentHour - 1) {
          delete requests.hours[hour];
        }
      });

      // Remove IPs with no recent activity
      if (Object.keys(requests.minutes).length === 0 && Object.keys(requests.hours).length === 0) {
        this.ipRequests.delete(ip);
      }
    }
  }
}

// Authentication middleware
class AuthMiddleware {
  constructor(sessionManager) {
    this.sessionManager = sessionManager;
  }

  async handleRequest(request) {
    // Add security headers
    const response = new Response('Unauthorized', { status: 401 });
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: securityHeaders
      });
    }

    // Check authentication for protected routes
    if (request.url.includes('/api/') && !request.url.includes('/api/auth/')) {
      const sessionId = this.getSessionId(request);
      if (!sessionId) {
        return response;
      }

      const session = this.sessionManager.validateSession(sessionId);
      if (!session) {
        return response;
      }

      // Add session to request for downstream handlers
      request.session = session;
    }

    return null; // Continue to next handler
  }

  getSessionId(request) {
    // Try cookie first
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'sessionId') {
          return value;
        }
      }
    }

    // Try Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}

// Input validation
class InputValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  static validatePassword(password) {
    return password.length >= 6;
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  static validateProject(projectData) {
    const errors = [];

    if (!projectData.name || projectData.name.length < 3) {
      errors.push('Project name must be at least 3 characters');
    }

    if (!projectData.type || ['physics', 'chemistry', 'engineering', 'biology'].indexOf(projectData.type) === -1) {
      errors.push('Invalid project type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Logging and monitoring
class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      ip: this.getClientIP()
    };

    this.logs.push(logEntry);

    // In production, send to logging service
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
      this.sendToLogService(logEntry);
    }

    console[level](message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  getClientIP() {
    // This would be populated by the reverse proxy
    return 'unknown';
  }

  sendToLogService(logEntry) {
    // Send to external logging service
    fetch('https://your-logging-service.com/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logEntry)
    }).catch(error => {
      console.error('Failed to send log:', error);
    });
  }
}

// Export for use in worker
const sessionManager = new SessionManager();
const rateLimiter = new RateLimiter();
const authMiddleware = new AuthMiddleware(sessionManager);
const logger = new Logger();

// Cleanup intervals
setInterval(() => rateLimiter.cleanup(), 60000); // Clean up every minute

module.exports = {
  securityHeaders,
  sessionManager,
  rateLimiter,
  authMiddleware,
  InputValidator,
  Logger,
  logger
};