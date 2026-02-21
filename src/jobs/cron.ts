import cron from 'node-cron';
import { addJobToQueue } from '../queues/queue';
import { logger } from '../services/logger';
import { config } from '../config/env';

export function startCronJobs() {
  logger.info(`Initializing cron jobs with schedule: ${config.cronSchedule}`);
  
  cron.schedule(config.cronSchedule, async () => {
    logger.info('[CRON] Executing scheduled routine...');
    let payload = {
      generatedAt: new Date().toISOString(),
      type: 'routine-check'
    };
    
    // Add job to BullMQ queue for processing instead of doing heavy work in the cron directly
    await addJobToQueue('process-task', payload);
  });
}
