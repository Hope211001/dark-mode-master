// src/components/Login.tsx
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MapPin, TrendingUp, Mail, Shield, Clock, Zap, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);

    if (result.success && result.user) {
      // Redirection basée sur le rôle
      if (result.user.role === 'admin') {
        navigate('/admin'); // Redirige vers le dashboard admin
      } else {
        navigate('/client'); // Redirige vers le dashboard client
      }
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    setLoading(false);
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      {/* Effets de fond décoratifs améliorés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-gray-800/60 backdrop-blur-2xl shadow-2xl rounded-2xl w-full max-w-md p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
        {/* Logo et titre */}
        <div className="flex items-center space-x-3 mb-8 justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 transform hover:scale-105 transition-transform">
            <MapPin className="text-white" size={26} />
          </div>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            ImmoScout
          </h1>
        </div>

        {/* Sous-titre */}
        <p className="text-center text-gray-400 mb-6 text-sm">
          Connectez-vous pour accéder à votre tableau de bord
        </p>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-center backdrop-blur-sm animate-shake">
            <div className="flex items-center justify-center space-x-2">
              <Shield size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Champ Email */}
          <div className="group">
            <label htmlFor="email" className="block text-gray-300 mb-2 font-medium text-sm">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
                className="w-full pl-11 pr-4 py-3 bg-gray-900/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all duration-200 hover:border-gray-500"
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="group">
            <label htmlFor="password" className="block text-gray-300 mb-2 font-medium text-sm">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-11 pr-4 py-3 bg-gray-900/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all duration-200 hover:border-gray-500"
              />
            </div>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </>
            )}
          </button>
        </form>

        {/* Séparateur */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800/60 text-gray-400">ou</span>
          </div>
        </div>

        {/* Lien d'inscription */}
        <p className="text-center text-gray-400 text-sm">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors inline-flex items-center space-x-1"
          >
            <span>S'inscrire</span>
            <ArrowRight size={16} />
          </Link>
        </p>

        {/* Lien retour accueil */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <Link
            to="/"
            className="text-gray-500 hover:text-blue-400 text-sm flex items-center justify-center space-x-2 transition-colors group"
          >
            <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;