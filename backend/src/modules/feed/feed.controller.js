const feedService = require('./feed.service');
const { formatFeed } = require('./feed.dto');

const getGlobalFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const result = await feedService.getGlobalFeed(req.user?.id, page, limit);
    res.json({ success: true, data: formatFeed(result.posts, result.pagination, req.user?.id) });
  } catch (err) {
    next(err);
  }
};

const getPersonalizedFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const result = await feedService.getPersonalizedFeed(req.user.id, page, limit);
    res.json({ success: true, data: formatFeed(result.posts, result.pagination, req.user.id) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGlobalFeed, getPersonalizedFeed };