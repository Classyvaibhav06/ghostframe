const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Bypassing auth for local development
  let mockUser = await User.findOne({ email: 'test@test.com' });
  if (!mockUser) {
    mockUser = await User.create({ name: 'Test User', email: 'test@test.com', password: 'password123' });
  }
  req.user = mockUser;
  next();
};

module.exports = { protect };
