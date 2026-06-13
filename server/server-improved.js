/**
 * EcoWIPE Backend Server - IMPROVED VERSION
 * With proper middleware, error handling, and security
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth-improved');
// Import other routes as needed
// const usersRoutes = require('./routes/users');
// const wipeRecordsRoutes = require('./routes/wipeRecords');

// Connect to MongoDB
const connectDB = require('./config/db');

const app = express();

/**
 * SECURITY MIDDLEWARE
 */

// Trust proxy for accurate IP address in rate limiting
app.set('trust proxy', 1);

/**
 * CORS Configuration
 */
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5002',
  'http://127.0.0.1:5002',
  'https://srkr-cup.github.io',
  'https://charan242726.github.io',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'auth-token']
}));

/**
 * BODY PARSING MIDDLEWARE
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * REQUEST LOGGING MIDDLEWARE (development only)
 */
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

/**
 * HEALTH CHECK ENDPOINT
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * API ROUTES
 */
app.use('/api/auth', authRoutes);
// Add other routes here
// app.use('/api/users', usersRoutes);
// app.use('/api/wipe-records', wipeRecordsRoutes);

/**
 * 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

/**
 * GLOBAL ERROR HANDLER (must be last)
 */
app.use(errorHandler);

/**
 * PROCESS ERROR HANDLERS
 */
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * CONNECT TO DATABASE AND START SERVER
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✓ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ CORS origins: ${allowedOrigins.join(', ')}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
