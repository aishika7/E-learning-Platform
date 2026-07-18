// utils/token.utils.js
const crypto = require('crypto');

/**
 * Generate a secure random reset token (hex string)
 */
const generateResetToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Hash a reset token for safe storage in DB
 */
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

/**
 * Generate reset token expiry (10 minutes from now)
 */
const getTokenExpiry = (minutes = 10) =>
  new Date(Date.now() + minutes * 60 * 1000);

module.exports = { generateResetToken, hashToken, getTokenExpiry };
