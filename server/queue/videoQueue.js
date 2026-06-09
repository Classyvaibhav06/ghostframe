const axios = require('axios');
const VideoTask = require('../models/VideoTask');

const { Queue, Worker } = require('bullmq');

let globalIo = null;

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
};

const videoQueue = new Queue('video', { connection });

const initWorker = (io) => {
  globalIo = io;
};

// Create a worker with concurrency strictly limited to 1
const worker = new Worker('video', async job => {
  await processJob(job.data);
}, { 
  connection,
  concurrency: 1 
});

worker.on('failed', (job, err) => {
  console.error(`${job.id} has failed with ${err.message}`);
});

async function processJob(data) {
  const { taskId, inputPath, filename } = data;
  const taskIdStr = taskId.toString();
  
  await VideoTask.findByIdAndUpdate(taskId, { status: 'processing' });
  if (globalIo) globalIo.to(taskIdStr).emit('status_update', { status: 'processing', progress: 0 });

  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const response = await axios.post(`${aiServiceUrl}/process`, {
      taskId: taskIdStr,
      inputPath,
      filename
    });

    const { outputPath } = response.data;

    await VideoTask.findByIdAndUpdate(taskId, { 
      status: 'completed', 
      progress: 100,
      outputPath,
      completedAt: Date.now()
    });

    if (globalIo) globalIo.to(taskIdStr).emit('status_update', { status: 'completed', progress: 100, outputPath });
    
  } catch (error) {
    console.error(`Error processing job for task ${taskId}:`, error.message);
    await VideoTask.findByIdAndUpdate(taskId, { 
      status: 'failed', 
      errorMessage: error.message
    });
    if (globalIo) globalIo.to(taskIdStr).emit('status_update', { status: 'failed', errorMessage: error.message });
  }
}

module.exports = { videoQueue, initWorker };
