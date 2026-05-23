import { apiClient } from './client';

export type Furnishing = 'meuble' | 'non_meuble';
export type SellerType = 'particulier' | 'pro';
export type Source = 'pap.fr' | 'leboncoin' | 'seloger';

export interface Campaign {
  id: string;
  zone_id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  auto_contact_enabled: boolean;

  // v1
  price_min: number | null;
  price_max: number | null;
  surface_min: number | null;
  search_query: string | null;
  category_id: number | null;
  radius: number | null;
  sources_allowed: Source[];
  max_annonce_scraped: string | null;
  template_message: string | null;

  // v2 (Leboncoin)
  surface_max: number | null;
  types_bien: string[];
  arrondissements_allowed: string[];
  nb_pieces_min: number | null;
  nb_pieces_max: number | null;
  nb_chambres_min: number | null;
  nb_chambres_max: number | null;
  furnishing_filter: Furnishing | null;
  seller_types: SellerType[];
  max_days_old: number | null;

  created_at: string;
  updated_at: string;
}

export type CampaignInput = Partial<Omit<Campaign, 'id' | 'user_id' | 'zone_id' | 'created_at' | 'updated_at'>> & {
  zoneId?: string;
  name?: string;
};

export const campaignsService = {
  listByZone: async (zoneId: string): Promise<Campaign[]> => {
    const res = await apiClient.get<Campaign[]>('/campaigns', { params: { zoneId } });
    return res.data;
  },

  get: async (id: string): Promise<Campaign> => {
    const res = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return res.data;
  },

  create: async (input: CampaignInput): Promise<Campaign> => {
    const res = await apiClient.post<Campaign>('/campaigns', input);
    return res.data;
  },

  update: async (id: string, input: CampaignInput): Promise<Campaign> => {
    const res = await apiClient.put<Campaign>(`/campaigns/${id}`, input);
    return res.data;
  },

  toggle: async (id: string): Promise<Campaign> => {
    const res = await apiClient.post<Campaign>(`/campaigns/${id}/toggle`);
    return res.data;
  },

  remove: async (id: string): Promise<{ success: boolean }> => {
    const res = await apiClient.delete<{ success: boolean }>(`/campaigns/${id}`);
    return res.data;
  },
};
