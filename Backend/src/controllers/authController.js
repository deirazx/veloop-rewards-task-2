const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign JWT token
const generateToken = (userId, customUserId) => {
  return jwt.sign(
    { id: userId, customUserId },
    process.env.JWT_SECRET || 'veloop_rewards_secret_key_2026_jwt_token',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

/**
 * Register a new VELOOP user
 * POST /api/auth/register
 * Body: { name, email, password }
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Create user (pre-save hook auto-generates customUserId and hashes password)
    // Starting balances are defaulted to: VES: 1000, SVES: 1500, Tokens: 3000
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      balances: {
        VES: 1000,
        SVES: 1500,
        Tokens: 3000
      }
    });

    const token = generateToken(user._id, user.customUserId);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        customUserId: user.customUserId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balances: user.balances,
        tier: user.tier,
        isKycVerified: user.isKycVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed.'
    });
  }
};

/**
 * Authenticate user & get JWT token
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Explicitly select password field as select: false is on schema
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.'
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. Contact compliance@veloop.io'
      });
    }

    const token = generateToken(user._id, user.customUserId);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        customUserId: user.customUserId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balances: user.balances,
        tier: user.tier,
        isKycVerified: user.isKycVerified
      }
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Login failed.'
    });
  }
};

/**
 * Fetch current authenticated user's profile and live balances
 * GET /api/auth/me
 * Protected via authMiddleware
 */
exports.getMe = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    const freshUser = await User.findById(req.user._id);

    if (!freshUser) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        id: freshUser._id,
        customUserId: freshUser.customUserId,
        name: freshUser.name,
        email: freshUser.email,
        phone: freshUser.phone,
        balances: freshUser.balances,
        tier: freshUser.tier,
        isKycVerified: freshUser.isKycVerified,
        createdAt: freshUser.createdAt
      }
    });
  } catch (error) {
    console.error('[Get Me Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.'
    });
  }
};
