// src/services/config.service.ts
import { apiClient } from './client';

export interface UserConfig {
  loyer_max?: number;
  surface_min?: number;
  auto_contact?: boolean;
  template_msg_1?: string;
  template_msg_2?: string;
  template_msg_3?: string;
}

let configCache: UserConfig | null = null;
let configPromise: Promise<UserConfig> | null = null;

export const configService = {
  // Récupérer la config du client (fresh)
  async getConfig(): Promise<UserConfig> {
    const response = await apiClient.get<UserConfig>('/config/me');
    return response.data;
  },

  // Récupérer la config (deduplique les appels concurrents + cache mémoire)
  async getConfigCached(): Promise<UserConfig> {
    if (configCache) return configCache;
    if (!configPromise) {
      configPromise = this.getConfig()
        .then((cfg) => { configCache = cfg; return cfg; })
        .catch((err) => { configPromise = null; throw err; });
    }
    return configPromise;
  },

  // Invalider le cache (appeler apres update)
  clearConfigCache() {
    configCache = null;
    configPromise = null;
  },

  // Mettre à jour ou créer la config (Upsert)
  async updateConfig(configData: UserConfig) {
    const response = await apiClient.put('/config/update', configData);
    this.clearConfigCache();
    return response.data;
  },

  // Choisir le template par defaut selon le canal de contact
  pickTemplate(cfg: UserConfig | null | undefined, _mode: "leboncoin"): string {
    if (!cfg) return "";
    const t1 = cfg.template_msg_1 || "";
    const t2 = cfg.template_msg_2 || "";
    const t3 = cfg.template_msg_3 || "";
    return t1 || t2 || t3;
  },
};