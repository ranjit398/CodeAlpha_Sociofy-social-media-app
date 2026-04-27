const AppError = require('../utils/AppError');

const notFoundMiddleware = (req, res, next) => {
  next(AppError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
};

module.exports = notFoundMiddleware;