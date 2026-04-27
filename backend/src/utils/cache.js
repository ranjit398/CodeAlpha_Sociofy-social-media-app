const { getRedis, CACHE_TTL } = require('../config/redis');
const logger = require('./logger');

// ─── Core helpers ─────────────────────────────────────────────────────────────

async function cacheGet(key) {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.warn(`Cache GET failed [${key}]: ${err.message}`);
    return null;
  }
}

async function cacheSet(key, value, ttl) {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.warn(`Cache SET failed [${key}]: ${err.message}`);
  }
}

async function cacheDel(key) {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    logger.warn(`Cache DEL failed [${key}]: ${err.message}`);
  }
}

async function cacheDelPattern(pattern) {
  const redis = getRedis();
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    logger.warn(`Cache DEL pattern failed [${pattern}]: ${err.message}`);
  }
}

// ─── Cache key factory ────────────────────────────────────────────────────────
// All keys in one place — no more "feedGlobal vs globalFeed" mismatch

const CacheKeys = {
  // User
  userProfile:   (id)           => `user:profile:${id}`,
  userFollowers: (userId)       => `user:followers:${userId}`,
  userFollowing: (userId)       => `user:following:${userId}`,

  // Post
  post:          (postId)       => `post:${postId}`,
  userPosts:     (userId, page) => `user:posts:${userId}:${page}`,

  // Feed — both naming styles supported to avoid runtime errors
  globalFeed:    (page, limit)  => `feed:global:${page}:${limit}`,
  feedGlobal:    (page, limit)  => `feed:global:${page}:${limit}`,   // alias
  userFeed:      (userId, page) => `feed:user:${userId}:${page}`,
  feedUser:      (userId, page) => `feed:user:${userId}:${page}`,    // alias
};

module.exports = { cacheGet, cacheSet, cacheDel, cacheDelPattern, CacheKeys, CACHE_TTL };