import api from './api';

/**
 * ML Settings API
 * Manage ML/Hybrid Intelligence configuration
 */

export const mlSettingsApi = {
  // Get current ML settings
  getSettings: async () => {
    const response = await api.get('/admin/ml-settings');
    return response.data;
  },

  // Update ML settings
  updateSettings: async (settings) => {
    const response = await api.put('/admin/ml-settings', settings);
    return response.data;
  },

  // Get ML system status
  getStatus: async () => {
    const response = await api.get('/admin/ml-settings/status');
    return response.data;
  },

  // Get usage statistics
  getUsageStats: async (days = 30) => {
    const response = await api.get(`/admin/ml-settings/usage-stats`, {
      params: { days }
    });
    return response.data;
  },

  // Test ML analysis
  testAnalysis: async (texts, analysisType = 'all') => {
    const response = await api.post('/admin/ml-settings/test', {
      texts,
      analysis_type: analysisType
    });
    return response.data;
  },

  // Get data sources info
  getDataSourcesInfo: async () => {
    const response = await api.get('/admin/ml-settings/data-sources');
    return response.data;
  },

  // Regenerate cache for a niche
  regenerateCache: async (niche, dataSources) => {
    const response = await api.post('/admin/ml-settings/regenerate-cache', {
      niche,
      data_sources: dataSources
    });
    return response.data;
  }
};

export default mlSettingsApi;
