import express from 'express';
import { config } from './config/env';
import { logger } from './services/logger';
import { startCronJobs } from './jobs/cron';
import { redisConnection } from './queues/connection';
import { backgroundWorker } from './queues/worker';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
  
  // Initialize Cron Jobs
  startCronJobs();
});

// Graceful Shutdown configurations
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // 1. Stop express server from accepting new requests
    server.close(() => {
      logger.info('Express HTTP server closed.');
    });

    // 2. Stop BullMQ Workers so no new jobs are processed
    logger.info('Closing background worker...');
    await backgroundWorker.close();
    logger.info('Background worker closed successfully.');

    // 3. Close redis connection
    logger.info('Closing Redis connection...');
    await redisConnection.quit();
    logger.info('Redis connection closed.');

    logger.info('Shutdown complete.');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
