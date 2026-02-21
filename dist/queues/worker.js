"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundWorker = void 0;
const bullmq_1 = require("bullmq");
const queue_1 = require("./queue");
const connection_1 = require("./connection");
const logger_1 = require("../services/logger");
const processor_1 = require("../jobs/processor");
exports.backgroundWorker = new bullmq_1.Worker(queue_1.BACKGROUND_JOB_QUEUE, async (job) => {
    logger_1.logger.info(`[WORKER] Processing job ${job.id} of type ${job.name}`);
    if (job.name === 'process-task') {
        await (0, processor_1.processTask)(job.data);
    }
    else {
        logger_1.logger.warn(`[WORKER] Unknown job name: ${job.name}`);
    }
}, { connection: connection_1.redisConnection });
exports.backgroundWorker.on('completed', (job) => {
    logger_1.logger.info(`[WORKER] Job ${job.id} has completed!`);
});
exports.backgroundWorker.on('failed', (job, err) => {
    logger_1.logger.error(`[WORKER] Job ${job?.id} has failed with error: ${err.message}`);
});
exports.backgroundWorker.on('error', (err) => {
    logger_1.logger.error(`[WORKER Error] ${err.message}`);
});
