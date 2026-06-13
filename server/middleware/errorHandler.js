/**
 * Global Error Handler Middleware
 * Catches and formats all errors consistently
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let response = {
    error: message,
    timestamp: new Date().toISOString()
  };

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
    response.error = message;
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    response.error = `${field} already exists`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    response.error = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    response.error = 'Token has expired';
  }

  // Hide stack trace in production
  if (process.env.NODE_ENV === 'production') {
    delete response.stack;
  } else {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
