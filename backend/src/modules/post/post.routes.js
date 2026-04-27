const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const commentRoutes  = require('../comment/comment.routes'); // nested with mergeParams
const { protect } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { upload } = require('../../utils/upload');
const { createPostSchema, updatePostSchema, postParamSchema } = require('./post.validation');

router.post('/',          protect, upload.single('image'), validate(createPostSchema), postController.createPost);
router.get('/:id',                 validate(postParamSchema),                          postController.getPost);
router.patch('/:id',      protect, validate(updatePostSchema),                         postController.updatePost);
router.delete('/:id',     protect, validate(postParamSchema),                          postController.deletePost);
router.post('/:id/like',  protect, validate(postParamSchema),                          postController.likePost);
router.delete('/:id/like',protect, validate(postParamSchema),                          postController.unlikePost);

// ── Nested: /api/posts/:id/comments ──────────────────────────────────────────
// comment.routes uses { mergeParams: true } so req.params.id is available there
router.use('/:id/comments', commentRoutes);

module.exports = router;