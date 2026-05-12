// src/services/adminIntegrationsApi.js
import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_MARNEE_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Admin Integrations API service
 * Handles monitoring and maintenance of platform integrations (Meta, Google, etc.)
 */

/**
 * Get Meta (Instagram/Facebook) integrations status
 * Returns token expiration info, connection health, etc.
 */
export const getMetaIntegrationsStatus = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/admin/integrations/meta/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Meta integrations status:', error);
    throw error;
  }
};

/**
 * Get overview of all platform integrations
 * Returns maintenance tasks and health status for all integrations
 */
export const getIntegrationsOverview = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/admin/integrations/overview`);
    return response.data;
  } catch (error) {
    console.error('Error fetching integrations overview:', error);
    throw error;
  }
};
