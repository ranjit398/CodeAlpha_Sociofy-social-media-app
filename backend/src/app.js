const express = require('express');
const morgan = require('morgan');

const { helmetMiddleware, corsMiddleware, compressionMiddleware } = require('./middleware/security.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const errorMiddleware = require('./middleware/error.middleware');
const notFoundMiddleware = require('./middleware/notFound.middleware');

// Route modules
const authRoutes    = require('./modules/auth/auth.routes');
const userRoutes    = require('./modules/user/user.routes');
const postRoutes    = require('./modules/post/post.routes');
const followRoutes  = require('./modules/follow/follow.routes');
const feedRoutes    = require('./modules/feed/feed.routes');
const uploadRoutes  = require('./modules/upload/upload.routes');
// NOTE: commentRoutes is NOT mounted here — it is nested inside postRoutes
//       at /:id/comments so that mergeParams correctly passes the post :id param.

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
res.json({ success: true, status: 'ok', message: 'Pulse API is running', timestamp: new Date().toISOString() });});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

app.use('/api/auth',   authRoutes);
app.use('/api/users',  userRoutes);
app.use('/api/users',  followRoutes);       // POST/DELETE /api/users/:username/follow
app.use('/api/posts',  postRoutes);      // Comments nested inside: /api/posts/:id/comments
app.use('/api/feed',   feedRoutes);
app.use('/api/upload', uploadRoutes);

// ── 404 + Error Handlers ──────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;