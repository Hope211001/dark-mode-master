import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User, RegisterData, LoginData } from '../services/auth.service';
import Swal from 'sweetalert2';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginWithGoogle: (credential: string, mode: 'login' | 'register') => Promise<void>;
  loginWithToken: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const response = await authService.getProfile();
          setUser(response.user);
        } catch (error) {
          authService.removeToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Ajoute 'mode' dans l'interface de loginWithGoogle
  const loginWithGoogle = async (credential: string, mode: 'login' | 'register') => {
    try {
      setLoading(true);
      // On envoie le credential ET le mode au backend
      const response = await authService.googleAuth(credential, mode);

      if (response.requiresVerification) {
        Swal.fire({
          icon: 'info',
          title: 'Vérification requise',
          text: response.message || "Vérifiez vos emails pour activer votre compte.",
          background: '#111827', color: '#fff'
        });
        navigate('/login');
        return;
      }

      if (response.token && response.user) {
        authService.saveToken(response.token);
        setUser(response.user);
        response.user.role === 'admin' ? navigate('/admin') : navigate('/client');
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.error || "Erreur d'authentification",
        background: '#111827', color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = (token: string, userData: User) => {
    authService.saveToken(token); // Sauvegarde le JWT dans le localStorage
    setUser(userData);            // Met à jour l'état global de l'utilisateur
  };


  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      authService.saveToken(response.token);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: (error as any).response?.data?.error || 'Erreur' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authService.register(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as any).response?.data?.error || 'Erreur inscription' };
    }
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, register, login, loginWithGoogle, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

