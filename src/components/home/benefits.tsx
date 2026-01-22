import React from 'react'
import { Shield,Clock,TrendingUp,MapPin } from 'lucide-react'
const benefits = () => {
    return (
        <div>
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
        </div>
    )
}

export default benefits