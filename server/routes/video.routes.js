const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { uploadVideo, getTaskStatus, getUserTasks, downloadVideo, updateProgress } = require('../controllers/video.controller');

router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/status/:id', protect, getTaskStatus);
router.get('/', protect, getUserTasks);
router.get('/download/:id', downloadVideo);
router.post('/progress', updateProgress);

module.exports = router;
