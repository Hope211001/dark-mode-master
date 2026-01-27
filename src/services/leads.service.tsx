import { apiClient } from './client';

export interface Lead {
  id: string;
  titre: string;
  ville: string;
  prix: number;
  surface: number;
  score: number;
  statut_prospection: string;
  date_detection: string;
  url: string;
  potentiel_revenu?: number;
}

// Définition de la forme de la réponse du Backend (avec pagination)
interface LeadsResponse {
  data: Lead[];
  totalCount: number;
  totalPages: number;
}

export const leadsService = {
  // On précise que la fonction renvoie une promesse de type LeadsResponse
  getMyLeads: async (page = 1, limit = 10): Promise<LeadsResponse> => {
    const response = await apiClient.get<LeadsResponse>(`/leads/my?page=${page}&limit=${limit}`);
    return response.data;
  }
};