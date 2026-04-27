const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;
let redisAvailable = false;

async function connectRedis() {
  // Set REDIS_ENABLED=false in .env to skip Redis entirely
  if (process.env.REDIS_ENABLED === 'false') {
    logger.warn('Redis disabled via REDIS_ENABLED=false');
    return null;
  }

  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      tls: process.env.REDIS_HOST !== 'localhost' ? {} : undefined,
      // Fail fast — only 3 retries at startup, then give up
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 500);
      },
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,       // don't auto-connect on new Redis()
    });

    redisClient.on('error', () => {
      if (redisAvailable) {
        logger.warn('Redis connection lost — caching disabled until reconnected');
      }
      redisAvailable = false;
    });

    redisClient.on('connect', () => {
      redisAvailable = true;
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting…');
    });

    await redisClient.connect();
    await redisClient.ping();
    redisAvailable = true;
    return redisClient;

  } catch (err) {
    redisAvailable = false;
    redisClient = null;
    // Non-fatal — caller decides what to do
    return null;
  }
}

function getRedis() {
  return redisAvailable ? redisClient : null;
}

function isRedisAvailable() {
  return redisAvailable;
}

// Drop-in ping() so existing code that calls redis.ping() doesn't blow up
async function ping() {
  const r = getRedis();
  if (!r) return null;
  return r.ping();
}

// Drop-in disconnect() for graceful shutdown
function disconnect() {
  if (redisClient) {
    redisClient.disconnect();
    redisClient = null;
    redisAvailable = false;
  }
}

const CACHE_TTL = {
  USER_PROFILE: 300,   // 5 min
  FEED: 60,            // 1 min
  POST: 120,           // 2 min
  FOLLOWERS: 300,      // 5 min
};

const CacheKeys = {
  userProfile: (id)           => `user:profile:${id}`,
  userFeed:    (userId, page) => `feed:user:${userId}:${page}`,
  globalFeed:  (page)         => `feed:global:${page}`,
  userFollowers: (userId)     => `user:followers:${userId}`,
  userFollowing: (userId)     => `user:following:${userId}`,
  post:        (postId)       => `post:${postId}`,
};

module.exports = {
  connectRedis,
  getRedis,
  isRedisAvailable,
  ping,
  disconnect,
  CACHE_TTL,
  CacheKeys,
};