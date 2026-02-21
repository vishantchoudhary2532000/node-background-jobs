"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTask = processTask;
const logger_1 = require("../services/logger");
async function processTask(data) {
    logger_1.logger.info(`Starting execution of task with data: ${JSON.stringify(data)}`);
    // Simulate heavy processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Simulate random failure to demonstrate retries
    if (Math.random() < 0.2) {
        throw new Error('Random failure occurred during processing - Retrying...');
    }
    logger_1.logger.info(`Successfully finished executing task`);
}
