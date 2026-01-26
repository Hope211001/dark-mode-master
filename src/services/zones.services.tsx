import { apiClient } from './client';

// 1. Définition de la structure d'une Zone
export interface Zone {
  id: number;
  nom: string;
  price: number;
  lat_center?: string;
  lng_center?: string;
  statut_market?: string;
  codes_postaux: string[];
  owner_id?: string | null; // 👈 Ajouté ici (peut être string ou null)
}

// 2. Structure pour la création d'une Zone
export interface CreateZoneDTO {
  nom: string; 
  price: number; 
  lat_center?: string; 
  lng_center?: string; 
  codes_postaux: string[];
}

// 3. Le Service Zone
export const zoneService = {
  // Récupérer toutes les zones (utilisé pour le tableau avec pagination)
  getAll: async (page = 1, limit = 10) => {
    const res = await apiClient.get(`/zones?page=${page}&limit=${limit}`);
    return res.data; // Retourne { data: Zone[], totalCount, totalPages }
  },

  // Récupérer une seule zone par son ID
  getById: async (id: number | string): Promise<Zone> => {
    const res = await apiClient.get(`/zones/${id}`);
    return res.data;
  },

  // Créer une nouvelle zone
  create: async (data: CreateZoneDTO) => {
    const res = await apiClient.post('/zones', data);
    return res.data;
  },

  // Mettre à jour une zone existante
  update: async (id: number, data: any) => {
    const res = await apiClient.put(`/zones/${id}`, data);
    return res.data;
  },

  // Supprimer une zone
  delete: async (id: number) => {
    const res = await apiClient.delete(`/zones/${id}`);
    return res.data;
  },

   // Elle appelle la route : router.get('/my/owned', ...)
  getMyZones: async (): Promise<Zone[]> => {
    try {
      const res = await apiClient.get('/zones/my/owned');
      return res.data; // Retourne le tableau des zones appartenant à l'utilisateur
    } catch (error) {
      console.error("Erreur lors de la récupération de mes zones", error);
      throw error;
    }
  },

  getAvailableZones: async (): Promise<Zone[]> => {
    // On demande une limite élevée pour voir toutes les opportunités
    const res = await apiClient.get('/zones?page=1&limit=100');
    
    // Filtre pour le "Select" ou la "Marketplace"
    // Selon le PDF, ce sont les zones disponibles à la vente (Concessions libres)
    return res.data.data.filter((z: Zone) => 
      !z.statut_market || z.statut_market === 'LIBRE'
    );
  },
  
};