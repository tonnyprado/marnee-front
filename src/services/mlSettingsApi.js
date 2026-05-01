import API from '../config';
import { getAuthHeader } from './api';

/**
 * ML Settings API Service
 * Manage ML/Hybrid Intelligence configuration
 */

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API.MARNEE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// ==================== ML SETTINGS ====================

export const getSettings = async () => {
  return request('/admin/ml-settings');
};

export const updateSettings = async (settings) => {
  return request('/admin/ml-settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
};

export const getStatus = async () => {
  return request('/admin/ml-settings/status');
};

export const getUsageStats = async (days = 30) => {
  return request(`/admin/ml-settings/usage-stats?days=${days}`);
};

export const testAnalysis = async (texts, analysisType = 'all') => {
  return request('/admin/ml-settings/test', {
    method: 'POST',
    body: JSON.stringify({
      texts,
      analysis_type: analysisType
    }),
  });
};

export const getDataSourcesInfo = async () => {
  return request('/admin/ml-settings/data-sources');
};

export const regenerateCache = async (niche, dataSources) => {
  return request('/admin/ml-settings/regenerate-cache', {
    method: 'POST',
    body: JSON.stringify({
      niche,
      data_sources: dataSources
    }),
  });
};
