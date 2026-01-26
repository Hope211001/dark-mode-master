import React from 'react'
import { Zap, TrendingUp, Mail } from 'lucide-react'
const Features = () => {
    return (
        <div>
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
        </div>
    )
}

export default Features