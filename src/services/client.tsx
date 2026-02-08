import axios, { AxiosInstance, AxiosError } from 'axios';

// src/services/client.tsx 
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
   withCredentials: true, // Nécessaire pour les cookies/sessions
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('🔧 API_URL:', API_URL); 


// Intercepteur requête
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur réponse
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Erreur réponse:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);