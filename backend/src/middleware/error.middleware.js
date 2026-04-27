const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      return AppError.conflict(`Duplicate value for field: ${err.meta?.target}`);
    case 'P2025':
      return AppError.notFound('Record not found');
    case 'P2003':
      return AppError.badRequest('Invalid relation reference');
    default:
      return AppError.internal('Database error');
  }
};

const handleJWTError = () => AppError.unauthorized('Invalid token');
const handleJWTExpiredError = () => AppError.unauthorized('Token expired');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    status: err.status,
    errors: err.errors,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  } else {
    logger.error({ err }, 'Unexpected error');
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = err;

  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    error = handlePrismaError(err);
  }

  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = AppError.badRequest('File too large. Maximum size is 5MB');
  }

  logger.error(
    {
      statusCode: error.statusCode,
      message: error.message,
      path: req.path,
      method: req.method,
    },
    'Request error'
  );

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

module.exports = errorMiddleware;