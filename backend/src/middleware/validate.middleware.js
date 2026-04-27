const AppError = require('../utils/AppError');

/**
 * @param {object} schema - Joi schema with optional keys: body, query, params
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const key of ['body', 'query', 'params']) {
    if (schema[key]) {
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        errors.push(
          ...error.details.map((d) => ({
            field: d.path.join('.'),
            message: d.message.replace(/"/g, ''),
          }))
        );
      }
    }
  }

  if (errors.length > 0) {
    return next(AppError.badRequest('Validation failed', errors));
  }

  next();
};

module.exports = { validate };