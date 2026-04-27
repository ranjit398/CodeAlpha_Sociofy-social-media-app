const cloudinary = require('cloudinary').v2;
const config = require('./index');

const PLACEHOLDERS = ['your_cloud_name', 'your_api_key', 'your_api_secret', '', undefined];

const isConfigured =
  !PLACEHOLDERS.includes(config.cloudinary.cloudName) &&
  !PLACEHOLDERS.includes(config.cloudinary.apiKey) &&
  !PLACEHOLDERS.includes(config.cloudinary.apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key:    config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure:     true,
  });
} else {
  console.warn(
    '[Cloudinary] ⚠️  Credentials not set — image upload disabled.\n' +
    '  Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env'
  );
}

module.exports = { ...cloudinary, isConfigured };