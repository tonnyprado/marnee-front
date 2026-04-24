/**
 * Data Transformers
 *
 * Centralized data transformation utilities.
 * Handles conversion between API format and UI format.
 *
 * This removes transformation logic from components and makes it reusable.
 */

import logger from './logger';

const log = logger.createContextLogger('Transformers');

/**
 * Generate unique ID for UI elements
 * @returns {string} Unique ID
 */
export function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Transform backend message to UI message format
 *
 * @param {Object} message - Backend message object
 * @param {string} message.id - Message ID
 * @param {string} message.role - Message role ('user' or 'assistant')
 * @param {string} message.content - Message content
 * @param {string} message.createdAt - ISO timestamp
 * @param {number} message.step - Current step
 * @param {string} message.stepName - Step name
 * @param {Object} message.primaryAction - Primary action
 * @param {Array} message.uiActions - UI actions
 * @returns {Object} UI message object
 */
export function transformMessageToUI(message) {
  return {
    id: message.id || generateUniqueId(),
    from: message.role === 'assistant' ? 'ai' : 'user',
    text: message.content,
    timestamp: message.createdAt || new Date().toISOString(),
    step: message.step || null,
    stepName: message.stepName || null,
    primaryAction: message.primaryAction || null,
    uiActions: message.uiActions || [],
    needsApproval: message.needsApproval || false,
  };
}

/**
 * Transform UI message to API format
 *
 * @param {Object} message - UI message object
 * @param {string} message.from - 'user' or 'ai'
 * @param {string} message.text - Message text
 * @returns {Object} API message object
 */
export function transformMessageToAPI(message) {
  return {
    role: message.from === 'ai' ? 'assistant' : 'user',
    content: message.text,
  };
}

/**
 * Transform array of messages to UI format
 * @param {Array} messages - Array of backend messages
 * @returns {Array} Array of UI messages
 */
export function transformMessagesToUI(messages) {
  if (!Array.isArray(messages)) {
    log.warn('transformMessagesToUI received non-array', typeof messages);
    return [];
  }

  return messages.map(transformMessageToUI);
}

/**
 * Transform array of messages to API format
 * @param {Array} messages - Array of UI messages
 * @returns {Array} Array of API messages
 */
export function transformMessagesToAPI(messages) {
  if (!Array.isArray(messages)) {
    log.warn('transformMessagesToAPI received non-array', typeof messages);
    return [];
  }

  return messages.map(transformMessageToAPI);
}

/**
 * Transform backend conversation to UI format
 *
 * @param {Object} conversation - Backend conversation object
 * @returns {Object} UI conversation object
 */
export function transformConversationToUI(conversation) {
  return {
    id: conversation.id,
    title: conversation.title || 'Untitled Conversation',
    founderId: conversation.founderId,
    sessionId: conversation.sessionId,
    messages: transformMessagesToUI(conversation.messages || []),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}

/**
 * Safe date formatter
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat('es-ES', defaultOptions).format(dateObj);
  } catch (error) {
    log.error('Error formatting date', error);
    return 'Invalid date';
  }
}

/**
 * Safe time formatter
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Safe datetime formatter
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(date) {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffMs = now - dateObj;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'Ahora mismo';
    } else if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    log.error('Error getting relative time', error);
    return 'Invalid date';
  }
}

/**
 * Sanitize user input (prevent XSS)
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string (with or without '?')
 * @returns {Object} Parsed query object
 */
export function parseQueryString(queryString) {
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const params = new URLSearchParams(query);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string (without '?')
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value);
    }
  });

  return searchParams.toString();
}

/**
 * Deep clone object (simple implementation)
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    log.error('Error deep cloning object', error);
    return obj;
  }
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export function isEmpty(obj) {
  if (obj === null || obj === undefined) {
    return true;
  }

  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }

  return false;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
