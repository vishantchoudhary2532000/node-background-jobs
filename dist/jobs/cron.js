"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = startCronJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const queue_1 = require("../queues/queue");
const logger_1 = require("../services/logger");
const env_1 = require("../config/env");
function startCronJobs() {
    logger_1.logger.info(`Initializing cron jobs with schedule: ${env_1.config.cronSchedule}`);
    node_cron_1.default.schedule(env_1.config.cronSchedule, async () => {
        logger_1.logger.info('[CRON] Executing scheduled routine...');
        let payload = {
            generatedAt: new Date().toISOString(),
            type: 'routine-check'
        };
        // Add job to BullMQ queue for processing instead of doing heavy work in the cron directly
        await (0, queue_1.addJobToQueue)('process-task', payload);
    });
}
