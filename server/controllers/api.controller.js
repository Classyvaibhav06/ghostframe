const User = require('../models/User');

// POST /api/developer/generate-key
// Generates (or regenerates) an API key for the logged-in user
const generateKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.generateApiKey();
    await user.save();
    res.json({ apiKey: user.apiKey });
  } catch (err) {
    console.error('[API] generateKey error:', err);
    res.status(500).json({ message: 'Failed to generate API key' });
  }
};

// DELETE /api/developer/revoke-key
// Revokes (deletes) the user's current API key
const revokeKey = async (req, res) => {
  try {
    // Use $unset to remove the field entirely — setting to null would re-trigger
    // the sparse unique index collision for multiple users with null keys.
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { apiKey: '' },
      $set:   { apiVideoCallsThisMonth: 0, apiImageCallsThisMonth: 0 },
    });
    res.json({ message: 'API key revoked' });
  } catch (err) {
    console.error('[API] revokeKey error:', err);
    res.status(500).json({ message: 'Failed to revoke API key' });
  }
};

// GET /api/developer/stats
// Returns current key and monthly usage for the logged-in user
const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'apiKey apiVideoCallsThisMonth apiImageCallsThisMonth apiCallsResetAt planType'
    );
    res.json({
      apiKey: user.apiKey || null,
      plan: user.planType || 'free',
      videoCallsThisMonth: user.apiVideoCallsThisMonth,
      imageCallsThisMonth: user.apiImageCallsThisMonth,
      resetAt: user.apiCallsResetAt,
    });
  } catch (err) {
    console.error('[API] getStats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

module.exports = { generateKey, revokeKey, getStats };
