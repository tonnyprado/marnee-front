/**
 * Brand Profile API Service - Refactored
 *
 * BEFORE: 160 lines with duplicated auth/request logic
 * AFTER: 70 lines using unified ApiClient
 */

import apiClient from '../core/services/ApiClient';
import API from '../config';

// =====================
// BRAND PROFILE ENDPOINTS
// =====================

export const getBrandProfile = (profileId) =>
  apiClient.get(`/brand-profiles/${profileId}`, {
    baseUrl: API.MARNEE,
  });

export const getBrandProfileByFounder = (founderId) =>
  apiClient.get(`/founder/${founderId}/brand-profile`, {
    baseUrl: API.MARNEE,
  });

export const updateBrandProfile = (founderId, data) =>
  apiClient.put(`/founder/${founderId}/brand-profile`, data, {
    baseUrl: API.MARNEE,
  });

export const generateBrandProfile = ({ founderId, sessionId }) =>
  apiClient.post('/brand-profile/generate', {
    founderId,
    sessionId,
  }, {
    baseUrl: API.MARNEE,
  });

export const regenerateBrandProfileSection = ({ founderId, section }) =>
  apiClient.post('/brand-profile/regenerate-section', {
    founderId,
    section,
  }, {
    baseUrl: API.MARNEE,
  });

// =====================
// BRAND GUIDELINES
// =====================

export const uploadBrandGuidelines = (founderId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('founderId', founderId);

  return apiClient.upload('/brand-profile/guidelines/upload', formData, {
    baseUrl: API.MARNEE,
  });
};

export const getBrandGuidelines = (founderId) =>
  apiClient.get(`/brand-profile/guidelines/${founderId}`, {
    baseUrl: API.MARNEE,
  });

export const deleteBrandGuidelines = (guidelineId) =>
  apiClient.delete(`/brand-profile/guidelines/${guidelineId}`, {
    baseUrl: API.MARNEE,
  });

// Default export
const brandProfileApi = {
  getBrandProfile,
  getBrandProfileByFounder,
  updateBrandProfile,
  generateBrandProfile,
  regenerateBrandProfileSection,
  uploadBrandGuidelines,
  getBrandGuidelines,
  deleteBrandGuidelines,
};

export default brandProfileApi;
