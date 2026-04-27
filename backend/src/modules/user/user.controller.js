const userService = require('./user.service');
const { formatUser, formatUserList } = require('./user.dto');
const { formatFeed } = require('../feed/feed.dto');
const { uploadToCloudinary } = require('../../utils/upload');
const { UPLOAD_FOLDERS } = require('../../utils/constants');

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const users = await userService.searchUsers(q || '', limit);
    res.json({ success: true, data: { users: formatUserList(users, req.user?.id) } });
  } catch (err) {
    next(err);
  }
};

const getSuggestedUsers = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const users = await userService.getSuggestedUsers(req.user.id, limit);
    res.json({ success: true, data: { users: formatUserList(users, req.user.id) } });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.params.username, req.user?.id);
    res.json({ success: true, data: { user: formatUser(user, req.user?.id) } });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: { user: formatUser(user) }, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const result = await uploadToCloudinary(req.file.buffer, UPLOAD_FOLDERS.AVATAR, {
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    }, req.file.mimetype);
    const user = await userService.updateAvatar(req.user.id, result.secure_url);
    res.json({ success: true, data: { user: formatUser(user) }, message: 'Avatar updated' });
  } catch (err) {
    next(err);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const result = await userService.getFollowers(req.params.username, req.query);
    res.json({
      success: true,
      data: { users: formatUserList(result.items, req.user?.id), pagination: result.pagination },
    });
  } catch (err) {
    next(err);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const result = await userService.getFollowing(req.params.username, req.query);
    res.json({
      success: true,
      data: { users: formatUserList(result.items, req.user?.id), pagination: result.pagination },
    });
  } catch (err) {
    next(err);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const result = await userService.getUserPosts(req.params.username, req.query, req.user?.id);
    // Pass isPrivate flag if profile is locked
    if (result.isPrivate) {
      return res.json({ success: true, data: { posts: [], pagination: { hasMore: false }, isPrivate: true } });
    }
    res.json({ success: true, data: formatFeed(result.items, result.pagination, req.user?.id) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchUsers,
  getSuggestedUsers,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  getFollowers,
  getFollowing,
  getUserPosts,
};