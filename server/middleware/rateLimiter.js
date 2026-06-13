/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and excessive API calls
 */

class RateLimiter {
  constructor() {
    this.attempts = {}; // { ipOrEmail: { count, resetTime } }
    this.cleanupInterval = 60 * 60 * 1000; // 1 hour
    this.startCleanup();
  }

  /**
   * Start periodic cleanup of old entries
   */
  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      Object.keys(this.attempts).forEach(key => {
        if (this.attempts[key].resetTime < now) {
          delete this.attempts[key];
        }
      });
    }, this.cleanupInterval);
  }

  /**
   * Check if request should be rate limited
   * @param {string} identifier - IP address or email
   * @param {number} maxAttempts - Maximum attempts allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {boolean} - true if should be rate limited
   */
  isRateLimited(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const current = this.attempts[identifier];

    if (!current || current.resetTime < now) {
      // First attempt or window has reset
      this.attempts[identifier] = {
        count: 1,
        resetTime: now + windowMs
      };
      return false;
    }

    // Increment count
    current.count++;

    if (current.count > maxAttempts) {
      return true;
    }

    return false;
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(identifier, maxAttempts = 5) {
    const current = this.attempts[identifier];
    if (!current || current.resetTime < Date.now()) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - current.count);
  }

  /**
   * Get time until reset
   */
  getResetTime(identifier) {
    const current = this.attempts[identifier];
    if (!current) {
      return 0;
    }
    return Math.max(0, current.resetTime - Date.now());
  }

  /**
   * Reset attempts for identifier
   */
  reset(identifier) {
    delete this.attempts[identifier];
  }
}

const limiter = new RateLimiter();

/**
 * Middleware for login rate limiting
 * Max 5 attempts per 15 minutes per IP
 */
export const loginRateLimiter = (req, res, next) => {
  const identifier = req.ip || req.connection.remoteAddress || 'unknown';
  const maxAttempts = 5;
  const windowMs = 15 * 60 * 1000; // 15 minutes

  if (limiter.isRateLimited(identifier, maxAttempts, windowMs)) {
    const remainingTime = Math.ceil(limiter.getResetTime(identifier) / 1000);
    return res.status(429).json({
      error: `Too many login attempts. Please try again in ${remainingTime} seconds.`,
      retryAfter: remainingTime
    });
  }

  next();
};

/**
 * Middleware for send-otp rate limiting
 * Max 3 attempts per 5 minutes per email
 */
export const sendOTPRateLimiter = (req, res, next) => {
  const email = req.body.email || 'unknown';
  const maxAttempts = 3;
  const windowMs = 5 * 60 * 1000; // 5 minutes

  if (limiter.isRateLimited(email, maxAttempts, windowMs)) {
    const remainingTime = Math.ceil(limiter.getResetTime(email) / 1000);
    return res.status(429).json({
      error: `Too many OTP requests. Please try again in ${remainingTime} seconds.`,
      retryAfter: remainingTime
    });
  }

  next();
};

/**
 * Middleware for verify-otp rate limiting
 * Max 5 attempts per 5 minutes per email
 */
export const verifyOTPRateLimiter = (req, res, next) => {
  const email = req.body.email || 'unknown';
  const maxAttempts = 5;
  const windowMs = 5 * 60 * 1000; // 5 minutes

  if (limiter.isRateLimited(email, maxAttempts, windowMs)) {
    const remainingTime = Math.ceil(limiter.getResetTime(email) / 1000);
    return res.status(429).json({
      error: `Too many OTP verification attempts. Please try again in ${remainingTime} seconds.`,
      retryAfter: remainingTime
    });
  }

  next();
};

/**
 * Reset rate limit for successful operations
 */
export const resetRateLimit = (identifier) => {
  limiter.reset(identifier);
};

export default limiter;
