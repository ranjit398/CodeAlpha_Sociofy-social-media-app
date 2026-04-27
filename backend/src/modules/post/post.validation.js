const Joi = require('joi');

const createPostSchema = {
  body: Joi.object({
    content: Joi.string().min(1).max(1000).optional(),
  }),
};

const updatePostSchema = {
  body: Joi.object({
    content: Joi.string().min(1).max(1000).required(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const postParamSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = { createPostSchema, updatePostSchema, postParamSchema };