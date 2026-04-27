const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { upload } = require('../../utils/upload');
const { uploadLimiter } = require('../../middleware/rateLimit.middleware');
const { searchSchema, updateProfileSchema, paginationSchema } = require('./user.validation');

router.get('/search',              validate(searchSchema),         userController.searchUsers);
router.get('/me/suggested', protect,                              userController.getSuggestedUsers);
router.get('/:username',                                          userController.getUserProfile);
router.patch('/me/profile',   protect, validate(updateProfileSchema), userController.updateProfile);
router.post('/me/avatar',     protect, uploadLimiter, upload.single('avatar'), userController.uploadAvatar);
router.get('/:username/followers', validate(paginationSchema),    userController.getFollowers);
router.get('/:username/following', validate(paginationSchema),    userController.getFollowing);
router.get('/:username/posts',     validate(paginationSchema),    userController.getUserPosts);

module.exports = router;