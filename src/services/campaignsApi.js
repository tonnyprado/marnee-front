/**
 * Campaigns API Service
 * All campaign-related API endpoints
 */

/**
 * Helper to get auth header from localStorage
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Helper to make API requests with proper error handling
 */
const request = async (endpoint, options = {}) => {
  const baseUrl = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000';
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// =====================
// CAMPAIGNS ENDPOINTS
// =====================

/**
 * POST /campaigns - Create campaign manually
 */
export const createCampaign = (data) =>
  request('/api/v1/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * POST /campaigns/generate - Generate campaigns with AI
 */
export const generateCampaigns = ({ founderId, sessionId, calendarId, count = 3 }) =>
  request('/api/v1/campaigns/generate', {
    method: 'POST',
    body: JSON.stringify({
      founderId,
      sessionId,
      calendarId,
      count,
    }),
  });

/**
 * GET /campaigns/calendar/{calendarId} - Get all campaigns for a calendar
 */
export const getCampaignsByCalendar = (calendarId) =>
  request(`/api/v1/campaigns/calendar/${calendarId}`);

/**
 * GET /campaigns/{campaignId} - Get single campaign with tasks/scripts
 */
export const getCampaign = (campaignId) =>
  request(`/api/v1/campaigns/${campaignId}`);

/**
 * PUT /campaigns/{campaignId} - Update campaign
 */
export const updateCampaign = (campaignId, data) =>
  request(`/api/v1/campaigns/${campaignId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * DELETE /campaigns/{campaignId} - Delete campaign
 */
export const deleteCampaign = (campaignId) =>
  request(`/api/v1/campaigns/${campaignId}`, {
    method: 'DELETE',
  });

/**
 * POST /campaigns/{campaignId}/regenerate-suggestions - Regenerate AI suggestions
 */
export const regenerateCampaignSuggestions = (campaignId) =>
  request(`/api/v1/campaigns/${campaignId}/regenerate-suggestions`, {
    method: 'POST',
  });

// =====================
// CAMPAIGN TASKS
// =====================

/**
 * POST /campaigns/{campaignId}/tasks - Create task
 */
export const createCampaignTask = (campaignId, data) =>
  request(`/api/v1/campaigns/${campaignId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * PUT /campaigns/tasks/{taskId} - Update task
 */
export const updateCampaignTask = (taskId, data) =>
  request(`/api/v1/campaigns/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * DELETE /campaigns/tasks/{taskId} - Delete task
 */
export const deleteCampaignTask = (taskId) =>
  request(`/api/v1/campaigns/tasks/${taskId}`, {
    method: 'DELETE',
  });

// =====================
// CAMPAIGN SCRIPTS
// =====================

/**
 * POST /campaigns/{campaignId}/scripts - Create script
 */
export const createCampaignScript = (campaignId, data) =>
  request(`/api/v1/campaigns/${campaignId}/scripts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * PUT /campaigns/scripts/{scriptId} - Update script
 */
export const updateCampaignScript = (scriptId, data) =>
  request(`/api/v1/campaigns/scripts/${scriptId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * DELETE /campaigns/scripts/{scriptId} - Delete script
 */
export const deleteCampaignScript = (scriptId) =>
  request(`/api/v1/campaigns/scripts/${scriptId}`, {
    method: 'DELETE',
  });

const campaignsApi = {
  createCampaign,
  generateCampaigns,
  getCampaignsByCalendar,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  regenerateCampaignSuggestions,
  createCampaignTask,
  updateCampaignTask,
  deleteCampaignTask,
  createCampaignScript,
  updateCampaignScript,
  deleteCampaignScript,
};

export default campaignsApi;
