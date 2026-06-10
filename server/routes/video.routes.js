const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { uploadVideo, getTaskStatus, getUserTasks, downloadVideo, updateProgress, uploadImage, downloadImage, getUploadUrl } = require('../controllers/video.controller');

router.get('/upload-url', protect, getUploadUrl);
router.post('/upload', protect, uploadVideo);
router.post('/upload-image', protect, uploadImage);
router.get('/status/:id', protect, getTaskStatus);
router.get('/', protect, getUserTasks);
router.get('/download/:id', downloadVideo);
router.get('/download-image/:id', downloadImage);
router.post('/progress', updateProgress);

module.exports = router;
