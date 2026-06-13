const mongoose = require('mongoose');
const path = require('path');
// Load from server's own .env first, fallback to root .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.warn('Server will continue running without database connection. Some features may not work.');
    // Don't exit - let the server start so we can at least diagnose
  }
};

module.exports = connectDB;