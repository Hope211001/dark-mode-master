// Stubs API pour la landing — la landing est purement marketing/vitrine.
// Quand on voudra brancher la vraie data, remplacer ces fonctions par des
// appels à `apiClient` depuis services/client.tsx.

const SAMPLE_ZONES = [
  { code: "75", name: "Paris", kind: "department", status: "limited" },
  { code: "13", name: "Bouches-du-Rhône", kind: "department", status: "available" },
  { code: "69", name: "Rhône", kind: "department", status: "limited" },
  { code: "33", name: "Gironde", kind: "department", status: "available" },
  { code: "06", name: "Alpes-Maritimes", kind: "department", status: "reserved" },
  { code: "31", name: "Haute-Garonne", kind: "department", status: "available" },
  { code: "59", name: "Nord", kind: "department", status: "closed" },
  { code: "44", name: "Loire-Atlantique", kind: "department", status: "available" },
];

const SAMPLE_STATS = {
  zones_closed_this_week: 24,
  zones_total: 96,
  zones_available: 47,
  operators: 312,
};

export const fetchZones = async (params = {}) => {
  // Si on filtre par arrondissement, retourne une liste vide pour l'instant
  if (params.kind === "arrondissement") return [];
  return SAMPLE_ZONES;
};

export const fetchZone = async (code) => SAMPLE_ZONES.find((z) => z.code === code) || null;

export const fetchStats = async () => SAMPLE_STATS;

export const createReservation = async (payload) => {
  // Pour l'instant on log et on retourne un OK. Plus tard : POST réel.
  console.log("[landing] reservation:", payload);
  return { ok: true, ref: `RES-${Date.now()}` };
};
