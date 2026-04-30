require('dotenv').config();

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const prisma = require('./config/database');
const { connectRedis, getRedis, isRedisAvailable } = require('./config/redis');

const PORT = config.port;

const startServer = async () => {
  try {
    // 1. Verify DB connection — this IS fatal, fail fast
    await prisma.$connect();
    logger.info('Database connected');

    // 2. Redis — optional, non-fatal
    await connectRedis();
    if (isRedisAvailable()) {
      logger.info('Redis connected');
    } else {
      logger.warn('Redis unavailable — running without cache (set REDIS_ENABLED=false to silence this)');
    }

    // 3. Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Sociofy API running on port ${PORT} [${config.env}]`);
    });

    // 4. Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully`);

      server.close(async () => {
        await prisma.$disconnect();

        const redis = getRedis();
        if (redis) redis.disconnect();

        logger.info('Server closed');
        process.exit(0);
      });

      // Force exit after 10s if connections hang
      setTimeout(() => {
        logger.error('Graceful shutdown timed out — forcing exit');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      logger.error({ err }, 'Unhandled Rejection — shutting down');
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      logger.error({ err }, 'Uncaught Exception — shutting down');
      process.exit(1);
    });

  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();