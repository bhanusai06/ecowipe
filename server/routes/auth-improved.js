/**
 * Authentication Routes - IMPROVED VERSION
 * With proper validation, security, and error handling
 */

const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const verifyToken = require('../middleware/verifyToken');
const {
  validateSendOTPRequest,
  validateVerifyOTPRequest,
  validateRegisterRequest,
  validateLoginRequest,
  validateResetPasswordRequest,
  validateGoogleAuthRequest
} = require('../middleware/validation');
const {
  loginRateLimiter,
  sendOTPRateLimiter,
  verifyOTPRateLimiter,
  resetRateLimit
} = require('../middleware/rateLimiter');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Generate OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * POST /api/auth/send-otp
 * Send OTP to email for registration or password reset
 */
router.post('/send-otp', sendOTPRateLimiter, validateSendOTPRequest, async (req, res, next) => {
  try {
    const { email, type } = req.body;

    // Check user existence
    const user = await User.findOne({ email });

    if (type === 'register' && user) {
      return res.status(400).json({ error: 'Email already registered. Please login.' });
    }

    if (type === 'reset' && !user) {
      return res.status(400).json({ error: 'Email not found. Please register first.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (!user && type === 'register') {
      // Create or update pending user for registration
      let pendingUser = await User.findOne({ email, isVerified: false });

      if (pendingUser) {
        pendingUser.otp = otp;
        pendingUser.otpExpires = otpExpires;
        await pendingUser.save();
      } else {
        const newUser = new User({
          email,
          password: 'PENDING_OTP_VERIFICATION',
          otp,
          otpExpires,
          isVerified: false
        });
        await newUser.save();
      }
    } else if (user) {
      // Update existing user with new OTP
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    // Send email
    const subject = type === 'register' ? 'EcoWIPE Registration OTP' : 'EcoWIPE Password Reset OTP';
    const emailBody = `Your EcoWIPE verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`;

    try {
      await sendEmail(email, subject, emailBody);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // In development, we can still proceed. In production, fail gracefully
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
      }
    }

    // Return OTP in dev mode for testing
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const response = {
      message: 'OTP sent successfully',
      ...(isDevelopment && { devOtp: otp }) // Only in development
    };

    res.status(200).json(response);

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and return temporary token
 */
router.post('/verify-otp', verifyOTPRateLimiter, validateVerifyOTPRequest, async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // OTP is valid - issue temporary token for next step
    const tempToken = jwt.sign(
      { _id: user._id, email: user.email, scope: 'verified' },
      JWT_SECRET,
      { expiresIn: '15m' } // Temporary token valid for 15 minutes
    );

    // Clear OTP from user document (optional - for security)
    // user.otp = undefined;
    // user.otpExpires = undefined;
    // await user.save();

    res.status(200).json({
      token: tempToken,
      message: 'OTP verified successfully'
    });

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/register
 * Complete registration after OTP verification
 */
router.post('/register', validateRegisterRequest, async (req, res, next) => {
  try {
    const { email, password, full_name, token } = req.body;

    // Verify the temporary token
    const verified = jwt.verify(token, JWT_SECRET);
    if (verified.email !== email || verified.scope !== 'verified') {
      return res.status(401).json({ error: 'Invalid or expired verification token.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please start registration again.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.full_name = full_name;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // Generate login token
    const loginToken = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Reset rate limiter for login
    resetRateLimit(email);

    res.status(201).json({
      token: loginToken,
      user: user._id,
      message: 'Account created successfully'
    });

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', loginRateLimiter, validateLoginRequest, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if user has a password (might be Google OAuth user)
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google OAuth. Please login with Google.' });
    }

    // Verify password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if user is verified (from email or Google OAuth)
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Email not verified. Please complete the OTP verification.' });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Reset rate limiter on successful login
    resetRateLimit(email);

    // Return user without sensitive fields
    const userResponse = {
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      total_eco_points: user.total_eco_points
    };

    res.status(200).json({
      token: token,
      user: userResponse,
      message: 'Login successful'
    });

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password after OTP verification
 */
router.post('/reset-password', validateResetPasswordRequest, async (req, res, next) => {
  try {
    const { email, password, token } = req.body;

    // Verify the temporary token
    const verified = jwt.verify(token, JWT_SECRET);
    if (verified.email !== email || verified.scope !== 'verified') {
      return res.status(401).json({ error: 'Invalid or expired verification token.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      message: 'Password reset successfully. Please login with your new password.'
    });

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/google
 * Google OAuth login/registration
 */
router.post('/google', validateGoogleAuthRequest, async (req, res, next) => {
  try {
    const { email, googleId, name } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user from Google
      user = new User({
        email,
        googleId,
        full_name: name,
        isVerified: true,
        // Google users don't need a password
        password: undefined
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google OAuth to existing account
      user.googleId = googleId;
      user.isVerified = true;
      if (name && (!user.full_name || user.full_name === 'User')) {
        user.full_name = name;
      }
      await user.save();
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Reset rate limiter on successful login
    resetRateLimit(email);

    res.status(200).json({
      token: token,
      message: 'Google login successful'
    });

  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (protected route)
 */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Logout (client will remove token from localStorage)
 */
router.post('/logout', verifyToken, (req, res) => {
  // Token removal is handled on client side
  // This endpoint can be used for audit logging if needed
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
