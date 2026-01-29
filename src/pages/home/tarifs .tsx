import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Check, Zap, ShoppingCart, 
  Search, Lock, CheckCircle2, XCircle, 
  ArrowRight, ShieldCheck, Info 
} from 'lucide-react';
import FooterHome from '@/components/partials/footer/footer.home';
import HeaderHome from '@/components/partials/header/header.home';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Tarifs: React.FC = () => {
    // Simulation des zones populaires pour la démo
    const popularZones = [
        { id: 1, name: 'Lyon', cp: '69000', price: 49, status: 'LIBRE' },
        { id: 2, name: 'Paris 15', cp: '75015', price: 89, status: 'VENDU' },
        { id: 3, name: 'Marseille', cp: '13000', price: 45, status: 'LIBRE' },
        { id: 4, name: 'Bordeaux', cp: '33000', price: 55, status: 'VENDU' },
    ];

    const purchaseSteps = [
        { title: "Trouvez", desc: "Recherchez votre ville sur la carte.", icon: Search },
        { title: "Vérifiez", desc: "Si c'est VERT, la zone est libre pour vous.", icon: CheckCircle2 },
        { title: "Dominez", desc: "Achetez l'exclusivité et recevez les leads.", icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-100">
            <HeaderHome />

            {/* Hero Section - Marketplace Style */}
            <section className="relative z-10 px-4 pt-32 pb-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 px-4 py-1">
                        Modèle de Concession Exclusive
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Achetez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Territoire</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Ici, vous ne payez pas un logiciel, vous achetez une <span className="text-white font-bold">exclusivité géographique</span>. 
                        Un code postal = Un seul chasseur.
                    </p>
                </div>
            </section>

            {/* Marketplace Live Preview - LA SECTION VERT/ROUGE */}
            <section className="relative z-10 px-4 pb-20">
                <div className="max-w-5xl mx-auto">
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingCart className="text-emerald-400 h-5 w-5" />
                                État du Marché en Temps Réel
                            </h2>
                            <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Libre</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Vendu</div>
                            </div>
                        </div>
                        
                        <div className="divide-y divide-gray-800">
                            {popularZones.map((zone) => (
                                <div key={zone.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${zone.status === 'LIBRE' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                            <MapPin className={zone.status === 'LIBRE' ? 'text-emerald-500' : 'text-red-500'} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{zone.name}</h3>
                                            <p className="text-gray-500 text-sm">Code Postal : {zone.cp}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Tarif Zone</p>
                                            <p className="text-2xl font-black text-white">{zone.price}€<span className="text-sm text-gray-500 font-normal">/mois</span></p>
                                        </div>

                                        {zone.status === 'LIBRE' ? (
                                            <Link to="/register">
                                                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-emerald-900/20">
                                                    Acquérir cette zone
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button disabled className="bg-gray-800 text-gray-500 cursor-not-allowed h-12 px-8 rounded-xl border border-gray-700">
                                                <Lock className="mr-2 h-4 w-4" /> Zone Occupée
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-6 bg-emerald-500/5 border-t border-gray-800 text-center">
                            <p className="text-sm text-emerald-400 flex items-center justify-center gap-2">
                                <Info size={16} />
                                Plus de 500 autres zones disponibles sur notre carte interactive après inscription.
                            </p>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Why Exclusive? Section */}
            <section className="relative z-10 px-4 py-20 bg-gray-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                                Pourquoi l'exclusivité est votre <span className="text-emerald-400">meilleur atout</span> ?
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { t: "Zéro Concurrence", d: "Vous êtes le seul à recevoir l'alerte pour votre ville." },
                                    { t: "Rapidité Totale", d: "Le robot n8n envoie l'email au propriétaire avant tout le monde." },
                                    { t: "ROI Garanti", d: "Une seule sous-location trouvée rembourse 2 ans d'abonnement." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="mt-1 bg-emerald-500/20 p-1 rounded-full"><Check className="text-emerald-500" size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-white">{item.t}</h4>
                                            <p className="text-gray-400 text-sm">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                            <div className="relative bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl">
                                <div className="space-y-4">
                                    <div className="h-2 w-1/2 bg-gray-700 rounded"></div>
                                    <div className="h-2 w-full bg-gray-700 rounded"></div>
                                    <div className="h-2 w-3/4 bg-gray-700 rounded"></div>
                                    <div className="pt-4 flex justify-center">
                                        <div className="w-full h-40 bg-gray-900 rounded-xl border border-emerald-500/30 flex items-center justify-center">
                                            <span className="text-emerald-500 font-mono animate-pulse">Scanning Leboncoin... 69000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="relative z-10 px-4 py-24 text-center">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-600 to-cyan-700 p-12 rounded-[2rem] shadow-2xl shadow-emerald-500/20">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Prêt à verrouiller votre ville ?</h2>
                    <p className="text-emerald-100 mb-10 text-lg">
                        Ne laissez pas un autre investisseur prendre votre secteur. 
                        Vérifiez la disponibilité maintenant.
                    </p>
                    <Link to="/register">
                        <Button className="bg-white text-emerald-950 hover:bg-gray-100 text-xl font-black px-12 py-8 rounded-2xl shadow-xl transition-transform hover:scale-105">
                            Ouvrir la Carte et Réserver <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            <FooterHome />
        </div>
    );
};

// Petit composant Card local car non importé
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`rounded-3xl border ${className}`}>{children}</div>
);

export default Tarifs;