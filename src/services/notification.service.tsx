import { apiClient } from './client';

export interface NotificationItem {
  id: string;
  titre: string;
  date_detection: string; // <--- C'est ici qu'on change created_at
  is_read: boolean;
  score?: number;
  prix?:number;
}

interface NotificationResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

export const notificationService = {
  getAll: async () => {
    const res = await apiClient.get<NotificationResponse>('/notifications');
    return res.data;
  },
  markAsRead: async (id: string) => {
    await apiClient.put(`/notifications/${id}/read`);
  },
  markAllAsRead: async () => {
    await apiClient.put('/notifications/mark-all-read');
  }
};