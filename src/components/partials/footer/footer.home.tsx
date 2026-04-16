import { Link } from "react-router-dom";
import { MapPin, Mail, ArrowRight } from "lucide-react";

const FooterHome = () => {
  return (
    <footer className="relative z-10 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <MapPin className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">ImmoScout</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme d'automatisation immobiliere qui travaille pour vous 24/7.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Accueil</Link></li>
              <li><Link to="/fonctionnalites" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Fonctionnalites</Link></li>
              <li><Link to="/tarifs" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Tarifs</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">A propos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">Compte</h4>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Connexion</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Inscription</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">Commencer</h4>
            <p className="text-gray-400 text-sm mb-4">Reservez votre zone exclusive des maintenant.</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-600/25"
            >
              Essai Gratuit <ArrowRight size={14} />
            </Link>
            <div className="flex items-center gap-2 mt-4 text-gray-400 text-xs">
              <Mail size={12} />
              <span>contact@immoscout.com</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">&copy; 2026 ImmoScout. Tous droits reserves.</p>
          <div className="flex gap-6">
            <Link to="/about" className="text-gray-400 hover:text-gray-600 transition-colors text-xs">Mentions legales</Link>
            <Link to="/about" className="text-gray-400 hover:text-gray-600 transition-colors text-xs">Confidentialite</Link>
            <Link to="/about" className="text-gray-400 hover:text-gray-600 transition-colors text-xs">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterHome;
