import { apiGet } from "./client";

// ✅ GET ALL LEADS
export function getLeads() {
  return apiGet("/leads"); // ✅ PAS /api
}

// ✅ GET LEAD BY ID
export function getLeadById(id: string) {
  return apiGet(`/leads/${id}`);
}

// ✅ GET LEADS BY STATUS
export function getLeadsByStatus(status: string) {
  return apiGet(`/leads?status=${status}`);
}
