/**
 * ErrorHandler Service
 *
 * Centralized error handling for the entire application.
 * Handles HTTP errors, network errors, authentication errors, and more.
 *
 * Features:
 * - Categorized error types
 * - Global error event emission
 * - Automatic authentication error handling
 * - User-friendly error messages
 * - Integration with logging system
 */

import logger from '../utils/logger';

const log = logger.createContextLogger('ErrorHandler');

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Custom error class with additional metadata
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, statusCode = null, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * ErrorHandler class
 */
class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.authErrorCallback = null;
  }

  /**
   * Set callback for authentication errors
   * @param {Function} callback - Function to call when auth error occurs
   */
  setAuthErrorCallback(callback) {
    this.authErrorCallback = callback;
  }

  /**
   * Emit global error event
   * @param {string} message - Error message to display to user
   * @param {Object} details - Additional error details
   */
  emitGlobalError(message, details = {}) {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent('app-error', {
      detail: { message, ...details }
    });

    window.dispatchEvent(event);
    log.error('Global error emitted', { message, details });
  }

  /**
   * Emit global logout event
   */
  emitGlobalLogout() {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent('app-logout');
    window.dispatchEvent(event);
    log.info('Global logout emitted');
  }

  /**
   * Redirect to authentication page
   */
  redirectToAuth() {
    if (typeof window === 'undefined') return;

    if (window.location.pathname !== '/auth') {
      log.info('Redirecting to auth page');
      window.location.href = '/auth';
    }
  }

  /**
   * Handle authentication error
   * @param {string} message - Error message
   */
  handleAuthError(message = 'Tu sesión expiró o no es válida. Vuelve a iniciar sesión.') {
    log.warn('Authentication error', { message });

    this.emitGlobalError(message);
    this.emitGlobalLogout();

    // Call custom callback if set
    if (this.authErrorCallback) {
      try {
        this.authErrorCallback();
      } catch (error) {
        log.error('Error in auth error callback', error);
      }
    }

    this.redirectToAuth();
  }

  /**
   * Determine error type from HTTP status code
   * @param {number} status - HTTP status code
   * @returns {string} Error type
   */
  getErrorTypeFromStatus(status) {
    if (status === 401 || status === 403) {
      return ErrorTypes.AUTH;
    }
    if (status === 404) {
      return ErrorTypes.NOT_FOUND;
    }
    if (status === 400 || status === 422) {
      return ErrorTypes.VALIDATION;
    }
    if (status >= 500) {
      return ErrorTypes.SERVER;
    }
    return ErrorTypes.UNKNOWN;
  }

  /**
   * Get user-friendly error message from status code
   * @param {number} status - HTTP status code
   * @param {string} defaultMessage - Default message if no specific one exists
   * @returns {string}
   */
  getUserFriendlyMessage(status, defaultMessage = 'Ocurrió un error. Inténtalo de nuevo.') {
    const messages = {
      400: 'La solicitud no es válida. Verifica los datos e inténtalo de nuevo.',
      401: 'Tu sesión expiró. Inicia sesión de nuevo.',
      403: 'No tienes permiso para realizar esta acción.',
      404: 'No se encontró el recurso solicitado.',
      422: 'Los datos proporcionados no son válidos.',
      500: 'Error del servidor. Inténtalo más tarde.',
      503: 'El servicio no está disponible. Inténtalo más tarde.',
    };

    return messages[status] || defaultMessage;
  }

  /**
   * Parse error response from API
   * @param {Response} response - Fetch response object
   * @returns {Promise<Object>} Parsed error object
   */
  async parseErrorResponse(response) {
    try {
      const text = await response.text();
      if (!text) {
        return {
          message: this.getUserFriendlyMessage(response.status),
          detail: null
        };
      }

      try {
        const json = JSON.parse(text);
        return {
          message: json.message || json.detail || json.error || this.getUserFriendlyMessage(response.status),
          detail: json.detail || null,
          ...json
        };
      } catch {
        return {
          message: text,
          detail: null
        };
      }
    } catch {
      return {
        message: this.getUserFriendlyMessage(response.status),
        detail: null
      };
    }
  }

  /**
   * Handle HTTP error response
   * @param {Response} response - Fetch response object
   * @param {Object} options - Additional options
   * @returns {Promise<AppError>} AppError instance
   */
  async handleHttpError(response, options = {}) {
    const { debug = false, url = '' } = options;

    const errorBody = await this.parseErrorResponse(response);
    const errorType = this.getErrorTypeFromStatus(response.status);
    const message = errorBody.message;

    if (debug) {
      log.error('HTTP Error', {
        url,
        status: response.status,
        body: errorBody,
      });
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      this.handleAuthError(message);
    }

    const error = new AppError(
      message,
      errorType,
      response.status,
      errorBody
    );

    return error;
  }

  /**
   * Handle network error (no response from server)
   * @param {Error} error - Original error
   * @returns {AppError}
   */
  handleNetworkError(error) {
    log.error('Network error', error);

    const message = 'Error de conexión. Verifica tu conexión a internet.';

    this.emitGlobalError(message);

    return new AppError(
      message,
      ErrorTypes.NETWORK,
      null,
      error
    );
  }

  /**
   * Handle generic error
   * @param {Error} error - Original error
   * @param {string} context - Context where error occurred
   * @returns {AppError}
   */
  handleGenericError(error, context = 'Unknown') {
    log.error(`Error in ${context}`, error);

    const message = error.message || 'Ocurrió un error inesperado.';

    return new AppError(
      message,
      ErrorTypes.UNKNOWN,
      null,
      error
    );
  }

  /**
   * Add error listener
   * @param {Function} listener - Error listener function
   */
  addErrorListener(listener) {
    this.errorListeners.push(listener);
  }

  /**
   * Remove error listener
   * @param {Function} listener - Error listener function
   */
  removeErrorListener(listener) {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  /**
   * Notify all error listeners
   * @param {AppError} error - Error to notify about
   */
  notifyListeners(error) {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        log.error('Error in error listener', err);
      }
    });
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export both class and instance
export { ErrorHandler };
export default errorHandler;
