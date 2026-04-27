const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams for :id from posts
const commentController = require('./comment.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { createCommentSchema, paginationSchema, deleteCommentSchema } = require('./comment.validation');

router.post('/',                protect, validate(createCommentSchema), commentController.addComment);
router.get('/',                          validate(paginationSchema),    commentController.getComments);
router.delete('/:commentId',    protect, validate(deleteCommentSchema), commentController.deleteComment);

module.exports = router;