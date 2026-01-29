import React, { useState } from 'react';
import { 
  ArrowRight, MapPin, TrendingUp, Mail, Shield, Clock, Zap, 
  Menu, X, CheckCircle, Database, BarChart, Lock, Search, 
  AlertTriangle, MousePointerClick, ChevronDown 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderHome = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    
      const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
      };

    return (
        <div>
            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                <MapPin className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">ImmoScout</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#problem" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Le Problème</a>
                            <a href="#solution" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">La Solution</a>
                            <a href="#concession" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Exclusivité</a>
                            <Link to="/tarifs" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Tarifs</Link>
                            <div className="h-4 w-px bg-gray-700"></div>
                            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Connexion</Link>
                            <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg transform hover:-translate-y-0.5">
                                Essai Gratuit
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-gray-950 border-b border-gray-800 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5 z-50">
                        <a href="#problem" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2 border-b border-gray-800">Le Problème</a>
                        <a href="#solution" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2 border-b border-gray-800">La Solution</a>
                        <Link to="/tarifs" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2 border-b border-gray-800">Tarifs</Link>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2">Connexion</Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white py-4 rounded-xl text-center font-bold text-lg mt-2 shadow-blue-900/20 shadow-lg">Commencer</Link>
                    </div>
                )}
            </header>
        </div>
    )
}
export default HeaderHome


