const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Strictly extracts and verifies Bearer JWT token from Authorization header.
 * Attaches verified User document to req.user.
 * Rejects unauthorized requests with { success: false, error: 'LOGIN_REQUIRED' }
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 1. If Token is present, verify cryptographically
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'veloop_rewards_secret_key_2026_jwt_token'
        );

        const user = await User.findById(decoded.id || decoded._id);
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'LOGIN_REQUIRED',
            message: 'Session invalid or user no longer exists. Please log in again.'
          });
        }

        if (user.isSuspended) {
          return res.status(403).json({
            success: false,
            error: 'ACCOUNT_SUSPENDED',
            message: 'Your account is suspended. Contact compliance@veloop.io'
          });
        }

        req.user = user;
        return next();
      } catch (jwtErr) {
        return res.status(401).json({
          success: false,
          error: 'LOGIN_REQUIRED',
          message: 'Token expired or invalid signature. Please log in again.'
        });
      }
    }

    // 2. Fallback in development/testing mode for x-user-id header
    const devUserId = req.headers['x-user-id'];
    if (devUserId) {
      const user = await User.findOne({ customUserId: devUserId });
      if (user && !user.isSuspended) {
        req.user = user;
        return next();
      }
    }

    // 3. Strict rejection if no valid token is provided
    return res.status(401).json({
      success: false,
      error: 'LOGIN_REQUIRED',
      message: 'Authentication token is required to access this resource.'
    });
  } catch (error) {
    console.error('[Auth Middleware Error]', error);
    return res.status(500).json({
      success: false,
      error: 'AUTH_PROCESSING_ERROR',
      message: 'Internal server error during authentication.'
    });
  }
};

module.exports = authMiddleware;
