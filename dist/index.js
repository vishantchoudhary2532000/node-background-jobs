"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const logger_1 = require("./services/logger");
const cron_1 = require("./jobs/cron");
const connection_1 = require("./queues/connection");
const worker_1 = require("./queues/worker");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});
const server = app.listen(env_1.config.port, () => {
    logger_1.logger.info(`Server listening on port ${env_1.config.port}`);
    // Initialize Cron Jobs
    (0, cron_1.startCronJobs)();
});
// Graceful Shutdown configurations
const shutdown = async (signal) => {
    logger_1.logger.info(`Received ${signal}. Starting graceful shutdown...`);
    try {
        // 1. Stop express server from accepting new requests
        server.close(() => {
            logger_1.logger.info('Express HTTP server closed.');
        });
        // 2. Stop BullMQ Workers so no new jobs are processed
        logger_1.logger.info('Closing background worker...');
        await worker_1.backgroundWorker.close();
        logger_1.logger.info('Background worker closed successfully.');
        // 3. Close redis connection
        logger_1.logger.info('Closing Redis connection...');
        await connection_1.redisConnection.quit();
        logger_1.logger.info('Redis connection closed.');
        logger_1.logger.info('Shutdown complete.');
        process.exit(0);
    }
    catch (err) {
        logger_1.logger.error('Error during shutdown:', err);
        process.exit(1);
    }
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
