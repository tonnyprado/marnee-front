/**
 * Template Service
 * API calls para export/import de estrategias
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const templateService = {
  /**
   * Exportar una estrategia como template
   */
  async exportStrategy(data) {
    const response = await axios.post(`${API_BASE_URL}/api/v1/strategy-templates/export`, data);
    return response.data;
  },

  /**
   * Importar un template a un proyecto
   */
  async importStrategy(data) {
    const response = await axios.post(`${API_BASE_URL}/api/v1/strategy-templates/import`, data);
    return response.data;
  },

  /**
   * Listar todos los templates del usuario
   */
  async listTemplates(includeArchived = false) {
    const response = await axios.get(`${API_BASE_URL}/api/v1/strategy-templates/`, {
      params: { include_archived: includeArchived }
    });
    return response.data;
  },

  /**
   * Obtener detalles de un template
   */
  async getTemplate(templateId) {
    const response = await axios.get(`${API_BASE_URL}/api/v1/strategy-templates/${templateId}`);
    return response.data;
  },

  /**
   * Archivar un template
   */
  async archiveTemplate(templateId) {
    const response = await axios.delete(`${API_BASE_URL}/api/v1/strategy-templates/${templateId}`);
    return response.data;
  },
};
