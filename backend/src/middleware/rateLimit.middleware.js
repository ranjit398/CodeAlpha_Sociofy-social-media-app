const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new AppError(message, 429));
    },
  });

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