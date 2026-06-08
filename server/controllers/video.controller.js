const VideoTask = require('../models/VideoTask');
const { videoQueue } = require('../queue/videoQueue');
const path = require('path');

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const { originalname, path: inputPath } = req.file;

    if (req.user.planType === 'free' && req.user.videosProcessed >= 5) {
      return res.status(403).json({ message: 'Free plan limit reached. Maximum 5 videos allowed.' });
    }

    req.user.videosProcessed += 1;
    await req.user.save();

    const task = await VideoTask.create({
      user: req.user.id,
      originalFilename: originalname,
      inputPath: inputPath,
      status: 'pending'
    });

    await videoQueue.add('process-video', {
      taskId: task._id,
      inputPath: inputPath,
      filename: originalname
    });

    res.status(201).json({
      message: 'Video uploaded and added to processing queue',
      taskId: task._id
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

    // res.download sends the file to the client
    const path = require('path');
    const baseName = path.parse(task.originalFilename).name;
    res.download(task.outputPath, `processed_${baseName}.webm`);
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
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { originalname, path: inputPath } = req.file;

    if (req.user.planType === 'free' && req.user.imagesProcessed >= 25) {
      return res.status(403).json({ message: 'Free plan limit reached. Maximum 25 images allowed.' });
    }

    req.user.imagesProcessed += 1;
    await req.user.save();

    const task = await VideoTask.create({
      user: req.user.id,
      originalFilename: originalname,
      inputPath: inputPath,
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
        inputPath: inputPath
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

    const path = require('path');
    const baseName = path.parse(task.originalFilename).name;
    res.download(task.outputPath, `processed_${baseName}.png`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
