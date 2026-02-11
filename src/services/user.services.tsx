import { apiClient } from './client';

export type UserRole = 'client' | 'admin' | 'super_admin';
export type UserStatus = 'ACTIF' | 'BLOQUE' | 'SUPPRIME';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    statut: UserStatus;
    created_at?: string;
    is_verified?: boolean; // Changé en boolean
}

export interface PaginatedUserResponse {
    data: User[];
    totalCount: number;
    totalPages: number;
}

export const userService = {
    getAll: async (page = 1, limit = 10, search = "", status = ""): Promise<PaginatedUserResponse> => {
        const res = await apiClient.get('/users', {
            params: { page, limit, search: search || undefined, status: status !== "all" ? status : undefined }
        });
        return res.data;
    },

    create: async (data: any): Promise<User> => {
        const res = await apiClient.post('/users', data);
        return res.data;
    },

    update: async (id: string, data: Partial<User>): Promise<User> => {
        const res = await apiClient.put(`/users/${id}`, data);
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.put(`/users/delete/${id}`);
    },

    blocked: async (id: string): Promise<void> => {
        await apiClient.put(`/users/blocked/${id}`);
    },
};