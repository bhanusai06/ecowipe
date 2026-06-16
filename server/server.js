const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Handle uncaught exceptions (don't exit for DB-related errors)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  if (err.message && (err.message.includes('MongoDB') || err.message.includes('ENOTFOUND') || err.message.includes('querySrv'))) {
    console.warn('Database connection error - server continues running without DB');
  } else {
    // Only exit for truly fatal non-DB errors
    process.exit(1);
  }
});

// Handle unhandled promise rejections (e.g. MongoDB DNS failure)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason?.message || reason);
  // Don't exit - let the server keep running
});

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5002',
  'http://127.0.0.1:5002',
  'https://srkr-cup.github.io',
  'https://charan242726.github.io',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection Middleware for Serverless Environment
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed during request processing:', err.message);
  }
  next();
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wipe-records', require('./routes/wipeRecords'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (MUST be after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;