const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

console.log("Attempting to connect to:", process.env.MONGODB_URI.substring(0, 40) + "...");

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 8000 
})
.then(() => {
  console.log("Successfully connected to MongoDB Atlas! The IP whitelist works.");
  process.exit(0);
})
.catch(err => {
  console.error("Connection failed:", err.message);
  process.exit(1);
});
