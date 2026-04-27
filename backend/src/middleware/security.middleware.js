const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const config = require('../config');

const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

const corsMiddleware = cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const compressionMiddleware = compression();

module.exports = { helmetMiddleware, corsMiddleware, compressionMiddleware };