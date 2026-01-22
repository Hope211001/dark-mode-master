import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('client' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // ÉTAPE 1 : Attendre impérativement la fin du chargement du profil
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  // ÉTAPE 2 : Si l'utilisateur n'est pas connecté après le chargement
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ÉTAPE 3 : Vérification stricte du rôle
  // On s'assure que user.role existe avant de vérifier
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role as 'client' | 'admin'))) {
    console.warn(`Accès refusé : Rôle [${user.role}] non autorisé pour cette route.`);
    
    // Redirection vers le dashboard approprié selon son rôle réel
    const fallbackPath = user.role === 'admin' ? '/admin' : '/client';
    return <Navigate to={fallbackPath} replace />;
  }

  // ÉTAPE 4 : Tout est OK
  return <>{children}</>;
};

export default ProtectedRoute;