import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Check, Zap, ShoppingCart, Search, Lock, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import FooterHome from '@/components/partials/footer/footer.home';
import HeaderHome from '@/components/partials/header/header.home';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Tarifs: React.FC = () => {
    const popularZones = [
        { id: 1, name: 'Lyon', cp: '69000', price: 49, status: 'LIBRE' },
        { id: 2, name: 'Paris 15', cp: '75015', price: 89, status: 'VENDU' },
        { id: 3, name: 'Marseille', cp: '13000', price: 45, status: 'LIBRE' },
        { id: 4, name: 'Bordeaux', cp: '33000', price: 55, status: 'VENDU' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <HeaderHome />

            <section className="relative z-10 px-4 pt-32 pb-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <Badge className="mb-6 bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-1">
                        Modele de Concession Exclusive
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                        Achetez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Territoire</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                        Ici, vous ne payez pas un logiciel, vous achetez une <span className="text-gray-900 font-bold">exclusivite geographique</span>.
                        Un code postal = Un seul chasseur.
                    </p>
                </div>
            </section>

            <section className="relative z-10 px-4 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingCart className="text-emerald-600 h-5 w-5" />
                                Etat du Marche en Temps Reel
                            </h2>
                            <div className="flex gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Libre</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div> Vendu</div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {popularZones.map((zone) => (
                                <div key={zone.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${zone.status === 'LIBRE' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                            <MapPin className={zone.status === 'LIBRE' ? 'text-emerald-600' : 'text-red-400'} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{zone.name}</h3>
                                            <p className="text-gray-400 text-sm">Code Postal : {zone.cp}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Tarif Zone</p>
                                            <p className="text-2xl font-black text-gray-900">{zone.price}EUR<span className="text-sm text-gray-400 font-normal">/mois</span></p>
                                        </div>
                                        {zone.status === 'LIBRE' ? (
                                            <Link to="/register">
                                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-emerald-600/20">
                                                    Acquerir cette zone
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button disabled className="bg-gray-100 text-gray-400 cursor-not-allowed h-12 px-8 rounded-xl border border-gray-200">
                                                <Lock className="mr-2 h-4 w-4" /> Zone Occupee
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-emerald-50 border-t border-emerald-100 text-center">
                            <p className="text-sm text-emerald-700 flex items-center justify-center gap-2">
                                <Info size={16} />
                                Plus de 500 autres zones disponibles sur notre carte interactive apres inscription.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                                Pourquoi l'exclusivite est votre <span className="text-emerald-600">meilleur atout</span> ?
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { t: "Zero Concurrence", d: "Vous etes le seul a recevoir l'alerte pour votre ville." },
                                    { t: "Rapidite Totale", d: "Le robot n8n envoie l'email au proprietaire avant tout le monde." },
                                    { t: "ROI Garanti", d: "Une seule sous-location trouvee rembourse 2 ans d'abonnement." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="mt-1 bg-emerald-50 p-1.5 rounded-full"><Check className="text-emerald-600" size={18} /></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.t}</h4>
                                            <p className="text-gray-500 text-sm">{item.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                            <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
                                <div className="space-y-4">
                                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                                    <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                                    <div className="pt-4 flex justify-center">
                                        <div className="w-full h-40 bg-gray-50 rounded-xl border border-emerald-200 flex items-center justify-center">
                                            <span className="text-emerald-600 font-mono animate-pulse">Scanning Leboncoin... 69000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-24 text-center">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-600 to-teal-600 p-12 rounded-[2rem] shadow-2xl shadow-emerald-600/20">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Pret a verrouiller votre ville ?</h2>
                    <p className="text-emerald-100 mb-10 text-lg">Ne laissez pas un autre investisseur prendre votre secteur.</p>
                    <Link to="/register">
                        <Button className="bg-white text-emerald-700 hover:bg-emerald-50 text-xl font-black px-12 py-8 rounded-2xl shadow-xl transition-transform hover:scale-105">
                            Ouvrir la Carte et Reserver <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            <FooterHome />
        </div>
    );
};

export default Tarifs;
