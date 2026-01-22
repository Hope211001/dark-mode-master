import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
const hero = () => {
  return (
    <div>
        <section className="relative z-10 px-4 py-32 text-center"> {/* J'ai augmenté py-20 à py-32 pour compenser le menu fixe */}
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
    </div>
  )
}

export default hero