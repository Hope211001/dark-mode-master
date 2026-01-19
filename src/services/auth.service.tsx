import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  name?: string;
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

export interface AuthResponse {
  token: string;
  user: User;
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

class AuthService {
  private readonly BASE_PATH = '/auth';

  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.BASE_PATH}/register`,
      data
    );
    return response.data;
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.BASE_PATH}/login`,
      data
    );
    return response.data;
  }

  //logout
  async logout(): Promise<void> {
    try {
      // 1. On informe le serveur (optionnel mais recommandé)
      await apiClient.post(`${this.BASE_PATH}/logout`);
    } catch (error) {
      // Si le serveur est hors ligne ou répond 500, ce n'est pas grave
      // On veut quand même déconnecter l'utilisateur localement
      console.warn('Erreur serveur lors du logout (non bloquant):', error);
    } finally {
      // 2. Quoi qu'il arrive (succès ou erreur), on supprime le token localement
      this.removeToken();
    }
  }

  // Obtenir le profil
  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>(
      `${this.BASE_PATH}/profile`
    );
    return response.data;
  }

  // Vérifier le token
  async verifyToken(): Promise<VerifyResponse> {
    const response = await apiClient.get<VerifyResponse>(
      `${this.BASE_PATH}/verify`
    );
    return response.data;
  }

  // Sauvegarder le token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Supprimer le token
  removeToken(): void {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();