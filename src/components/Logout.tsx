// src/components/Logout.tsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Appeler la fonction de logout du contexte
    logout();
    // 2. Rediriger vers login
    navigate('/login');
  }, [logout, navigate]);

  return null; // Ce composant n'affiche rien, il fait juste une action
};

export default Logout;