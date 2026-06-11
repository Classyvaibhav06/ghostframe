const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Plan limits ──────────────────────────────────────────────────────────────
const LIMITS = {
  free: { video: 4,   image: 20  },
  pro:  { video: 200, image: 200 }, // 200 total shared across both types
};

// Detect whether this request is an image or video processing call.
// Only upload/submit endpoints count against the quota — download/status are free.
const getCallType = (req) => {
  const path = req.path.toLowerCase();
  if (path.includes('upload-image')) return 'image';
  if (path.includes('upload'))       return 'video';
  return null; // status, download etc. — don't count
};

const protect = async (req, res, next) => {
  // ── 1. JWT Bearer token (web app) ─────────────────────────────────────────
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // ── 2. Developer API key (x-api-key header) ───────────────────────────────
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    try {
      const user = await User.findOne({ apiKey }).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid API key' });
      }

      // Reset both monthly counters when a new month starts
      const now = new Date();
      const resetNeeded =
        !user.apiCallsResetAt ||
        user.apiCallsResetAt.getMonth()     !== now.getMonth() ||
        user.apiCallsResetAt.getFullYear()  !== now.getFullYear();

      if (resetNeeded) {
        user.apiVideoCallsThisMonth = 0;
        user.apiImageCallsThisMonth = 0;
        user.apiCallsResetAt = now;
      }

      // Only enforce quota on processing endpoints
      const callType = getCallType(req);
      if (callType) {
        const plan   = user.planType || 'free';
        const limits = LIMITS[plan] || LIMITS.free;

        if (callType === 'video') {
          if (user.apiVideoCallsThisMonth >= limits.video) {
            return res.status(429).json({
              message: `Monthly video API limit of ${limits.video} reached for your ${plan} plan. Upgrade to Pro for more.`,
              limit: limits.video,
              used: user.apiVideoCallsThisMonth,
              type: 'video',
            });
          }
          user.apiVideoCallsThisMonth += 1;
        } else if (callType === 'image') {
          if (user.apiImageCallsThisMonth >= limits.image) {
            return res.status(429).json({
              message: `Monthly image API limit of ${limits.image} reached for your ${plan} plan. Upgrade to Pro for more.`,
              limit: limits.image,
              used: user.apiImageCallsThisMonth,
              type: 'image',
            });
          }
          user.apiImageCallsThisMonth += 1;
        }

        await user.save();
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'API key authentication failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token or API key' });
};

module.exports = { protect };
