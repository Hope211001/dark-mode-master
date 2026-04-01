import { apiClient } from './client';

// 1. DÉFINITION EXACTE SELON VOS DONNÉES JSON
export interface ScoreDetails {
  // Accepte string ("1.80") ou number (1.80) pour être sûr
  ratio?: string | number;           
  nb_photos?: number;                
  distance_km?: string | number;     
  has_keywords?: boolean;            
  revenu_estime?: string | number;   
  score_rentabilite?: number;        
  score_localisation?: number;       
  score_verification?: number;       
}

// 2. INTERFACE LEAD MISE À JOUR
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

  // IMPORTANT : Assurez-vous que le nom ici correspond à votre colonne DB.
  // Si dans votre DB c'est "scrore_details" (avec la faute), gardez "scrore_details".
  // Si vous l'avez corrigé en "score_details", mettez "score_details".
  scrore_details?: ScoreDetails; 
  // scrore_details?: ScoreDetails; // Décommentez cette ligne si votre DB a encore la faute de frappe
  
  phone?: string;
  owner_name?: string;
  zone_id?: string;
  assigned_user_id?: string;
  lbc_id?: string;
  status?: string;
  statut?: string;
  description?: string;
}

interface LeadsResponse {
  data: Lead[];
  totalCount: number;
  totalPages: number;
}

export interface LeadsFilters {
  page?: number;
  limit?: number;
  search?: string;
  statut?: string;
  phone?: string;
  sort?: string;
  zone_id?: string;
  exclude_statut?: string;
}

export const leadsService = {
  getAll: async (page = 1, limit = 10): Promise<LeadsResponse> => {
    const response = await apiClient.get<LeadsResponse>(`/leads?page=${page}&limit=${limit}`);
    return response.data;
  },

  getMyLeads: async (filters: LeadsFilters = {}): Promise<LeadsResponse> => {
    const { page = 1, limit = 12, search, statut, phone, sort, zone_id, exclude_statut } = filters;
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    if (statut && statut !== 'all') params.append('statut', statut);
    if (phone && phone !== 'all') params.append('phone', phone);
    if (sort) params.append('sort', sort);
    if (zone_id && zone_id !== 'all') params.append('zone_id', zone_id);
    if (exclude_statut) params.append('exclude_statut', exclude_statut);
    const response = await apiClient.get<LeadsResponse>(`/leads/my?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number | string): Promise<Lead> => {
    const res = await apiClient.get<Lead>(`/leads/my/${id}`);
    return res.data;
  },

  updateStatus: async (id: string, statut: string): Promise<Lead> => {
    const res = await apiClient.patch<Lead>(`/leads/my/${id}/status`, { statut });
    return res.data;
  },

  contactLead: async (id: string, message: string): Promise<void> => {
    await apiClient.post(`/leads/my/${id}/contact`, { message });
  },

  exportCSV: async (filters: LeadsFilters = {}): Promise<void> => {
    const { search, statut, phone, sort, zone_id, exclude_statut } = filters;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statut && statut !== 'all') params.append('statut', statut);
    if (phone && phone !== 'all') params.append('phone', phone);
    if (sort) params.append('sort', sort);
    if (zone_id && zone_id !== 'all') params.append('zone_id', zone_id);
    if (exclude_statut) params.append('exclude_statut', exclude_statut);
    const res = await apiClient.get(`/leads/my/export-csv?${params.toString()}`, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  },
};