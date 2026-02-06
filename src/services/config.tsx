// src/services/config.service.ts
import { apiClient } from './client';

export const configService = {
  // Récupérer la config du client
  async getConfig() {
    const response = await apiClient.get('/config/me');
    return response.data;
  },

  // Mettre à jour la config (filtres, templates, auto-contact)
  async updateConfig(configData: {
    loyer_max?: number;
    surface_min?: number;
    template_msg_1?: string;
    template_msg_2?: string;
    template_msg_3?: string;
  }) {
    const response = await apiClient.put('/config/update', configData);
    return response.data;
  }
};