import IORedis from 'ioredis';
import { config } from '../config/env';
import { logger } from '../services/logger';

export const redisConnection = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisConnection.on('ready', () => {
  logger.info('Connected to Redis for BullMQ');
});
