// src/services/stripe.service.ts
import { apiClient } from './client';

export const stripeService = {
  async buyZone(zoneId: string | number) {
    try {
      // On appelle la route backend que nous avons créée précédemment
      const response = await apiClient.post('/payments/buy-zone', { zoneId });

      // La réponse contient l'URL de redirection vers Stripe
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'appel à Stripe:", error);
      throw error;
    }
  },

  // Ouvre le Stripe Customer Portal — gestion CB, factures, reçus
  async openCustomerPortal(): Promise<{ url: string }> {
    const response = await apiClient.post<{ url: string }>('/payments/portal-session');
    return response.data;
  },
};