/**
 * Role Service
 * API calls para gestión de roles de negocio
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const roleService = {
  /**
   * Obtener información del rol actual del usuario
   */
  async getMyRole() {
    const response = await axios.get(`${API_BASE_URL}/api/v1/roles/me`);
    return response.data;
  },

  /**
   * Obtener lista de roles disponibles
   */
  async getAvailableRoles() {
    const response = await axios.get(`${API_BASE_URL}/api/v1/roles/available`);
    return response.data;
  },

  /**
   * Obtener capacidades de un rol específico
   */
  async getRoleCapabilities(role) {
    const response = await axios.get(`${API_BASE_URL}/api/v1/roles/capabilities/${role}`);
    return response.data;
  },

  /**
   * Actualizar el rol del usuario
   */
  async updateMyRole(role) {
    const response = await axios.patch(`${API_BASE_URL}/api/v1/roles/me`, {
      role
    });
    return response.data;
  },

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  async checkPermission(permission) {
    const response = await axios.get(`${API_BASE_URL}/api/v1/roles/check-permission/${permission}`);
    return response.data;
  },
};
