/**
 * Verify Token Middleware - IMPROVED
 * Validates JWT and checks for expiration
 */

const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please login again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid token.' });
    }
    return res.status(400).json({ error: 'Token verification failed.' });
  }
};
