// src/services/facebookPixel.js

/**
 * Facebook Pixel Service
 *
 * Provides a centralized API for tracking events with Facebook Pixel
 * The pixel script is loaded in public/index.html
 *
 * Pixel ID: 1750003469491396
 */

/**
 * Check if Facebook Pixel is loaded
 */
const isPixelLoaded = () => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

/**
 * Track a standard Facebook event
 * @param {string} eventName - Standard event name (e.g., 'Purchase', 'Lead', 'CompleteRegistration')
 * @param {Object} params - Event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (isPixelLoaded()) {
    window.fbq('track', eventName, params);
    console.log('[FB Pixel] Event tracked:', eventName, params);
  } else {
    console.warn('[FB Pixel] Pixel not loaded, event not tracked:', eventName);
  }
};

/**
 * Track a custom Facebook event
 * @param {string} eventName - Custom event name
 * @param {Object} params - Event parameters
 */
export const trackCustomEvent = (eventName, params = {}) => {
  if (isPixelLoaded()) {
    window.fbq('trackCustom', eventName, params);
    console.log('[FB Pixel] Custom event tracked:', eventName, params);
  } else {
    console.warn('[FB Pixel] Pixel not loaded, custom event not tracked:', eventName);
  }
};

/**
 * Track page view (already tracked automatically on page load)
 */
export const trackPageView = () => {
  if (isPixelLoaded()) {
    window.fbq('track', 'PageView');
    console.log('[FB Pixel] PageView tracked');
  }
};

// ============================================
// Standard Facebook Events (Pre-defined)
// ============================================

/**
 * Track user registration/signup
 * @param {Object} params - User data (optional)
 */
export const trackCompleteRegistration = (params = {}) => {
  trackEvent('CompleteRegistration', {
    content_name: 'User Registration',
    status: 'completed',
    ...params
  });
};

/**
 * Track user login
 */
export const trackLogin = () => {
  trackCustomEvent('Login', {
    content_name: 'User Login'
  });
};

/**
 * Track when user starts a trial
 * @param {string} plan - Plan name
 * @param {number} value - Trial value
 */
export const trackStartTrial = (plan = 'free', value = 0) => {
  trackEvent('StartTrial', {
    content_name: plan,
    value: value,
    currency: 'USD'
  });
};

/**
 * Track subscription/purchase
 * @param {string} plan - Plan name
 * @param {number} value - Purchase value
 * @param {string} currency - Currency code
 */
export const trackPurchase = (plan, value, currency = 'USD') => {
  trackEvent('Purchase', {
    content_name: plan,
    value: value,
    currency: currency
  });
};

/**
 * Track when user subscribes
 * @param {string} plan - Plan name
 * @param {number} value - Subscription value
 */
export const trackSubscribe = (plan, value) => {
  trackEvent('Subscribe', {
    content_name: plan,
    value: value,
    currency: 'USD'
  });
};

/**
 * Track lead generation (e.g., contact form submission)
 * @param {Object} params - Lead data
 */
export const trackLead = (params = {}) => {
  trackEvent('Lead', {
    content_name: 'Lead Form',
    ...params
  });
};

/**
 * Track when user initiates checkout
 * @param {string} plan - Plan name
 * @param {number} value - Checkout value
 */
export const trackInitiateCheckout = (plan, value) => {
  trackEvent('InitiateCheckout', {
    content_name: plan,
    value: value,
    currency: 'USD'
  });
};

/**
 * Track when user adds payment info
 */
export const trackAddPaymentInfo = () => {
  trackEvent('AddPaymentInfo', {
    content_name: 'Payment Information Added'
  });
};

/**
 * Track content view
 * @param {string} contentName - Name of content viewed
 * @param {string} contentType - Type of content
 */
export const trackViewContent = (contentName, contentType = 'page') => {
  trackEvent('ViewContent', {
    content_name: contentName,
    content_type: contentType
  });
};

/**
 * Track search
 * @param {string} searchQuery - Search query string
 */
export const trackSearch = (searchQuery) => {
  trackEvent('Search', {
    search_string: searchQuery
  });
};

// ============================================
// Custom Marnee Events
// ============================================

/**
 * Track when user connects a social media account
 * @param {string} platform - Platform name (instagram, youtube, tiktok, etc.)
 */
export const trackSocialConnect = (platform) => {
  trackCustomEvent('SocialAccountConnected', {
    platform: platform,
    content_name: `${platform} Connected`
  });
};

/**
 * Track when user disconnects a social media account
 * @param {string} platform - Platform name
 */
export const trackSocialDisconnect = (platform) => {
  trackCustomEvent('SocialAccountDisconnected', {
    platform: platform,
    content_name: `${platform} Disconnected`
  });
};

/**
 * Track when user generates AI content
 * @param {string} contentType - Type of content generated
 */
export const trackAIContentGeneration = (contentType) => {
  trackCustomEvent('AIContentGenerated', {
    content_type: contentType,
    content_name: `AI ${contentType} Generated`
  });
};

/**
 * Track when user completes brand test
 */
export const trackBrandTestComplete = (score) => {
  trackCustomEvent('BrandTestCompleted', {
    content_name: 'Brand Test Completed',
    score: score
  });
};

/**
 * Track when user starts brand test
 */
export const trackBrandTestStart = () => {
  trackCustomEvent('BrandTestStarted', {
    content_name: 'Brand Test Started'
  });
};

/**
 * Track when user exports content
 * @param {string} format - Export format
 */
export const trackContentExport = (format) => {
  trackCustomEvent('ContentExported', {
    content_name: 'Content Exported',
    format: format
  });
};

/**
 * Track when user shares content
 * @param {string} platform - Platform shared to
 */
export const trackContentShare = (platform) => {
  trackCustomEvent('ContentShared', {
    content_name: 'Content Shared',
    platform: platform
  });
};

/**
 * Track when user saves/favorites content
 */
export const trackContentSave = () => {
  trackCustomEvent('ContentSaved', {
    content_name: 'Content Saved to Favorites'
  });
};

/**
 * Track chat message sent
 */
export const trackChatMessage = () => {
  trackCustomEvent('ChatMessageSent', {
    content_name: 'AI Chat Message'
  });
};

/**
 * Track when user views analytics/insights
 * @param {string} platform - Platform analytics viewed
 */
export const trackAnalyticsView = (platform) => {
  trackCustomEvent('AnalyticsViewed', {
    content_name: 'Analytics Viewed',
    platform: platform
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  trackEvent,
  trackCustomEvent,
  trackPageView,
  trackCompleteRegistration,
  trackLogin,
  trackStartTrial,
  trackPurchase,
  trackSubscribe,
  trackLead,
  trackInitiateCheckout,
  trackAddPaymentInfo,
  trackViewContent,
  trackSearch,
  trackSocialConnect,
  trackSocialDisconnect,
  trackAIContentGeneration,
  trackBrandTestComplete,
  trackBrandTestStart,
  trackContentExport,
  trackContentShare,
  trackContentSave,
  trackChatMessage,
  trackAnalyticsView
};
