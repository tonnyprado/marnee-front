/**
 * Agency Service
 * API calls para gestión de clientes (Marketing Agencies)
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const agencyService = {
  /**
   * Listar todos los clientes
   */
  async listClients(params = {}) {
    const response = await axios.get(`${API_BASE_URL}/api/v1/agency/clients`, {
      params
    });
    return response.data;
  },

  /**
   * Crear un nuevo cliente
   */
  async createClient(clientData) {
    const response = await axios.post(`${API_BASE_URL}/api/v1/agency/clients`, clientData);
    return response.data;
  },

  /**
   * Obtener detalles de un cliente
   */
  async getClient(clientId) {
    const response = await axios.get(`${API_BASE_URL}/api/v1/agency/clients/${clientId}`);
    return response.data;
  },

  /**
   * Actualizar un cliente
   */
  async updateClient(clientId, clientData) {
    const response = await axios.patch(`${API_BASE_URL}/api/v1/agency/clients/${clientId}`, clientData);
    return response.data;
  },

  /**
   * Eliminar un cliente
   */
  async deleteClient(clientId) {
    const response = await axios.delete(`${API_BASE_URL}/api/v1/agency/clients/${clientId}`);
    return response.data;
  },

  /**
   * Obtener proyectos de un cliente
   */
  async getClientProjects(clientId) {
    const response = await axios.get(`${API_BASE_URL}/api/v1/agency/clients/${clientId}/projects`);
    return response.data;
  },
};
