import React from 'react';
import { ArrowRight, MapPin, TrendingUp, Mail, Shield, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ">
      {/* Effets de fond décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white">ImmoScout</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to='/login' className="text-gray-300 hover:text-white transition-colors px-4 py-2">
              Connexion
            </Link>
            <Link to='/register' className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30">
              Commencer
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-medium">🚀 Automatisation immobilière intelligente</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Trouvez les meilleures opportunités <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">en location meublée</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Analysez automatiquement les annonces Leboncoin, calculez leur rentabilité Airbnb et contactez les propriétaires. Gagnez du temps et sécurisez votre zone exclusive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/register" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center font-semibold">
              Commencer gratuitement
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <button className="w-full sm:w-auto bg-gray-800/50 backdrop-blur border border-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-700/50 transition-all">
              Voir la démo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-700/50">
            <div>
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-400">Annonces scannées/jour</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">95%</div>
              <div className="text-sm text-gray-400">Taux de précision</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">2h</div>
              <div className="text-sm text-gray-400">Économisées par jour</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-gray-400 text-lg">
              Une plateforme tout-en-un pour votre prospection immobilière
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Scraping automatique</h3>
              <p className="text-gray-400">
                Récupération automatique des annonces Leboncoin toutes les 15 minutes. Ne ratez plus jamais une opportunité.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analyse de rentabilité</h3>
              <p className="text-gray-400">
                Calcul automatique du potentiel Airbnb grâce à Beyond Pricing. Score sur 10 pour chaque annonce.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Prospection automatisée</h3>
              <p className="text-gray-400">
                Envoi automatique d'emails personnalisés aux propriétaires avec relances intelligentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-4 py-20 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Votre zone exclusive, votre succès
              </h2>
              <p className="text-gray-400 mb-8">
                Achetez une zone géographique en exclusivité. Vous seul recevrez les alertes pour cette zone, sans concurrence sur la plateforme.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="text-green-400" size={14} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Exclusivité garantie</h4>
                    <p className="text-gray-400 text-sm">Un seul utilisateur par zone géographique</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="text-green-400" size={14} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Temps réel</h4>
                    <p className="text-gray-400 text-sm">Alertes instantanées dès qu'une annonce correspond</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="text-green-400" size={14} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Scoring intelligent</h4>
                    <p className="text-gray-400 text-sm">Priorisez les meilleures opportunités automatiquement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <MapPin className="text-blue-400" size={120} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à automatiser votre prospection ?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Rejoignez les investisseurs qui ont déjà trouvé leurs meilleures affaires
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center mx-auto font-semibold">
               <Link to='/register'>Créer mon compte gratuitement</Link>
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

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