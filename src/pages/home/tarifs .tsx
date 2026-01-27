import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Check, Zap, Calendar, Star, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import FooterHome from '@/components/partials/footer/footer.home';
import HeaderHome from '@/components/partials/header/header.home';

const Tarifs: React.FC = () => {

    // Configuration des 3 options de durée (Même produit, facturation différente)
    const plans = [
        {
            name: 'Mensuel',
            durationLabel: '1 Mois',
            price: 49,
            totalPriceDisplay: '49€',
            billingText: 'Facturé tous les mois',
            savings: null,
            icon: Clock,
            color: 'blue',
            description: 'Liberté totale. Idéal pour tester une zone sur une courte période.',
            popular: false,
            cta: 'Choisir l\'offre Mensuelle'
        },
        {
            name: 'Trimestriel',
            durationLabel: '3 Mois',
            price: 45, // Prix ramené au mois pour comparaison visuelle (optionnel)
            totalPriceDisplay: '135€', // 45 * 3
            billingText: 'Facturé tous les 3 mois',
            savings: '-10%',
            icon: Calendar,
            color: 'purple',
            description: 'Parfait pour se lancer sérieusement et suivre un trimestre complet.',
            popular: true,
            cta: 'Choisir l\'offre Trimestrielle'
        },
        {
            name: 'Annuel',
            durationLabel: '1 An',
            price: 39, // Prix ramené au mois
            totalPriceDisplay: '470€', // ~39 * 12
            billingText: 'Facturé une fois par an',
            savings: '-20%',
            icon: Star,
            color: 'orange',
            description: 'L\'offre la plus rentable pour les investisseurs long terme.',
            popular: false,
            cta: 'Choisir l\'offre Annuelle'
        }
    ];

    // Les fonctionnalités sont identiques pour toutes les durées
    const commonFeatures = [
        'Accès complet à la carte interactive',
        'Réservation d\'1 Zone Exclusive (ex: Lyon)',
        'Alertes en temps réel (Scraping)',
        'Scoring de rentabilité inclus',
        'Support client prioritaire',
        'Garantie satisfait ou remboursé 30j'
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                bg: 'from-blue-500 to-cyan-600',
                border: 'border-blue-500/50',
                badge: 'bg-blue-500/20 text-blue-300',
                button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
            },
            purple: {
                bg: 'from-purple-500 to-pink-600',
                border: 'border-purple-500/50',
                badge: 'bg-purple-500/20 text-purple-300',
                button: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'
            },
            orange: {
                bg: 'from-orange-500 to-red-600',
                border: 'border-orange-500/50',
                badge: 'bg-orange-500/20 text-orange-300',
                button: 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/30'
            }
        };
        return colors[color as keyof typeof colors];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-sans text-gray-100">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            <HeaderHome />

            {/* Hero Section */}
            <section className="relative z-10 px-4 pt-32 pb-16 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full shadow-lg">
                        <MapPin size={16} className="text-blue-400" />
                        <span className="text-gray-300 text-sm font-medium">1 Abonnement = 1 Zone Exclusive</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Choisissez votre durée d'<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">engagement</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Accédez à la même puissance technologique, peu importe la durée. 
                        Abonnez-vous, ouvrez la carte, et sélectionnez votre ville pour commencer à recevoir les leads.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="relative z-10 px-4 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {plans.map((plan, index) => {
                            const colors = getColorClasses(plan.color);
                            const Icon = plan.icon;

                            return (
                                <div
                                    key={index}
                                    className={`relative flex flex-col bg-gray-800/40 backdrop-blur-md border rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 ${
                                        plan.popular
                                            ? 'border-purple-500 shadow-2xl shadow-purple-900/20 scale-105 z-10'
                                            : 'border-gray-700 hover:border-gray-600'
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                                                Recommandé
                                            </span>
                                        </div>
                                    )}

                                    {/* Header Card */}
                                    <div className="mb-6 flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${colors.badge}`}>
                                                Durée : {plan.durationLabel}
                                            </div>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg`}>
                                            <Icon className="text-white" size={24} />
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-6 h-10">
                                        {plan.description}
                                    </p>

                                    {/* Price Section */}
                                    <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 text-center">
                                        {plan.savings && (
                                            <div className="text-green-400 text-sm font-bold mb-1">
                                                Économisez {plan.savings}
                                            </div>
                                        )}
                                        <div className="text-4xl font-extrabold text-white">
                                            {plan.totalPriceDisplay}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-2 uppercase tracking-wide">
                                            {plan.billingText}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-8">
                                        <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Inclus dans l'offre :</p>
                                        <ul className="space-y-3">
                                            {commonFeatures.map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <Check className="text-green-400 mr-3 flex-shrink-0 mt-0.5" size={18} />
                                                    <span className="text-gray-300 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        to="/register"
                                        className={`w-full py-4 rounded-xl font-bold text-center transition-all shadow-lg mt-auto ${
                                            plan.popular
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/40'
                                                : `${colors.button} text-white`
                                        }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                    
                                    <p className="text-center text-gray-600 text-xs mt-4">
                                        Accès immédiat après paiement
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            <section className="relative z-10 px-4 py-16 bg-gray-800/30 border-y border-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-12">Comment ça marche ?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group">
                            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600 group-hover:border-blue-500 transition-colors">
                                <span className="text-xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">Choisissez votre durée</h3>
                            <p className="text-gray-400 text-sm">1 mois, 3 mois ou 1 an. Plus c'est long, moins c'est cher.</p>
                        </div>
                        <div className="group">
                            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600 group-hover:border-purple-500 transition-colors">
                                <span className="text-xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">Sélectionnez la zone</h3>
                            <p className="text-gray-400 text-sm">Accédez à la carte et cliquez sur la ville que vous voulez verrouiller.</p>
                        </div>
                        <div className="group">
                            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600 group-hover:border-green-500 transition-colors">
                                <span className="text-xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">Recevez les leads</h3>
                            <p className="text-gray-400 text-sm">Le système scanne pour vous et vous envoie les alertes exclusives.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative z-10 px-4 py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 md:p-12">
                        <div className="flex items-start mb-8">
                            <ShieldCheck className="text-green-400 w-12 h-12 mr-6 flex-shrink-0" />
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Garantie 30 Jours</h3>
                                <p className="text-gray-400">
                                    Nous sommes convaincus de la valeur de notre outil. Si vous ne trouvez pas d'opportunité pertinente dans votre zone exclusive durant les 30 premiers jours, envoyez-nous un simple email et nous vous remboursons intégralement votre abonnement.
                                </p>
                            </div>
                        </div>
                        <div className="h-px w-full bg-gray-700 my-8"></div>
                        <h4 className="text-white font-bold mb-6">Questions fréquentes</h4>
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-blue-400 font-semibold mb-1">Que se passe-t-il après le paiement ?</h5>
                                <p className="text-sm text-gray-400">Vous êtes redirigé vers votre Dashboard. Vous verrez une carte de France. Vous pourrez alors cliquer sur la zone de votre choix pour l'activer.</p>
                            </div>
                            <div>
                                <h5 className="text-blue-400 font-semibold mb-1">Puis-je changer de zone en cours d'abonnement ?</h5>
                                <p className="text-sm text-gray-400">Oui. Vous pouvez "libérer" votre zone actuelle et en sélectionner une autre instantanément via la carte, sans frais supplémentaires.</p>
                            </div>
                            <div>
                                <h5 className="text-blue-400 font-semibold mb-1">L'abonnement se renouvelle-t-il automatiquement ?</h5>
                                <p className="text-sm text-gray-400">Oui, pour éviter que vous perdiez votre zone exclusive par inadvertance. Vous pouvez stopper le renouvellement à tout moment en un clic.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FooterHome />
        </div>
    );
};

export default Tarifs;