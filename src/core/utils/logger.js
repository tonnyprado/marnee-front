/**
 * Logger Utility
 *
 * Centralized logging system with:
 * - Multiple log levels (debug, info, warn, error)
 * - Namespace/context support for better filtering
 * - Production/development awareness
 * - Easy to extend for external logging services (Sentry, LogRocket, etc.)
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

class Logger {
  constructor() {
    // Set level based on environment
    // In production, only show warnings and errors
    this.level = process.env.NODE_ENV === 'production'
      ? LOG_LEVELS.WARN
      : LOG_LEVELS.DEBUG;

    this.enableTimestamps = true;
    this.enableContext = true;
  }

  /**
   * Set minimum log level
   * @param {string} level - 'debug', 'info', 'warn', 'error', 'none'
   */
  setLevel(level) {
    const upperLevel = level.toUpperCase();
    if (LOG_LEVELS[upperLevel] !== undefined) {
      this.level = LOG_LEVELS[upperLevel];
    }
  }

  /**
   * Get current timestamp string
   * @returns {string}
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message with context and timestamp
   * @param {string} context - Log context/namespace
   * @param {string} message - Log message
   * @returns {string}
   */
  formatMessage(context, message) {
    const parts = [];

    if (this.enableTimestamps) {
      parts.push(`[${this.getTimestamp()}]`);
    }

    if (this.enableContext && context) {
      parts.push(`[${context}]`);
    }

    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Log debug message
   * @param {string} context - Context/namespace
   * @param {string} message - Message
   * @param {...any} args - Additional arguments
   */
  debug(context, message, ...args) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.debug(this.formatMessage(context, message), ...args);
    }
  }

  /**
   * Log info message
   * @param {string} context - Context/namespace
   * @param {string} message - Message
   * @param {...any} args - Additional arguments
   */
  info(context, message, ...args) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(this.formatMessage(context, message), ...args);
    }
  }

  /**
   * Log warning message
   * @param {string} context - Context/namespace
   * @param {string} message - Message
   * @param {...any} args - Additional arguments
   */
  warn(context, message, ...args) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage(context, message), ...args);
    }
  }

  /**
   * Log error message
   * @param {string} context - Context/namespace
   * @param {string} message - Message
   * @param {...any} args - Additional arguments (error objects, stack traces, etc.)
   */
  error(context, message, ...args) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage(context, message), ...args);
    }
  }

  /**
   * Create a contextual logger with pre-set context
   * Useful for class-based logging
   *
   * @param {string} context - Default context
   * @returns {Object} Contextual logger
   *
   * @example
   * const log = logger.createContextLogger('ApiClient');
   * log.debug('Making request', { url: '/api/users' });
   * log.error('Request failed', error);
   */
  createContextLogger(context) {
    return {
      debug: (message, ...args) => this.debug(context, message, ...args),
      info: (message, ...args) => this.info(context, message, ...args),
      warn: (message, ...args) => this.warn(context, message, ...args),
      error: (message, ...args) => this.error(context, message, ...args),
    };
  }

  /**
   * Group logs together (for complex operations)
   * @param {string} label - Group label
   */
  group(label) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.group(label);
    }
  }

  /**
   * End log group
   */
  groupEnd() {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.groupEnd();
    }
  }

  /**
   * Log table (useful for arrays of objects)
   * @param {Array|Object} data - Data to display as table
   */
  table(data) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.table(data);
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Export both class and instance
export { Logger, LOG_LEVELS };
export default logger;
