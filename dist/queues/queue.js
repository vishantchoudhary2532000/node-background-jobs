"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundQueue = exports.BACKGROUND_JOB_QUEUE = void 0;
exports.addJobToQueue = addJobToQueue;
const bullmq_1 = require("bullmq");
const connection_1 = require("./connection");
const logger_1 = require("../services/logger");
exports.BACKGROUND_JOB_QUEUE = 'BackgroundJobQueue';
exports.backgroundQueue = new bullmq_1.Queue(exports.BACKGROUND_JOB_QUEUE, {
    connection: connection_1.redisConnection,
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
async function addJobToQueue(jobName, payload) {
    try {
        const job = await exports.backgroundQueue.add(jobName, payload);
        logger_1.logger.info(`Job added to queue: ${job.id} | Name: ${jobName}`);
        return job;
    }
    catch (error) {
        logger_1.logger.error('Failed to add job to queue:', error);
        throw error;
    }
}
