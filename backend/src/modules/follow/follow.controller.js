const followService = require('./follow.service');

const followUser = async (req, res, next) => {
  try {
    await followService.followUser(req.user.id, req.params.username);
    res.status(201).json({ success: true, message: `Now following @${req.params.username}` });
  } catch (err) {
    next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    await followService.unfollowUser(req.user.id, req.params.username);
    res.json({ success: true, message: `Unfollowed @${req.params.username}` });
  } catch (err) {
    next(err);
  }
};

module.exports = { followUser, unfollowUser };