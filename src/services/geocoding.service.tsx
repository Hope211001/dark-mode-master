const ADRESSE_API = "https://api-adresse.data.gouv.fr/search";
const GEO_API = "https://geo.api.gouv.fr";

export interface GeocodeResult {
  lat: number;
  lng: number;
  city: string;
  postcode: string;
}

export interface FrenchDepartment {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

export const geocodingService = {
  async searchCity(query: string, limit = 10): Promise<GeocodeResult[]> {
    const q = query.trim();
    if (q.length < 1) return [];
    const url = `${GEO_API}/communes?nom=${encodeURIComponent(q)}&fields=nom,codesPostaux,centre&boost=population&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data: Array<{
      nom: string;
      codesPostaux?: string[];
      centre?: { coordinates: [number, number] };
    }> = await res.json();
    return data.map(c => {
      const coords = c.centre?.coordinates;
      return {
        lat: coords?.[1] ?? 0,
        lng: coords?.[0] ?? 0,
        city: c.nom,
        postcode: c.codesPostaux?.[0] ?? "",
      };
    });
  },

  async searchPostalCode(query: string, limit = 10): Promise<GeocodeResult[]> {
    const q = query.trim();
    if (q.length < 3) return [];
    const url = `${ADRESSE_API}/?q=${encodeURIComponent(q)}&type=municipality&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    const features: Array<{
      geometry: { coordinates: [number, number] };
      properties: { city?: string; name?: string; postcode?: string };
    }> = json.features || [];
    return features.map(feat => {
      const [lng, lat] = feat.geometry.coordinates;
      return {
        lat,
        lng,
        city: feat.properties.city || feat.properties.name || "",
        postcode: feat.properties.postcode || "",
      };
    });
  },

  async byPostalCode(postcode: string): Promise<GeocodeResult | null> {
    const cp = postcode.trim();
    if (!/^\d{5}$/.test(cp)) return null;

    const url = `${ADRESSE_API}/?q=${cp}&type=municipality&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const feat = json.features?.[0];
    if (!feat) return null;

    const [lng, lat] = feat.geometry.coordinates;
    return {
      lat,
      lng,
      city: feat.properties.city || feat.properties.name,
      postcode: feat.properties.postcode || cp,
    };
  },

  async getArrondissements(cityInseeCode: string): Promise<GeocodeResult[]> {
    const url = `${GEO_API}/communes/${cityInseeCode}/arrondissements-municipaux`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Impossible de récupérer la liste des arrondissements");
    const data: Array<{
      code: string;
      nom: string;
      codesPostaux?: string[];
      centre?: { coordinates: [number, number] };
    }> = await res.json();
    return data
      .map(a => {
        const coords = a.centre?.coordinates;
        return {
          lat: coords?.[1] ?? 0,
          lng: coords?.[0] ?? 0,
          city: a.nom,
          postcode: a.codesPostaux?.[0] ?? "",
        };
      })
      .sort((a, b) => a.postcode.localeCompare(b.postcode));
  },

  async getPostalCodesForDepartment(deptCode: string): Promise<string[]> {
    const url = `${GEO_API}/communes?codeDepartement=${deptCode}&fields=codesPostaux&limit=2000`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Impossible de récupérer les codes postaux du département");
    const data: Array<{ codesPostaux?: string[] }> = await res.json();
    const all = new Set<string>();
    data.forEach(c => c.codesPostaux?.forEach(cp => all.add(cp)));
    return Array.from(all).sort();
  },

  async getDepartments(): Promise<FrenchDepartment[]> {
    const url = `${GEO_API}/departements?fields=nom,code,centre&geometry=centre`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Impossible de récupérer la liste des départements");

    const data: Array<{ code: string; nom: string; centre?: { coordinates: [number, number] } }> = await res.json();
    return data
      .map(d => {
        const coords = d.centre?.coordinates;
        return {
          code: d.code,
          name: d.nom,
          lat: coords?.[1] ?? 0,
          lng: coords?.[0] ?? 0,
        };
      })
      .sort((a, b) => a.code.localeCompare(b.code));
  },

  async byCity(cityName: string): Promise<GeocodeResult | null> {
    const q = cityName.trim();
    if (q.length < 2) return null;

    const url = `${ADRESSE_API}/?q=${encodeURIComponent(q)}&type=municipality&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const feat = json.features?.[0];
    if (!feat) return null;

    const [lng, lat] = feat.geometry.coordinates;
    return {
      lat,
      lng,
      city: feat.properties.city || feat.properties.name,
      postcode: feat.properties.postcode || "",
    };
  },
};
