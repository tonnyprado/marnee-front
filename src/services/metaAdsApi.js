/**
 * Meta Ads API Service
 * Handles Facebook/Instagram Ads integration via Facebook Marketing API
 *
 * DOCUMENTATION: https://developers.facebook.com/docs/marketing-api
 *
 * Required Permissions:
 * - ads_read
 * - ads_management (if we want to create/edit ads)
 * - business_management
 *
 * Note: User must have Facebook Business Manager access
 */

import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

/**
 * Get Meta Ads connection status
 * Checks if user has connected their Meta Ads account
 *
 * @returns {Promise<Object>} { connected: boolean, account_name?: string, ad_account_id?: string }
 */
export const getMetaAdsStatus = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads status:', error);
    throw error;
  }
};

/**
 * Initiate Meta Ads connection (OAuth)
 * Redirects user to Facebook OAuth page
 *
 * Required scopes:
 * - ads_read
 * - business_management
 */
export const connectMetaAds = () => {
  const redirectTo = encodeURIComponent(window.location.origin + '/app/dashboard?meta_ads_connected=true');
  window.location.href = `${API_BASE_URL}/meta-ads/connect?redirect_to=${redirectTo}`;
};

/**
 * Disconnect Meta Ads account
 *
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export const disconnectMetaAds = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/meta-ads/disconnect`);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting Meta Ads:', error);
    throw error;
  }
};

/**
 * Refresh Meta Ads access token
 * Facebook tokens expire after 60 days
 *
 * @returns {Promise<Object>} { success: boolean, expires_at: string }
 */
export const refreshMetaAdsToken = async () => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/meta-ads/refresh-token`);
    return response.data;
  } catch (error) {
    console.error('Error refreshing Meta Ads token:', error);
    throw error;
  }
};

/**
 * Get Meta Ads overview metrics
 * Summary of all ad performance
 *
 * @param {number} days - Days to look back (default 30)
 * @returns {Promise<Object>} Overview metrics (spend, ROAS, CPC, CPM, etc)
 *
 * Response structure:
 * {
 *   connected: boolean,
 *   account_name: string,
 *   date_range: { start: string, end: string },
 *   metrics: {
 *     total_spend: number,
 *     roas: number,
 *     cpc: number,
 *     cpm: number,
 *     ctr: number,
 *     conversions: number,
 *     impressions: number,
 *     clicks: number
 *   }
 * }
 */
export const getMetaAdsOverview = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/overview`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads overview:', error);
    throw error;
  }
};

/**
 * Get all Meta Ads campaigns
 * List of campaigns with performance metrics
 *
 * @param {number} days - Days to look back (default 30)
 * @param {string} status - Filter by status: 'ACTIVE', 'PAUSED', 'ARCHIVED', 'ALL'
 * @returns {Promise<Array>} Array of campaigns
 *
 * Response structure:
 * {
 *   campaigns: [
 *     {
 *       id: string,
 *       name: string,
 *       status: string,
 *       spend: number,
 *       impressions: number,
 *       clicks: number,
 *       ctr: number,
 *       cpc: number,
 *       roas: number,
 *       conversions: number
 *     }
 *   ]
 * }
 */
export const getMetaAdsCampaigns = async (days = 30, status = 'ALL') => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/campaigns`, {
      params: { days, status }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads campaigns:', error);
    throw error;
  }
};

/**
 * Get campaign details by ID
 *
 * @param {string} campaignId - Facebook Campaign ID
 * @param {number} days - Days to look back (default 30)
 * @returns {Promise<Object>} Campaign details with metrics
 */
export const getMetaAdsCampaign = async (campaignId, days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/campaigns/${campaignId}`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads campaign:', error);
    throw error;
  }
};

/**
 * Get ad sets for a campaign
 *
 * @param {string} campaignId - Facebook Campaign ID
 * @param {number} days - Days to look back (default 30)
 * @returns {Promise<Array>} Array of ad sets
 */
export const getMetaAdsAdSets = async (campaignId, days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/campaigns/${campaignId}/ad-sets`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads ad sets:', error);
    throw error;
  }
};

/**
 * Get ads for an ad set
 *
 * @param {string} adSetId - Facebook Ad Set ID
 * @param {number} days - Days to look back (default 30)
 * @returns {Promise<Array>} Array of ads with creative and performance data
 */
export const getMetaAdsAds = async (adSetId, days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/ad-sets/${adSetId}/ads`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads ads:', error);
    throw error;
  }
};

/**
 * Get audience insights from Meta Ads
 * Demographics, age, gender, location breakdown
 *
 * @param {number} days - Days to look back (default 30)
 * @returns {Promise<Object>} Audience data
 *
 * Response structure:
 * {
 *   age_gender: { '18-24': { male: number, female: number }, ... },
 *   locations: [{ country: string, impressions: number, spend: number }],
 *   devices: [{ device: string, impressions: number, spend: number }],
 *   placements: [{ placement: string, impressions: number, spend: number }]
 * }
 */
export const getMetaAdsAudience = async (days = 30) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/audience`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads audience:', error);
    throw error;
  }
};

/**
 * Get creative performance analysis
 * Which creatives (images/videos) perform best
 *
 * @param {number} days - Days to look back (default 30)
 * @param {number} limit - Number of top creatives to return (default 10)
 * @returns {Promise<Array>} Top performing creatives
 */
export const getMetaAdsCreativePerformance = async (days = 30, limit = 10) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/creative-performance`, {
      params: { days, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads creative performance:', error);
    throw error;
  }
};

/**
 * Get Meta Ads account info
 * Business account details, spend limits, currency, etc
 *
 * @returns {Promise<Object>} Account information
 */
export const getMetaAdsAccount = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/meta-ads/account`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta Ads account:', error);
    throw error;
  }
};

// Export all functions
const metaAdsApi = {
  getMetaAdsStatus,
  connectMetaAds,
  disconnectMetaAds,
  refreshMetaAdsToken,
  getMetaAdsOverview,
  getMetaAdsCampaigns,
  getMetaAdsCampaign,
  getMetaAdsAdSets,
  getMetaAdsAds,
  getMetaAdsAudience,
  getMetaAdsCreativePerformance,
  getMetaAdsAccount,
};

export default metaAdsApi;
