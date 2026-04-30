const multer = require('multer');
const { isConfigured, uploader } = require('../config/cloudinary');
const AppError = require('./AppError');

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov', 'video/avi'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

const MAX_SIZE = 50 * 1024 * 1024; // 50MB (supports videos)

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(AppError.badRequest('Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

/**
 * Upload buffer to Cloudinary — auto-detects image vs video
 */
const uploadToCloudinary = (buffer, folder = 'sociofy', options = {}, mimeType = null) => {
  if (!isConfigured) {
    return Promise.reject(
      AppError.badRequest(
        'Upload is not available. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env'
      )
    );
  }

  const isVideo = mimeType && VIDEO_TYPES.includes(mimeType);
  const resourceType = isVideo ? 'video' : 'image';

  return new Promise((resolve, reject) => {
    try {
      const stream = uploader.upload_stream(
        { folder, resource_type: resourceType, ...options },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      if (stream) {
        if (stream.catch) stream.catch(reject);
        if (stream.on) stream.on('error', reject);
        stream.end(buffer);
      } else {
        reject(new Error('Cloudinary upload_stream failed to initialize'));
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Delete asset from Cloudinary by public_id
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!isConfigured || !publicId) return;
  await uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };