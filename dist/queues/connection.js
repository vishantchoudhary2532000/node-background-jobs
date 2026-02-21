"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const logger_1 = require("../services/logger");
exports.redisConnection = new ioredis_1.default({
    host: env_1.config.redis.host,
    port: env_1.config.redis.port,
    maxRetriesPerRequest: null,
});
exports.redisConnection.on('error', (err) => {
    logger_1.logger.error('Redis connection error:', err);
});
exports.redisConnection.on('ready', () => {
    logger_1.logger.info('Connected to Redis for BullMQ');
});
