const express = require('express');
const router = express.Router();
const followController = require('./follow.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/:username/follow',   protect, followController.followUser);
router.delete('/:username/follow', protect, followController.unfollowUser);

module.exports = router;