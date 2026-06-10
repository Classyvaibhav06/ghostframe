const VideoTask = require('../models/VideoTask');
const { videoQueue } = require('../queue/videoQueue');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

exports.getUploadUrl = async (req, res) => {
  try {
    const { fileType, isImage } = req.query;
    const extension = fileType === 'video/mp4' ? 'mp4' : fileType === 'video/webm' ? 'webm' : fileType === 'image/jpeg' ? 'jpg' : fileType === 'image/png' ? 'png' : 'bin';
    
    // Generate a unique filename
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const key = `uploads/${req.user.id}/${uniqueId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType
    });

    // Generate presigned URL valid for 60 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({ uploadUrl, key });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    const { originalname, s3Key } = req.body;

    if (!s3Key) {
      return res.status(400).json({ message: 'No S3 key provided' });
    }

    if (req.user.planType === 'free' && req.user.videosProcessed >= 5) {
      return res.status(403).json({ message: 'Free plan limit reached. Maximum 5 videos allowed.' });
    }

    req.user.videosProcessed += 1;
    await req.user.save();

    const task = await VideoTask.create({
      user: req.user.id,
      originalFilename: originalname,
      inputPath: s3Key, // Storing the S3 key instead of local path
      status: 'pending'
    });

    await videoQueue.add('process-video', {
      taskId: task._id,
      inputPath: s3Key,
      filename: originalname
    });

    const waitingCount = await videoQueue.getWaitingCount();

    res.status(201).json({
      message: 'Video uploaded and added to processing queue',
      taskId: task._id,
      queuePosition: waitingCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskStatus = async (req, res) => {
  try {
    const task = await VideoTask.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await VideoTask.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const task = await VideoTask.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.outputPath) {
      return res.status(400).json({ message: 'Video not processed yet' });
    }

    // Generate a pre-signed URL for downloading the file from S3
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: task.outputPath,
      ResponseContentDisposition: `attachment; filename="processed_${task.originalFilename}.webm"`
    });
    
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Redirect the user's browser directly to the S3 download link
    res.redirect(downloadUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { taskId, progress } = req.body;
    
    // Emit progress to the specific room
    if (req.io) {
      req.io.to(taskId.toString()).emit('status_update', { 
        status: 'processing', 
        progress: progress 
      });
    }
    
    res.status(200).json({ message: 'Progress updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { originalname, s3Key } = req.body;

    if (!s3Key) {
      return res.status(400).json({ message: 'No S3 key provided' });
    }

    if (req.user.planType === 'free' && req.user.imagesProcessed >= 25) {
      return res.status(403).json({ message: 'Free plan limit reached. Maximum 25 images allowed.' });
    }

    req.user.imagesProcessed += 1;
    await req.user.save();

    const task = await VideoTask.create({
      user: req.user.id,
      originalFilename: originalname,
      inputPath: s3Key,
      status: 'pending' // Technically it processes synchronously via axios right here
    });

    res.status(201).json({
      message: 'Image uploaded and processing started',
      taskId: task._id
    });

    // Make an HTTP request to the python AI service
    const axios = require('axios');
    const pythonPort = process.env.PYTHON_PORT || 8000;
    try {
      const response = await axios.post(`http://localhost:${pythonPort}/process-image`, {
        taskId: task._id,
        inputPath: s3Key
      });

      // Update DB
      task.status = 'completed';
      task.outputPath = response.data.outputPath;
      await task.save();

      // Emit success to frontend
      if (req.io) {
        req.io.to(task._id.toString()).emit('status_update', {
          status: 'completed',
          outputPath: task.outputPath
        });
      }
    } catch (pyError) {
      task.status = 'failed';
      await task.save();
      if (req.io) {
        req.io.to(task._id.toString()).emit('status_update', {
          status: 'failed',
          errorMessage: pyError.message
        });
      }
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadImage = async (req, res) => {
  try {
    const task = await VideoTask.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.outputPath) {
      return res.status(400).json({ message: 'Image not processed yet' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: task.outputPath,
      ResponseContentDisposition: `attachment; filename="processed_${task.originalFilename}.png"`
    });
    
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.redirect(downloadUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
