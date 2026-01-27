import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Target, Users, Sparkles, TrendingUp, Shield, Zap, Heart, ArrowRight } from 'lucide-react';
import HeaderHome from '@/components/partials/header/header.home';
import FooterHome from '@/components/partials/footer/footer.home';
const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Effets de fond décoratifs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header Fixed */}
            <HeaderHome></HeaderHome>

            {/* Hero Section */}
            <section className="relative z-10 px-4 pt-32 pb-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                        <span className="text-blue-400 text-sm font-medium">✨ Notre histoire</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Une révolution dans l'<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">investissement locatif</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        ImmoScout automatise la recherche d'opportunités immobilières rentables. Notre mission : faire gagner du temps aux investisseurs et démocratiser l'accès à l'investissement locatif intelligent.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="relative z-10 px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Notre Mission
                            </h2>
                            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                Nous avons créé ImmoScout après avoir constaté que les investisseurs immobiliers passaient des heures chaque jour à chercher manuellement des opportunités sur les sites d'annonces, à calculer la rentabilité et à contacter les propriétaires.
                            </p>
                            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                Notre plateforme automatise l'ensemble de ce processus : du scraping intelligent des annonces Leboncoin, au calcul de rentabilité basé sur les données Airbnb, jusqu'à l'envoi automatisé d'emails personnalisés aux propriétaires.
                            </p>
                            <div className="flex items-center space-x-2 text-blue-400">
                                <Sparkles size={20} />
                                <span className="font-semibold">Gagnez jusqu'à 2 heures par jour</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
                                <Target className="text-blue-400 mb-4" size={32} />
                                <h3 className="text-white font-bold text-xl mb-2">Précision</h3>
                                <p className="text-gray-400 text-sm">Scoring intelligent basé sur des données réelles du marché Airbnb</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
                                <Zap className="text-purple-400 mb-4" size={32} />
                                <h3 className="text-white font-bold text-xl mb-2">Rapidité</h3>
                                <p className="text-gray-400 text-sm">Scan automatique toutes les 15 minutes pour ne rien manquer</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm">
                                <Shield className="text-green-400 mb-4" size={32} />
                                <h3 className="text-white font-bold text-xl mb-2">Exclusivité</h3>
                                <p className="text-gray-400 text-sm">Zones géographiques protégées pour éviter la concurrence</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 backdrop-blur-sm">
                                <TrendingUp className="text-orange-400 mb-4" size={32} />
                                <h3 className="text-white font-bold text-xl mb-2">Rentabilité</h3>
                                <p className="text-gray-400 text-sm">Analyse ROI précise pour chaque opportunité détectée</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comment ça marche */}
            <section className="relative z-10 px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Comment ça fonctionne ?
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Un système automatisé en 4 étapes qui travaille pour vous 24/7
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                                    <span className="text-white font-bold text-xl">1</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Scraping</h3>
                                <p className="text-gray-400 text-sm">
                                    Récupération automatique des annonces Leboncoin toutes les 15 minutes
                                </p>
                            </div>
                            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                <ArrowRight className="text-gray-600" size={24} />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                                    <span className="text-white font-bold text-xl">2</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Analyse</h3>
                                <p className="text-gray-400 text-sm">
                                    Calcul du potentiel Airbnb et scoring intelligent de rentabilité
                                </p>
                            </div>
                            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                <ArrowRight className="text-gray-600" size={24} />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                                    <span className="text-white font-bold text-xl">3</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Filtrage</h3>
                                <p className="text-gray-400 text-sm">
                                    Attribution aux utilisateurs selon leurs zones exclusives
                                </p>
                            </div>
                            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                <ArrowRight className="text-gray-600" size={24} />
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div>
                            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                                    <span className="text-white font-bold text-xl">4</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Contact</h3>
                                <p className="text-gray-400 text-sm">
                                    Envoi automatique d'emails personnalisés avec relances intelligentes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valeurs Section */}
            <section className="relative z-10 px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Nos Valeurs
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Ce qui guide notre développement au quotidien
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <Users className="text-blue-400" size={32} />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-3 text-center">Transparence</h3>
                            <p className="text-gray-400 text-center leading-relaxed">
                                Nous croyons en un système clair où chaque utilisateur sait exactement comment fonctionne notre plateforme et ses limites.
                            </p>
                        </div>

                        <div className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <Zap className="text-purple-400" size={32} />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-3 text-center">Innovation</h3>
                            <p className="text-gray-400 text-center leading-relaxed">
                                L'automatisation intelligente et l'IA au service des investisseurs pour démocratiser l'accès aux meilleures opportunités.
                            </p>
                        </div>

                        <div className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <Heart className="text-green-400" size={32} />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-3 text-center">Accompagnement</h3>
                            <p className="text-gray-400 text-center leading-relaxed">
                                Nous sommes là pour vous aider à réussir. Notre support est disponible pour vous guider dans votre stratégie d'investissement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-3xl p-12 backdrop-blur-sm">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                ImmoScout en chiffres
                            </h2>
                            <p className="text-gray-400 text-lg">
                                La puissance de l'automatisation au service de votre réussite
                            </p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text mb-2">500+</div>
                                <div className="text-gray-400 font-medium">Annonces scannées par jour</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">95%</div>
                                <div className="text-gray-400 font-medium">Taux de précision du scoring</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text mb-2">2h</div>
                                <div className="text-gray-400 font-medium">Économisées quotidiennement</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text mb-2">24/7</div>
                                <div className="text-gray-400 font-medium">Monitoring automatique</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Prêt à révolutionner votre recherche immobilière ?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Rejoignez les investisseurs qui utilisent déjà ImmoScout pour automatiser leur prospection et trouver les meilleures opportunités.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center font-semibold text-lg"
                        >
                            Commencer gratuitement
                            <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link
                            to="/abonnement"
                            className="w-full sm:w-auto bg-gray-800/50 backdrop-blur border border-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-700/50 transition-all font-semibold text-lg"
                        >
                            Voir les tarifs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <FooterHome></FooterHome>

        </div>
    );
};

export default AboutPage;