import { Link } from "react-router-dom"
import { MapPin } from "lucide-react"
const FooterHome = () => {
    return (
        <div>
            <footer className="relative z-10 px-4 py-8 border-t border-gray-800">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <MapPin className="text-white" size={16} />
                            </div>
                            <span className="text-white font-bold">ImmoScout</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            <p>&copy; 2026 ImmoScout. Tous droits réservés.</p>
                        </div>
                        <div className="flex space-x-6">
                            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Accueil
                            </Link>
                            <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                À propos
                            </Link>
                            <Link to="/tarifs" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Tarrif
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default FooterHome