import { apiClient } from './client';

export interface CookieData {
  id?: string;
  user_id?: string;
  cookies: string;
  mail_leboncoin: string;
  password_leboncoin: string;
}

interface CookieResponse {
  cookie: CookieData | null;
}

interface UpsertResponse {
  message: string;
  cookie: CookieData;
}

export const cookiesService = {
  getMyCookie: async (): Promise<CookieData | null> => {
    const res = await apiClient.get<CookieResponse>('/cookies/my');
    return res.data.cookie;
  },

  upsertCookie: async (data: { cookies: string; mail_leboncoin: string; password_leboncoin: string }): Promise<UpsertResponse> => {
    const res = await apiClient.put<UpsertResponse>('/cookies/my', data);
    return res.data;
  },

  deleteCookie: async (): Promise<void> => {
    await apiClient.delete('/cookies/my');
  },
};
