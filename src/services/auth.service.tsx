
// ========================================
// 1. src/services/auth.service.tsx
// ========================================

import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'client' | 'admin';
  created_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Modifie ton interface AuthResponse
export interface AuthResponse {
  token?: string;                // Optionnel car absent si verification requise
  user?: User;                   // Optionnel car absent si verification requise
  requiresVerification?: boolean; // <-- AJOUTE CETTE LIGNE
  message?: string;    
  created_at?: string;
}

// ✅ NOUVELLE INTERFACE pour la réponse d'inscription
export interface RegisterResponse {
  message: string;
}

export interface ProfileResponse {
  user: User;
}

export interface VerifyResponse {
  valid: boolean;
  user: {
    id: string;
    email: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  created_at?: string;
  updated_at?: string;
}

class AuthService {
  private readonly BASE_PATH = '/auth';

  async googleAuth(credential: string, mode: 'login' | 'register'): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(`${this.BASE_PATH}/google-auth`, { 
    credential, 
    mode 
  });
  return response.data;
}

  // ✅ FIX : Utiliser RegisterResponse au lieu de AuthResponse
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      `${this.BASE_PATH}/register`,
      data
    );
    return response.data; // Retourne { message: "..." }
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.BASE_PATH}/login`,
      data
    );
    return response.data;
  }


  async verifyEmail(token: string, id: string): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse>(
      `${this.BASE_PATH}/verify-email?token=${token}&id=${id}`
    );
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.BASE_PATH}/logout`);
    } catch (error) {
      console.warn('Erreur serveur lors du logout (non bloquant):', error);
    } finally {
      this.removeToken();
    }
  }


  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      `${this.BASE_PATH}/update-profile`,
      data
    );
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      `${this.BASE_PATH}/change-password`,
      data
    );
    return response.data;
  }

  async verifyToken(): Promise<VerifyResponse> {
    const response = await apiClient.get<VerifyResponse>(
      `${this.BASE_PATH}/verify`
    );
    return response.data;
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>(`${this.BASE_PATH}/profile`);
    return response.data;
  }

  saveToken(token: string): void { localStorage.setItem('token', token); }
  getToken(): string | null { return localStorage.getItem('token'); }
  removeToken(): void { localStorage.removeItem('token'); }
}

export const authService = new AuthService();

