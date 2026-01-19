import { apiClient } from "./client";

/* =======================
   TYPES
======================= */

export interface Lead {
  id: string;
  titre: string;
  ville: string;
  prix: number;
  status: string;
  date_detection: string;
}

export interface CreateLeadData {
  titre: string;
  ville: string;
  prix: number;
  status?: string;
  date_detection?: string;
}

/* =======================
   SERVICE
======================= */

class LeadsService {
  private readonly BASE_PATH = "/leads";

  // 🔹 Récupérer tous les leads
  async getAll(): Promise<Lead[]> {
    const { data } = await apiClient.get<Lead[]>(this.BASE_PATH);
    return data;
  }

  // 🔹 Récupérer un lead par ID
  async getById(id: string): Promise<Lead> {
    const { data } = await apiClient.get<Lead>(`${this.BASE_PATH}/${id}`);
    return data;
  }

  // 🔹 Créer un lead
  async create(payload: CreateLeadData): Promise<Lead> {
    const { data } = await apiClient.post<Lead>(this.BASE_PATH, payload);
    return data;
  }

  // 🔹 Mettre à jour un lead
  async update(
    id: string,
    payload: Partial<CreateLeadData>
  ): Promise<Lead> {
    const { data } = await apiClient.put<Lead>(
      `${this.BASE_PATH}/${id}`,
      payload
    );
    return data;
  }

  // 🔹 Supprimer un lead
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }
}

/* =======================
   EXPORT UNIQUE
======================= */

export const leadsService = new LeadsService();
