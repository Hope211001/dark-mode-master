import { apiClient } from './client';

export interface Subscription {
  id: string;
  nom?: string;
  auto_contact_enabled: boolean;
  price_max_filter: number | null;
  price_min_filter: number | null;
  surface_min_filter: number | null;
  searchQuery: string | null;
  owner_id: string | null; 
  category_id: number | null;
  radius: number | null;
  template_message: string | null;
}

export const subscriptionService = {
  // Cette méthode appelle maintenant le controller qui lit dans 'zones'
  getSubscriptionByZone: async (zoneId: string): Promise<Subscription> => {
    const res = await apiClient.get(`/subscriptions/zone/${zoneId}`);
    return res.data;
  },

  updateByZone: async (zoneId: string, updates: Partial<Subscription>): Promise<Subscription> => {
    const res = await apiClient.put(`/subscriptions/zone/${zoneId}`, updates);
    return res.data;
  },
};