const { BatchClient, SubmitJobCommand } = require('@aws-sdk/client-batch');
const VideoTask = require('../models/VideoTask');
const { Queue, Worker } = require('bullmq');

let globalIo = null;

// ── Redis connection (still used for DB state tracking) ──────────────────
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
};

// ── AWS Batch Client (replaces local Flask processing) ────────────────────────
const batchClient = new BatchClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BATCH_JOB_QUEUE = process.env.BATCH_JOB_QUEUE || 'ghostframe-job-queue';
const BATCH_JOB_DEFINITION = process.env.BATCH_JOB_DEFINITION || 'ghostframe-ai-job';
const BATCH_CALLBACK_SECRET = process.env.BATCH_CALLBACK_SECRET || 'fallback_secret';

// ── BullMQ Queue (still used to track jobs in DB) ────────────────────────────
const videoQueue = new Queue('video', { connection });

const initWorker = (io) => {
  globalIo = io;
};

/**
 * Submit a VIDEO job to AWS Batch → triggers ECS Fargate.
 * This completely offloads video processing from the EC2 instance.
 */
async function submitVideoToBatch(taskId, inputPath) {
  const nodeApiUrl = process.env.NODE_API_URL || `http://${process.env.EC2_PUBLIC_IP || 'localhost'}:5000`;

  const command = new SubmitJobCommand({
    jobName: `video-${taskId}`,
    jobQueue: BATCH_JOB_QUEUE,
    jobDefinition: BATCH_JOB_DEFINITION,
    containerOverrides: {
      environment: [
        { name: 'TASK_ID', value: taskId.toString() },
        { name: 'S3_INPUT_KEY', value: inputPath },
        { name: 'MEDIA_TYPE', value: 'video' },
        { name: 'NODE_API_URL', value: nodeApiUrl },
        { name: 'S3_BUCKET_NAME', value: process.env.S3_BUCKET_NAME }
      ]
    }
  });

  const result = await batchClient.send(command);
  console.log(`[Batch] Submitted video job ${taskId} → JobId: ${result.jobId}`);
  return result.jobId;
}

/**
 * BullMQ Worker — handles the queue job by:
 * 1. Marking the task as 'processing' in MongoDB
 * 2. Sending the real work to AWS Batch (Fargate)
 * 
 * The actual completion is handled by the /api/video/batch-complete webhook
 * which the Fargate container calls when done.
 */
const worker = new Worker('video', async job => {
  const { taskId, inputPath } = job.data;
  const taskIdStr = taskId.toString();

  // Mark as processing in DB + notify frontend
  await VideoTask.findByIdAndUpdate(taskId, { status: 'processing' });
  if (globalIo) {
    globalIo.to(taskIdStr).emit('status_update', { status: 'processing', progress: 0 });
  }

  try {
    // Submit the actual heavy lifting to AWS Batch
    await submitVideoToBatch(taskId, inputPath);
    console.log(`[Queue] Video job ${taskId} handed off to AWS Batch.`);

    // Note: we do NOT wait for completion here.
    // The Fargate container will POST to /api/video/batch-complete when done.

  } catch (error) {
    console.error(`[Queue] Failed to submit job ${taskId} to SQS:`, error.message);
    await VideoTask.findByIdAndUpdate(taskId, {
      status: 'failed',
      errorMessage: `Failed to submit to processing queue: ${error.message}`
    });
    if (globalIo) {
      globalIo.to(taskIdStr).emit('status_update', {
        status: 'failed',
        errorMessage: error.message
      });
    }
  }
}, {
  connection,
  concurrency: 10 // Can now handle many jobs at once since Fargate does the real work
});

worker.on('failed', (job, err) => {
  console.error(`[Queue Worker] Job ${job.id} failed: ${err.message}`);
});

module.exports = { videoQueue, initWorker };
