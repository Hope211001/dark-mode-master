const API_URL = "http://localhost:3000/api";

export async function apiGet(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error("Erreur API");
  }

  return res.json();
}
