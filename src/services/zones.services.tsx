import { apiClient } from './client';

// 1. Définition de la structure d'une Zone
// J'ai passé lat/lng en 'number' car Leaflet a besoin de nombres pour les calculs
export interface Zone {
  id: number;
  nom: string;
  price: number;
  lat_center: number; // Modifié en number pour la carte
  lng_center: number; // Modifié en number pour la carte
  statut_market: 'LIBRE' | 'VENDU'; 
  codes_postaux: string[];
  owner_id?: string | null;
}

// 2. Structure pour la création d'une Zone
export interface CreateZoneDTO {
  nom: string; 
  price: number; 
  lat_center: number; 
  lng_center: number; 
  codes_postaux: string[];
}

// 3. Le Service Zone
export const zoneService = {
  // --- NOUVELLE FONCTION POUR LA CARTE ---
  // Elle récupère toutes les zones (Libres + Vendues) avec leurs coordonnées
  getMapStatus: async (): Promise<Zone[]> => {
    try {
      const res = await apiClient.get('/zones/map-status');
      return res.data; // Retourne le tableau des zones pour MapExplorer
    } catch (error) {
      console.error("Erreur lors de la récupération du statut de la carte", error);
      throw error;
    }
  },

  // Récupérer toutes les zones (utilisé pour le tableau d'administration avec pagination)
  getAll: async (page = 1, limit = 10) => {
    const res = await apiClient.get(`/zones?page=${page}&limit=${limit}`);
    return res.data; 
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

  // Récupérer les zones appartenant à l'utilisateur connecté
  getMyZones: async (): Promise<Zone[]> => {
    try {
      const res = await apiClient.get('/zones/my/owned');
      return res.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de mes zones", error);
      throw error;
    }
  },

  // Récupérer uniquement les zones disponibles (pour le Select de la Marketplace)
  getAvailableZones: async (): Promise<Zone[]> => {
    const res = await apiClient.get('/zones?page=1&limit=100');
    // On filtre pour ne garder que le statut LIBRE
    return res.data.data.filter((z: Zone) => 
      z.statut_market === 'LIBRE'
    );
  },
};