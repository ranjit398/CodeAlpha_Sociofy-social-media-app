const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { authLimiter } = require('../../middleware/rateLimit.middleware');
const { registerSchema, loginSchema, refreshSchema } = require('./auth.validation');

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login',    authLimiter, validate(loginSchema),    authController.login);
router.post('/refresh',  validate(refreshSchema),               authController.refresh);
router.post('/logout',   protect,                               authController.logout);
router.get('/me',        protect,                               authController.getMe);

module.exports = router;