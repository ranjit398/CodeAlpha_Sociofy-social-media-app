const express = require('express');
const router = express.Router();
const feedController = require('./feed.controller');
const { protect } = require('../../middleware/auth.middleware');

// Optional auth: attach user if token present
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  try {
    const { verifyAccessToken } = require('../../config/jwt');
    const decoded = verifyAccessToken(authHeader.split(' ')[1]);
    const prisma = require('../../config/database');
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true } });
    if (user) req.user = user;
  } catch (_) {
    // ignore token errors for optional auth
  }
  next();
};

router.get('/global',    optionalAuth,         feedController.getGlobalFeed);
router.get('/following', protect,              feedController.getPersonalizedFeed);

module.exports = router;