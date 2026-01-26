import React from 'react';
import { ArrowRight, MapPin, TrendingUp, Mail, Shield, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import Benefits from '@/components/home/benefits';
import CTA from '@/components/home/cta';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ">
      {/* Effets de fond décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Fixed */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-gray-900/80 backdrop-blur-md px-4 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">

          {/* GAUCHE : Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MapPin className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">ImmoScout</span>
          </div>

          {/* DROITE : Mélange Navigation + Authentification */}
          <div className="flex items-center space-x-1 md:space-x-6">

            {/* Liens de Navigation (Cachés sur très petit mobile) */}
            <div className="hidden sm:flex items-center space-x-6 mr-2">
              <Link
                to="/a-propos"
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                À propos
              </Link>
              <Link
                to="/abonnement"
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Abonnement
              </Link>
            </div>
            {/* Boutons d'Authentification */}
            <div className="flex items-center space-x-3">
              <Link
                to='/login'
                className="border border-white px-6 rounded-lg text-gray-300 hover:text-gray-100 hover:bg-blue-600 transition-colors px-3 py-2 font-medium text-sm"
              >
                Connexion
              </Link>
              <Link
                to='/register'
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-600/20 font-semibold text-sm transform hover:scale-105 active:scale-95"
              >
                Commencer
              </Link>
            </div>

          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <Hero></Hero>

      {/* Features Section */}
      <Features></Features>

      {/* Benefits Section */}
      <Benefits></Benefits>

      {/* CTA Section */}
      <CTA></CTA>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; 2024 ImmoScout. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;