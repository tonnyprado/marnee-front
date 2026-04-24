import API from '../config';
import { getAuthHeader } from './api';

/**
 * Prompts API Service
 *
 * All endpoints require ADMIN role.
 * Manages Marnee AI prompts, versions, and script library.
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

// ==================== CATEGORIES ====================

export const getCategories = async () => {
  return request('/admin/prompts/categories');
};

// ==================== PROMPTS ====================

export const getPrompts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.categoryId) params.append('category_id', filters.categoryId);
  if (filters.promptType) params.append('prompt_type', filters.promptType);
  if (filters.status) params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  return request(`/admin/prompts${query}`);
};

export const getPrompt = async (promptId) => {
  return request(`/admin/prompts/${promptId}`);
};

export const createPrompt = async (data) => {
  return request('/admin/prompts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePrompt = async (promptId, data) => {
  return request(`/admin/prompts/${promptId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const updatePromptStatus = async (promptId, status) => {
  return request(`/admin/prompts/${promptId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const deletePrompt = async (promptId) => {
  return request(`/admin/prompts/${promptId}`, {
    method: 'DELETE',
  });
};

// ==================== VERSIONS ====================

export const getPromptVersions = async (promptId) => {
  return request(`/admin/prompts/${promptId}/versions`);
};

export const getVersionContent = async (promptId, versionNumber) => {
  return request(`/admin/prompts/${promptId}/versions/${versionNumber}`);
};

export const rollbackToVersion = async (promptId, versionNumber) => {
  return request(`/admin/prompts/${promptId}/rollback/${versionNumber}`, {
    method: 'POST',
  });
};

// ==================== SCRIPT LIBRARY ====================

export const getScriptIndustries = async () => {
  return request('/admin/prompts/scripts/industries');
};

export const getScripts = async (industry = null) => {
  const query = industry ? `?industry=${encodeURIComponent(industry)}` : '';
  return request(`/admin/prompts/scripts${query}`);
};

export const createScript = async (data) => {
  return request('/admin/prompts/scripts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateScript = async (scriptId, data) => {
  return request(`/admin/prompts/scripts/${scriptId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteScript = async (scriptId) => {
  return request(`/admin/prompts/scripts/${scriptId}`, {
    method: 'DELETE',
  });
};

// ==================== IMPORT ====================

export const importPromptsFromCode = async () => {
  return request('/admin/prompts/import-from-code', {
    method: 'POST',
  });
};

// ==================== TEST CHAT ====================

export const testChat = async (message, options = {}) => {
  return request('/admin/prompts/test-chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      use_draft: options.useDraft || false,
      override_prompt_id: options.overridePromptId || null,
    }),
  });
};

// ==================== OPENAI USAGE ====================

export const getOpenAIUsage = async () => {
  return request('/admin/prompts/openai-usage');
};

const promptsApi = {
  getCategories,
  getPrompts,
  getPrompt,
  createPrompt,
  updatePrompt,
  updatePromptStatus,
  deletePrompt,
  getPromptVersions,
  getVersionContent,
  rollbackToVersion,
  getScriptIndustries,
  getScripts,
  createScript,
  updateScript,
  deleteScript,
  importPromptsFromCode,
  testChat,
  getOpenAIUsage,
};

export default promptsApi;
