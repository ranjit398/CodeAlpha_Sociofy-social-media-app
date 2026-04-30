const jwt = require('jsonwebtoken');
const config = require('./index');

const signAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
    issuer: 'sociofy-api',
  });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
    issuer: 'sociofy-api',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret, { issuer: 'sociofy-api' });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret, { issuer: 'sociofy-api' });
};

const getRefreshExpiryDate = () => {
  const expiry = config.jwt.refreshExpiry || '7d';
  // Parse strings like '7d', '24h', '60m', '3600s'
  const match = expiry.match(/^(\d+)([smhd])$/i);
  if (!match) {
    // Fallback: treat as plain seconds number
    const seconds = parseInt(expiry, 10) || 604800; // default 7 days
    return new Date(Date.now() + seconds * 1000);
  }
  const value = parseInt(match[1], 10);
  const unit  = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return new Date(Date.now() + value * multipliers[unit]);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiryDate,
};