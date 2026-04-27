const Joi = require('joi');

const searchSchema = {
  query: Joi.object({
    q: Joi.string().min(1).max(50).required(),
    limit: Joi.number().integer().min(1).max(50).optional(),
  }),
};

const updateProfileSchema = {
  body: Joi.object({
    displayName: Joi.string().min(1).max(50).optional(),
    bio: Joi.string().max(160).allow('').optional(),
  }),
};

const paginationSchema = {
  query: Joi.object({
    cursor: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
  }),
};

module.exports = { searchSchema, updateProfileSchema, paginationSchema };