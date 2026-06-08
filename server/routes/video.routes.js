const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { uploadVideo, getTaskStatus, getUserTasks, downloadVideo, updateProgress, uploadImage, downloadImage } = require('../controllers/video.controller');

router.post('/upload', protect, upload.single('video'), uploadVideo);
router.post('/upload-image', protect, upload.single('image'), uploadImage);
router.get('/status/:id', protect, getTaskStatus);
router.get('/', protect, getUserTasks);
router.get('/download/:id', downloadVideo);
router.get('/download-image/:id', downloadImage);
router.post('/progress', updateProgress);

module.exports = router;
