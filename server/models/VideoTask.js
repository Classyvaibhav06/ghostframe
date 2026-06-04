const mongoose = require('mongoose');

const videoTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0
  },
  inputPath: {
    type: String,
    required: true
  },
  outputPath: {
    type: String
  },
  errorMessage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('VideoTask', videoTaskSchema);
