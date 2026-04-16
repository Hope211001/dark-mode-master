import { useState } from 'react';
import { MapPin, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: "Fonctionnalités", href: "/fonctionnalites" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const HeaderHome = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const dashboardLink = user?.role === 'admin' ? '/admin' : '/client';

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ImmoScout</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-5 w-px bg-gray-700 mx-2" />

            {isAuthenticated ? (
              <Link
                to={dashboardLink}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:-translate-y-0.5"
              >
                <LayoutDashboard size={16} />
                Mon Espace {user?.role === 'admin' ? '(Admin)' : ''}
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">Connexion</Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5">
                  Essai Gratuit
                </Link>
              </>
            )}
          </nav>

          <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-gray-950/98 backdrop-blur-xl border-b border-gray-800 p-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-5 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg py-3 px-4 rounded-lg transition-colors ${
                location.pathname === link.href ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-gray-800 my-2" />
          {isAuthenticated ? (
            <Link to={dashboardLink} onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white py-4 rounded-xl text-center font-bold text-lg mt-2 flex items-center justify-center gap-2">
              <LayoutDashboard size={20} /> Mon Espace
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-3 px-4">Connexion</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl text-center font-bold text-lg mt-2">Commencer</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default HeaderHome;
