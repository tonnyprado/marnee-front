/**
 * Campaigns API Service - Refactored
 *
 * BEFORE: 200 lines with duplicated auth/request logic
 * AFTER: 50 lines using unified ApiClient
 */

import apiClient from '../core/services/ApiClient';
import API from '../config';

// =====================
// CAMPAIGNS ENDPOINTS
// =====================

export const createCampaign = (data) =>
  apiClient.post('/campaigns', data, {
    baseUrl: API.MARNEE,
  });

export const generateCampaigns = ({ founderId, sessionId, calendarId, count = 3 }) =>
  apiClient.post('/campaigns/generate', {
    founderId,
    sessionId,
    calendarId,
    count,
  }, {
    baseUrl: API.MARNEE,
  });

export const getCampaignsByCalendar = (calendarId) =>
  apiClient.get(`/campaigns/calendar/${calendarId}`, {
    baseUrl: API.MARNEE,
  });

export const getCampaign = (campaignId) =>
  apiClient.get(`/campaigns/${campaignId}`, {
    baseUrl: API.MARNEE,
  });

export const updateCampaign = (campaignId, data) =>
  apiClient.put(`/campaigns/${campaignId}`, data, {
    baseUrl: API.MARNEE,
  });

export const deleteCampaign = (campaignId) =>
  apiClient.delete(`/campaigns/${campaignId}`, {
    baseUrl: API.MARNEE,
  });

export const regenerateCampaignSuggestions = (campaignId) =>
  apiClient.post(`/campaigns/${campaignId}/regenerate-suggestions`, null, {
    baseUrl: API.MARNEE,
  });

// =====================
// CAMPAIGN TASKS
// =====================

export const createCampaignTask = (campaignId, data) =>
  apiClient.post(`/campaigns/${campaignId}/tasks`, data, {
    baseUrl: API.MARNEE,
  });

export const updateCampaignTask = (taskId, data) =>
  apiClient.put(`/campaigns/tasks/${taskId}`, data, {
    baseUrl: API.MARNEE,
  });

export const deleteCampaignTask = (taskId) =>
  apiClient.delete(`/campaigns/tasks/${taskId}`, {
    baseUrl: API.MARNEE,
  });

// =====================
// CAMPAIGN SCRIPTS
// =====================

export const createCampaignScript = (campaignId, data) =>
  apiClient.post(`/campaigns/${campaignId}/scripts`, data, {
    baseUrl: API.MARNEE,
  });

export const updateCampaignScript = (scriptId, data) =>
  apiClient.put(`/campaigns/scripts/${scriptId}`, data, {
    baseUrl: API.MARNEE,
  });

export const deleteCampaignScript = (scriptId) =>
  apiClient.delete(`/campaigns/scripts/${scriptId}`, {
    baseUrl: API.MARNEE,
  });

// Default export
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
