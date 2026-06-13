/**
 * Validation Utilities
 * Reusable validation functions for form data
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {object} {isValid, error}
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password strength
 * Must be at least 8 characters with uppercase, lowercase, number, and special character
 * @param {string} password
 * @returns {object} {isValid, error, strength}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required', strength: 0 };
  }

  let strength = 0;
  let error = null;

  // Check length
  if (password.length < 8) {
    error = 'Password must be at least 8 characters long';
  } else {
    strength += 25;
  }

  // Check for uppercase
  if (/[A-Z]/.test(password)) {
    strength += 25;
  } else if (!error) {
    error = 'Password must contain at least one uppercase letter';
  }

  // Check for lowercase
  if (/[a-z]/.test(password)) {
    strength += 25;
  } else if (!error) {
    error = 'Password must contain at least one lowercase letter';
  }

  // Check for number
  if (/\d/.test(password)) {
    strength += 0; // Already at 75
  } else if (!error) {
    error = 'Password must contain at least one number';
  }

  // Check for special character
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    strength = 100;
  } else if (strength === 75) {
    error = 'Password must contain at least one special character (!@#$%^&*...)';
  }

  return {
    isValid: !error && password.length >= 8,
    error,
    strength: Math.min(strength, 100)
  };
};

/**
 * Validate OTP format (6 digits)
 * @param {string} otp
 * @returns {object} {isValid, error}
 */
export const validateOTP = (otp) => {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }

  if (!/^\d{6}$/.test(otp)) {
    return { isValid: false, error: 'OTP must be exactly 6 digits' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate full name
 * @param {string} fullName
 * @returns {object} {isValid, error}
 */
export const validateFullName = (fullName) => {
  if (!fullName || fullName.trim() === '') {
    return { isValid: false, error: 'Full name is required' };
  }

  if (fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters' };
  }

  if (fullName.trim().length > 100) {
    return { isValid: false, error: 'Full name must not exceed 100 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Check if passwords match
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {object} {isValid, error}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate form data for login
 * @param {object} formData
 * @returns {object} {isValid, errors}
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate form data for registration
 * @param {object} formData
 * @returns {object} {isValid, errors}
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  const nameValidation = validateFullName(formData.fullName);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  const matchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
  if (!matchValidation.isValid) {
    errors.confirmPassword = matchValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get password strength label
 * @param {number} strength
 * @returns {string}
 */
export const getPasswordStrengthLabel = (strength) => {
  if (strength < 25) return 'Very Weak';
  if (strength < 50) return 'Weak';
  if (strength < 75) return 'Good';
  if (strength < 90) return 'Strong';
  return 'Very Strong';
};

/**
 * Get password strength color
 * @param {number} strength
 * @returns {string}
 */
export const getPasswordStrengthColor = (strength) => {
  if (strength < 25) return 'bg-red-500';
  if (strength < 50) return 'bg-orange-500';
  if (strength < 75) return 'bg-yellow-500';
  if (strength < 90) return 'bg-lime-500';
  return 'bg-green-500';
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};
