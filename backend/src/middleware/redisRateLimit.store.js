const { getRedis, isRedisAvailable } = require('../config/redis');

// Delegating store: uses Redis when available, otherwise falls back to an in-memory Map.
// Provides the minimal interface expected by express-rate-limit: increment(key, cb) and resetKey(key).
module.exports = function createRedisStore(windowMs) {
  const ttlSeconds = Math.ceil(windowMs / 1000);

  // Simple in-memory fallback store
  const mem = new Map();

  const memIncrement = (key) => {
    const now = Date.now();
    const entry = mem.get(key);
    if (!entry || entry.expiresAt <= now) {
      mem.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 });
      return 1;
    }
    entry.count += 1;
    return entry.count;
  };

  return {
    async increment(key, cb) {
      try {
        const redis = getRedis();
        if (isRedisAvailable() && redis) {
          const script = `local v = redis.call('INCR', KEYS[1])\nif tonumber(v) == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end\nreturn v`;
          const res = await redis.eval(script, 1, key, ttlSeconds);
          const current = parseInt(res, 10);
          return cb(null, current);
        }

        const current = memIncrement(key);
        return cb(null, current);
      } catch (err) {
        return cb(err);
      }
    },

    async resetKey(key) {
      try {
        const redis = getRedis();
        if (isRedisAvailable() && redis) {
          await redis.del(key);
          return;
        }
        mem.delete(key);
      } catch (err) {
        // swallow
      }
    },
  };
};
