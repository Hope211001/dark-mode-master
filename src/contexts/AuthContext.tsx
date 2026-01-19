// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, User, RegisterData, LoginData } from '../services/auth.service';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      const token = authService.getToken();
      
      if (token) {
        try {
          await authService.verifyToken();
          const profileResponse = await authService.getProfile();
          setUser(profileResponse.user);
        } catch (error) {
          console.error('Token invalide:', error);
          authService.removeToken();
        }
      }
      
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Inscription
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      authService.saveToken(response.token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Erreur lors de l\'inscription',
      };
    }
  };

  // Connexion
  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      authService.saveToken(response.token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Erreur lors de la connexion',
      };
    }
  };

  // Déconnexion
  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};