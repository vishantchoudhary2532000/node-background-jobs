import { Worker, Job } from 'bullmq';
import { BACKGROUND_JOB_QUEUE } from './queue';
import { redisConnection } from './connection';
import { logger } from '../services/logger';
import { processTask } from '../jobs/processor';

export const backgroundWorker = new Worker(
  BACKGROUND_JOB_QUEUE,
  async (job: Job) => {
    logger.info(`[WORKER] Processing job ${job.id} of type ${job.name}`);
    
    if (job.name === 'process-task') {
      await processTask(job.data);
    } else {
      logger.warn(`[WORKER] Unknown job name: ${job.name}`);
    }
  },
  { connection: redisConnection as any }
);

backgroundWorker.on('completed', (job) => {
  logger.info(`[WORKER] Job ${job.id} has completed!`);
});

backgroundWorker.on('failed', (job, err) => {
  logger.error(`[WORKER] Job ${job?.id} has failed with error: ${err.message}`);
});

backgroundWorker.on('error', (err) => {
  logger.error(`[WORKER Error] ${err.message}`);
});
