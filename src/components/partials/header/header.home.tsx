import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
const HeaderHome = () => {
    return (
        <div>
            <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-gray-900/80 backdrop-blur-md px-4 py-4">
                <nav className="max-w-7xl mx-auto flex items-center justify-between">

                    {/* GAUCHE : Logo */}
                    <Link to="/">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <MapPin className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">ImmoScout</span>
                        </div>
                    </Link>

                    {/* DROITE : Mélange Navigation + Authentification */}
                    <div className="flex items-center space-x-1 md:space-x-6">

                        {/* Liens de Navigation (Cachés sur très petit mobile) */}
                        <div className="hidden sm:flex items-center space-x-6 mr-2">
                            <Link
                                to="/about"
                                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                À propos
                            </Link>
                        </div> 
                        <div className="hidden sm:flex items-center space-x-6 mr-2">
                            <Link
                                to="/tarifs"
                                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                            >
                               Tarifs
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
        </div>
    )
}
export default HeaderHome


