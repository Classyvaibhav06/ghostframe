const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  planType: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  imagesProcessed: {
    type: Number,
    default: 0
  },
  videosProcessed: {
    type: Number,
    default: 0
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true,
    default: null,
  },
  // Separate monthly counters — lets us enforce per-type plan limits
  apiVideoCallsThisMonth: {
    type: Number,
    default: 0,
  },
  apiImageCallsThisMonth: {
    type: Number,
    default: 0,
  },
  apiCallsResetAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Utility: generate a new unique-looking key prefixed with gf_
userSchema.methods.generateApiKey = function () {
  this.apiKey = 'gf_' + crypto.randomBytes(24).toString('hex');
  return this.apiKey;
};

module.exports = mongoose.model('User', userSchema);
