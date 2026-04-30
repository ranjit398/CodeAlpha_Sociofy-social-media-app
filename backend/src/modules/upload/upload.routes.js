const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../../utils/upload');
const { uploadLimiter } = require('../../middleware/rateLimit.middleware');
const AppError = require('../../utils/AppError');

router.post(
  '/',
  protect,
  uploadLimiter,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) return next(AppError.badRequest('No file provided'));

      const folder = req.query.type === 'avatar' ? 'sociofy/avatars' : 'sociofy/posts';
      const result = await uploadToCloudinary(req.file.buffer, folder);

      res.status(201).json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;