const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { uploadVideo, getTaskStatus, getUserTasks, downloadVideo, updateProgress, uploadImage, downloadImage, getUploadUrl, batchComplete } = require('../controllers/video.controller');

router.get('/upload-url', protect, getUploadUrl);
router.post('/upload', protect, uploadVideo);
router.post('/upload-image', protect, uploadImage);
router.get('/status/:id', protect, getTaskStatus);
router.get('/', protect, getUserTasks);
router.get('/download/:id', downloadVideo);
router.get('/download-image/:id', downloadImage);
router.post('/progress', updateProgress);

// Called by the Fargate container when a batch job completes or fails
// No auth needed — secured by a shared secret (BATCH_CALLBACK_SECRET env var)
router.post('/batch-complete', batchComplete);

module.exports = router;
