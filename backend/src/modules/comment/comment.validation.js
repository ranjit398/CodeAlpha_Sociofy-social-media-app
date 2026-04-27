const Joi = require('joi');

const createCommentSchema = {
  body: Joi.object({ content: Joi.string().min(1).max(500).required() }),
  params: Joi.object({ id: Joi.string().required() }),
};

const paginationSchema = {
  query: Joi.object({
    cursor: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
  }),
  params: Joi.object({ id: Joi.string().required() }),
};

const deleteCommentSchema = {
  params: Joi.object({
    id: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
};

module.exports = { createCommentSchema, paginationSchema, deleteCommentSchema };