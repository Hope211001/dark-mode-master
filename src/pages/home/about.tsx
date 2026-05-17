import { Link } from 'react-router-dom';
import { Target, Users, Sparkles, TrendingUp, Shield, Zap, Heart, ArrowRight } from 'lucide-react';
import HeaderHome from '@/components/partials/header/header.home';
import FooterHome from '@/components/partials/footer/footer.home';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-clay-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-clay-500/5 rounded-full blur-3xl"></div>
            </div>

            <HeaderHome />

            <section className="relative z-10 px-4 pt-32 pb-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-block mb-4 px-4 py-2 bg-clay-50 border border-clay-200 rounded-full">
                        <span className="text-clay-700 text-sm font-medium">Notre histoire</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Une revolution dans l'<span className="bg-gradient-to-r from-clay-600 to-clay-500 bg-clip-text text-transparent">investissement locatif</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                        ImmoScout automatise la recherche d'opportunites immobilieres rentables. Notre mission : faire gagner du temps aux investisseurs.
                    </p>
                </div>
            </section>

            <section className="relative z-10 px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
                            <p className="text-gray-500 text-lg mb-6 leading-relaxed">Nous avons cree ImmoScout apres avoir constate que les investisseurs passaient des heures chaque jour a chercher manuellement des opportunites.</p>
                            <p className="text-gray-500 text-lg mb-6 leading-relaxed">Notre plateforme automatise l'ensemble du processus : du scraping intelligent au calcul de rentabilite, jusqu'a l'envoi automatise d'emails.</p>
                            <div className="flex items-center space-x-2 text-clay-600"><Sparkles size={20} /><span className="font-semibold">Gagnez jusqu'a 2 heures par jour</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Target, title: "Precision", desc: "Scoring intelligent base sur des donnees reelles du marche Airbnb", color: "emerald" },
                                { icon: Zap, title: "Rapidite", desc: "Scan automatique toutes les 15 minutes pour ne rien manquer", color: "purple" },
                                { icon: Shield, title: "Exclusivite", desc: "Zones geographiques protegees pour eviter la concurrence", color: "teal" },
                                { icon: TrendingUp, title: "Rentabilite", desc: "Analyse ROI precise pour chaque opportunite detectee", color: "amber" },
                            ].map((item) => (
                                <div key={item.title} className={`bg-${item.color}-50 border border-${item.color}-100 rounded-2xl p-6`}>
                                    <item.icon className={`text-${item.color}-600 mb-4`} size={32} />
                                    <h3 className="text-gray-900 font-bold text-xl mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Comment ca fonctionne ?</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Un systeme automatise en 4 etapes qui travaille pour vous 24/7</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { num: "1", title: "Scraping", desc: "Recuperation automatique des annonces toutes les 15 minutes", color: "emerald" },
                            { num: "2", title: "Analyse", desc: "Calcul du potentiel Airbnb et scoring intelligent", color: "teal" },
                            { num: "3", title: "Filtrage", desc: "Attribution aux utilisateurs selon leurs zones exclusives", color: "cyan" },
                            { num: "4", title: "Contact", desc: "Envoi automatique d'emails personnalises", color: "emerald" },
                        ].map((step, i) => (
                            <div key={i} className="relative">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-clay-200 hover:shadow-md transition-all duration-300">
                                    <div className={`w-12 h-12 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                                        <span className="text-white font-bold text-xl">{step.num}</span>
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm">{step.desc}</p>
                                </div>
                                {i < 3 && <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2"><ArrowRight className="text-gray-300" size={24} /></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Ce qui guide notre developpement au quotidien</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Transparence", desc: "Nous croyons en un systeme clair ou chaque utilisateur sait exactement comment fonctionne notre plateforme.", color: "emerald" },
                            { icon: Zap, title: "Innovation", desc: "L'automatisation intelligente au service des investisseurs pour democratiser l'acces aux meilleures opportunites.", color: "purple" },
                            { icon: Heart, title: "Accompagnement", desc: "Nous sommes la pour vous aider a reussir. Notre support est disponible pour vous guider.", color: "teal" },
                        ].map((item) => (
                            <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-center">
                                <div className={`w-16 h-16 bg-${item.color}-50 rounded-full flex items-center justify-center mb-6 mx-auto`}>
                                    <item.icon className={`text-${item.color}-600`} size={32} />
                                </div>
                                <h3 className="text-gray-900 font-bold text-xl mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-clay-50 to-clay-50 border border-clay-200 rounded-3xl p-12">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">ImmoScout en chiffres</h2>
                            <p className="text-gray-500 text-lg">La puissance de l'automatisation au service de votre reussite</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { val: "500+", label: "Annonces scannees par jour", color: "from-clay-600 to-clay-600" },
                                { val: "95%", label: "Taux de precision du scoring", color: "from-purple-600 to-indigo-600" },
                                { val: "2h", label: "Economisees quotidiennement", color: "from-clay-600 to-cyan-600" },
                                { val: "24/7", label: "Monitoring automatique", color: "from-amber-600 to-orange-600" },
                            ].map((s) => (
                                <div key={s.val} className="text-center">
                                    <div className={`text-5xl font-extrabold text-transparent bg-gradient-to-r ${s.color} bg-clip-text mb-2`}>{s.val}</div>
                                    <div className="text-gray-500 font-medium">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Pret a revolutionner votre recherche ?</h2>
                    <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">Rejoignez les investisseurs qui utilisent deja ImmoScout.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto bg-gradient-to-r from-clay-600 to-clay-600 text-white px-8 py-4 rounded-lg hover:from-clay-700 hover:to-clay-700 transition-all shadow-lg flex items-center justify-center font-semibold text-lg">
                            Commencer gratuitement <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link to="/tarifs" className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg">
                            Voir les tarifs
                        </Link>
                    </div>
                </div>
            </section>

            <FooterHome />
        </div>
    );
};

export default AboutPage;
