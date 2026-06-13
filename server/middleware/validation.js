/**
 * Input Validation Middleware
 * Validates request body and sanitizes inputs
 */

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, with uppercase, lowercase, number, and special character
  // OR at least 12 characters for easier passwords
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Require complexity if password is less than 12 characters
  if (password.length < 12) {
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  // For longer passwords, at least 3 of the above
  const complexityCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  return complexityCount >= 3;
};

const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Middleware to validate send-otp request
 */
export const validateSendOTPRequest = (req, res, next) => {
  const { email, type } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!['register', 'reset'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Must be "register" or "reset"' });
  }

  req.body.email = sanitizeInput(email.toLowerCase());
  next();
};

/**
 * Middleware to validate verify-otp request
 */
export const validateVerifyOTPRequest = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!otp || typeof otp !== 'string') {
    return res.status(400).json({ error: 'OTP is required' });
  }

  if (!validateOTP(otp)) {
    return res.status(400).json({ error: 'OTP must be 6 digits' });
  }

  req.body.email = sanitizeInput(email.toLowerCase());
  req.body.otp = sanitizeInput(otp);
  next();
};

/**
 * Middleware to validate register request
 */
export const validateRegisterRequest = (req, res, next) => {
  const { email, password, full_name, token } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
    });
  }

  if (!full_name || typeof full_name !== 'string') {
    return res.status(400).json({ error: 'Full name is required' });
  }

  if (full_name.trim().length < 2) {
    return res.status(400).json({ error: 'Full name must be at least 2 characters' });
  }

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  req.body.email = sanitizeInput(email.toLowerCase());
  req.body.full_name = sanitizeInput(full_name);
  next();
};

/**
 * Middleware to validate login request
 */
export const validateLoginRequest = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  req.body.email = sanitizeInput(email.toLowerCase());
  next();
};

/**
 * Middleware to validate reset-password request
 */
export const validateResetPasswordRequest = (req, res, next) => {
  const { email, password, token } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
    });
  }

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  req.body.email = sanitizeInput(email.toLowerCase());
  next();
};

/**
 * Middleware to validate google auth request
 */
export const validateGoogleAuthRequest = (req, res, next) => {
  const { email, googleId, name } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!googleId || typeof googleId !== 'string') {
    return res.status(400).json({ error: 'Google ID is required' });
  }

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required' });
  }

  req.body.email = sanitizeInput(email.toLowerCase());
  req.body.name = sanitizeInput(name);
  next();
};
