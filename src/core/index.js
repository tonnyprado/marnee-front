/**
 * Core Module Exports
 *
 * Central export point for all core utilities and services.
 * Makes imports cleaner throughout the application.
 *
 * @example
 * import { storage, apiClient, logger } from '@/core';
 * import { getAuthSession, isAuthenticated } from '@/core';
 */

// Services
export { default as storage, StorageService } from './services/StorageService';
export { default as apiClient, ApiClient } from './services/ApiClient';
export { default as errorHandler, ErrorHandler, ErrorTypes, AppError } from './services/ErrorHandler';

// Utils
export { default as logger, Logger, LOG_LEVELS } from './utils/logger';
export * from './utils/auth';
export * from './utils/transformers';
