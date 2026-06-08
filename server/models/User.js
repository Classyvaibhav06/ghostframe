const mongoose = require('mongoose');

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
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
