const mongoose = require('mongoose');
const path = require('path');
// Load from server's own .env first, fallback to root .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

let dbPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!dbPromise) {
    console.log('Initiating MongoDB connection...');
    dbPromise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    }).then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }).catch((error) => {
      dbPromise = null; // Clear cached promise on error to allow retries on subsequent requests
      console.error(`MongoDB connection error: ${error.message}`);
      console.warn('Server will continue running without database connection. Some features may not work.');
      throw error;
    });
  }

  return dbPromise;
};

module.exports = connectDB;