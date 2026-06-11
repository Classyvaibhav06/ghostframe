const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { generateKey, revokeKey, getStats } = require('../controllers/api.controller');

// All routes require a logged-in user (JWT)
router.get('/stats', protect, getStats);
router.post('/generate-key', protect, generateKey);
router.delete('/revoke-key', protect, revokeKey);

module.exports = router;
