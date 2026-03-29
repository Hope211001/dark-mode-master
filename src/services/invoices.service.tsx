import { apiClient } from './client';

export interface MonthSummary {
  billing_month: string;
  total_eur: number;
  total_usd: number;
  total_items: number;
  run_count: number;
}

export interface ApifyCostRun {
  run_id: string;
  actor_id: string;
  workflow_name: string;
  compute_units: number;
  cost_usd: number;
  cost_eur: number;
  items_scraped: number;
  status: string;
  duration_sec: number;
  billed: boolean;
  created_at: string;
}

export interface DaySummary {
  day: string;
  total_eur: number;
  total_usd: number;
  total_items: number;
  run_count: number;
  runs: ApifyCostRun[];
}

export const invoicesService = {
  getMonthly: async (): Promise<MonthSummary[]> => {
    const res = await apiClient.get<{ data: MonthSummary[] }>('/invoices');
    return res.data.data;
  },

  getMonthDetail: async (month: string): Promise<DaySummary[]> => {
    const res = await apiClient.get<{ data: DaySummary[] }>(`/invoices/${month}`);
    return res.data.data;
  },
};
