import { apiClient } from './client';

export interface Subscription {
  id: string;
  user_id: string;
  zone_id: string;
  is_active: boolean;
  auto_contact_enabled: boolean;
}

export const subscriptionService = {
  // 1. Récupérer la souscription par zone
  getSubscriptionByZone: async (zoneId: string): Promise<Subscription> => {
    const res = await apiClient.get(`/subscriptions/zone/${zoneId}`);
    return res.data;
  }, // <--- LA VIRGULE EST OBLIGATOIRE ICI

  // 2. Mettre à jour la config pour une zone précise
  updateByZone: async (zoneId: string, auto_contact_enabled: boolean): Promise<Subscription> => {
    const res = await apiClient.put(`/subscriptions/zone/${zoneId}`, { auto_contact_enabled });
    return res.data;
  }, // <--- VIRGULE OPTIONNELLE MAIS CONSEILLÉE ICI
};