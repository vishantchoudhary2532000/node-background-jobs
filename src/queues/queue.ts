import { Queue } from 'bullmq';
import { redisConnection } from './connection';
import { logger } from '../services/logger';

export const BACKGROUND_JOB_QUEUE = 'BackgroundJobQueue';

export const backgroundQueue = new Queue(BACKGROUND_JOB_QUEUE, {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 1000, 
  },
});

export async function addJobToQueue(jobName: string, payload: any) {
  try {
    const job = await backgroundQueue.add(jobName, payload);
    logger.info(`Job added to queue: ${job.id} | Name: ${jobName}`);
    return job;
  } catch (error) {
    logger.error('Failed to add job to queue:', error);
    throw error;
  }
}
