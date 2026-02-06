import { apiClient } from './client';

// src/types/zone.ts (ou dans ton service)

// 1. L'entité complète telle qu'elle existe en base de données
export interface Zone {
  id: string;              // UUID dans Supabase = string en TS
  nom: string;
  price: number;

  // Utilise number pour la compatibilité avec Leaflet [lat, lng]
  lat_center: number;
  lng_center: number;

  // Utilise un Union Type pour sécuriser les statuts
  statut_market: 'LIBRE' | 'VENDU';

  codes_postaux: string[];
  owner_id: string | null; // UUID de l'utilisateur ou null
  created_at?: string;     // Optionnel
}

// 2. Le type pour la création (Data Transfer Object)
// On omet l'ID et le statut car ils sont gérés par le backend/DB
export interface CreateZoneDTO {
  nom: string;
  price: number;
  lat_center: number;
  lng_center: number;
  codes_postaux: string[];
}

// 3. Le type pour la mise à jour (Tous les champs sont optionnels)
export interface UpdateZoneDTO extends Partial<CreateZoneDTO> {
  statut_market?: 'LIBRE' | 'VENDU';
  owner_id?: string | null;
  lat_center?: number;
  lng_center?: number;
  codes_postaux?: string[];
}

// 4. TRÈS IMPORTANT : Le type pour la réponse de ton API paginée
// C'est ce que renvoie ton ZoneController.getAll
export interface PaginatedZoneResponse {
  data: Zone[];
  totalCount: number;
  totalPages: number;
}


// Interface pour la réponse des compteurs API
interface CountResponse {
  count: number;
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



  // Dans zones.service.ts
  getAll: async (page = 1, limit = 10, search = "") => {
    const res = await apiClient.get(`/zones/`, { // <-- Ajoute le / ici
      params: { page, limit, search: search || undefined }
    });
    return res.data;
  },


  // Récupérer une seule zone par son ID
  getById: async (id: number | string): Promise<Zone> => {
    const res = await apiClient.get(`/zones/${id}`);
    return res.data;
  },

  // Créer une nouvelle zone
  create: async (data: CreateZoneDTO): Promise<Zone> => {
    const res = await apiClient.post('/zones', data);
    return res.data;
  },

  update: async (id: string, data: UpdateZoneDTO): Promise<Zone> => {
    const res = await apiClient.put(`/zones/${id}`, data);
    return res.data;
  },

  // Supprimer une zone
  delete: async (id: string) => {
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


   // --- COMPTEURS CORRIGÉS (Retourne number, pas Zone[]) ---
  getCountAllZone: async (): Promise<number> => {
    try {
      const res = await apiClient.get<CountResponse>('/zones/countAllZone');
      return res.data.count; // On extrait le nombre
    } catch (error) {
      console.error("Erreur countAllZone", error);
      return 0;
    }
  },

  getCountZoneLibre: async (): Promise<number> => {
    try {
      const res = await apiClient.get<CountResponse>('/zones/countZoneLibre');
      return res.data.count;
    } catch (error) {
      console.error("Erreur countZoneLibre", error);
      return 0;
    }
  },

  getCountZoneVendu: async (): Promise<number> => {
    try {
      const res = await apiClient.get<CountResponse>('/zones/countZoneVendu');
      return res.data.count;
    } catch (error) {
      console.error("Erreur countZoneVendu", error);
      return 0;
    }
  },

};