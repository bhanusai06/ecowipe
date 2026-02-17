const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    // Password is required only if googleId is not present
    required: function () { return !this.googleId; }
  },
  full_name: {
    type: String,
    // Full name is optional during initial registration if we want to capture it later
    default: 'User'
  },
  googleId: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  total_eco_points: {
    type: Number,
    default: 0
  },
  total_devices_wiped: {
    type: Number,
    default: 0
  },
  total_data_wiped_gb: {
    type: Number,
    default: 0
  },
  eco_badges: [{
    type: String,
    enum: ['GREEN_SHIELD', 'DATA_GUARDIAN', 'ECO_WARRIOR']
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);