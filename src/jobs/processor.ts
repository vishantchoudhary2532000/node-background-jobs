import { logger } from '../services/logger';

export async function processTask(data: any): Promise<void> {
  logger.info(`Starting execution of task with data: ${JSON.stringify(data)}`);
  
  // Simulate heavy processing
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  // Simulate random failure to demonstrate retries
  if (Math.random() < 0.2) {
    throw new Error('Random failure occurred during processing - Retrying...');
  }
  
  logger.info(`Successfully finished executing task`);
}
