/**
 * Platform Service - API calls for multi-tenant platform
 *
 * This service handles all API interactions with the platform endpoints:
 * - Tenants management
 * - Usage tracking
 * - API keys
 * - Agents
 * - Metrics
 *
 * Follows Single Responsibility Principle: Only handles API calls
 */

import apiClient from './apiClient';

// ============================================================================
// TENANTS
// ============================================================================

export const platformService = {
  // Get current tenant
  async getCurrentTenant() {
    const response = await apiClient.get('/api/v1/platform/tenants/me');
    return response.data;
  },

  // Get tenant by ID
  async getTenant(tenantId) {
    const response = await apiClient.get(`/api/v1/platform/tenants/${tenantId}`);
    return response.data;
  },

  // List all tenants (admin only)
  async listTenants() {
    const response = await apiClient.get('/api/v1/platform/tenants');
    return response.data;
  },

  // Create tenant
  async createTenant(data) {
    const response = await apiClient.post('/api/v1/platform/tenants', data);
    return response.data;
  },

  // Update tenant
  async updateTenant(tenantId, data) {
    const response = await apiClient.patch(`/api/v1/platform/tenants/${tenantId}`, data);
    return response.data;
  },

  // ============================================================================
  // USAGE TRACKING
  // ============================================================================

  // Get usage summary
  async getUsageSummary(period = 'current_month') {
    const response = await apiClient.get('/api/v1/platform/usage/summary', {
      params: { period }
    });
    return response.data;
  },

  // Check limits
  async checkLimits() {
    const response = await apiClient.get('/api/v1/platform/usage/limits');
    return response.data;
  },

  // ============================================================================
  // API KEYS
  // ============================================================================

  // List API keys
  async listAPIKeys() {
    const response = await apiClient.get('/api/v1/platform/api-keys');
    return response.data;
  },

  // Create API key
  async createAPIKey(data) {
    const response = await apiClient.post('/api/v1/platform/api-keys', data);
    return response.data;
  },

  // Revoke API key
  async revokeAPIKey(keyId) {
    const response = await apiClient.delete(`/api/v1/platform/api-keys/${keyId}`);
    return response.data;
  },

  // ============================================================================
  // AGENTS
  // ============================================================================

  // List available agents
  async listAgents() {
    const response = await apiClient.get('/api/v1/platform/agents');
    return response.data;
  },

  // Execute agent
  async executeAgent(data) {
    const response = await apiClient.post('/api/v1/platform/agents/execute', data);
    return response.data;
  },

  // Get agent schema
  async getAgentSchema(agentRole) {
    const response = await apiClient.get(`/api/v1/platform/agents/${agentRole}/schema`);
    return response.data;
  },

  // ============================================================================
  // METRICS
  // ============================================================================

  // Get Prometheus metrics
  async getMetrics() {
    const response = await apiClient.get('/metrics');
    return response.data;
  },
};

export default platformService;
