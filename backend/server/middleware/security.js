// Security middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const isLocalhost = (req) => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.ip);

// Rate limiter for login/register (strict in prod, skipped for localhost dev)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: 'Too many authentication attempts, try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalhost,
});

// Rate limiter for general API (lenient)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  skip: (req) => req.path === '/api/health', // Skip health check
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: { maxAge: 31536000 }, // 1 year
  frameguard: { action: 'deny' },
  xssFilter: true,
  noSniff: true,
});

module.exports = { authLimiter, apiLimiter, securityHeaders };
