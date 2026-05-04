const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');
const createRedisStore = require('./redisRateLimit.store');
const { isRedisAvailable } = require('../config/redis');

const createLimiter = (windowMs, max, message, options = {}) => {
  const store = isRedisAvailable() ? createRedisStore(windowMs) : null;
  const cfg = {
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new AppError(message, 429));
    },
    keyGenerator: (req) => {
      // Prefer authenticated user id when available to avoid IP collisions
      try {
        if (req.user && req.user.id) return `user:${req.user.id}`;
      } catch (e) {
        // ignore and fallback to IP
      }
      return req.ip;
    },
    ...(store ? { store } : {}),
    ...options,
  };

  return rateLimit(cfg);
};

const authLimiter = createLimiter(
  60 * 1000,       // 1 minute
  5,
  'Too many auth attempts. Please wait a minute.'
);

const apiLimiter = createLimiter(
  15 * 60 * 1000,  // 15 minutes
  100,
  'Too many requests. Please slow down.'
);

const uploadLimiter = createLimiter(
  60 * 1000,
  10,
  'Too many upload attempts.'
);

module.exports = { authLimiter, apiLimiter, uploadLimiter };