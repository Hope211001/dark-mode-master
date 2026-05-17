import { Link } from "react-router-dom";
import {
  Search, BarChart, Mail, ArrowRight, Clock, AlertTriangle,
  MousePointerClick, Shield, Database, Lock, Zap, CheckCircle, Star,
} from "lucide-react";
import HeaderHome from "@/components/partials/header/header.home";
import FooterHome from "@/components/partials/footer/footer.home";

const steps = [
  { num: 1, title: "Recuperation (Le Chasseur)", desc: "Notre robot interroge Apify pour scanner les dernieres annonces Leboncoin. Il filtre instantanement pour verifier si l'annonce est dans votre zone exclusive.", icon: Search, color: "emerald", tags: ["Apify", "PostgreSQL", "n8n"] },
  { num: 2, title: "Enrichissement (Le Cerveau)", desc: "On ne regarde pas juste le prix. On interroge Beyond Pricing. Si Loyer = 800EUR mais Potentiel Airbnb = 2500EUR, l'annonce recoit un score de 9.5/10.", icon: BarChart, color: "teal", tags: ["Beyond Pricing", "Math.js", "Scoring"] },
  { num: 3, title: "Contact (Le Bras Arme)", desc: "Si le score est superieur a 7/10, le systeme attend 20 min et envoie un email personnalise depuis votre adresse. Il relance meme a J+2 si pas de reponse.", icon: Mail, color: "cyan", tags: ["Gmail API", "Outlook", "n8n"] },
];

const problems = [
  { icon: Clock, title: "Trop de temps perdu", desc: "Vous passez vos soirees a rafraichir Leboncoin. Quand vous appelez enfin, l'appartement est deja sous offre.", bg: "bg-red-50", iconColor: "text-red-500", border: "hover:border-red-200" },
  { icon: AlertTriangle, title: "Rentabilite incertaine", desc: "Vous estimez la rentabilite au doigt mouille. Sans donnees precises, vous risquez d'investir dans un bien non rentable.", bg: "bg-amber-50", iconColor: "text-amber-500", border: "hover:border-amber-200" },
  { icon: MousePointerClick, title: "Concurrence deloyale", desc: "Sur les autres logiciels d'alerte, vous etes 500 sur la meme ville. C'est la course au clic.", bg: "bg-orange-50", iconColor: "text-orange-500", border: "hover:border-orange-200" },
];

const features = [
  { icon: Zap, title: "Scan toutes les 15 min", desc: "3 plateformes scannees en continu" },
  { icon: Star, title: "Scoring intelligent", desc: "Basee sur les donnees Airbnb reelles" },
  { icon: Shield, title: "Zone exclusive", desc: "Zero concurrence sur la plateforme" },
  { icon: Mail, title: "Contact automatise", desc: "Emails envoyes depuis votre adresse" },
  { icon: Database, title: "Dashboard complet", desc: "Tous vos leads en un seul endroit" },
  { icon: CheckCircle, title: "Relance automatique", desc: "Suivi J+2 si pas de reponse" },
];

const Fonctionnalites = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-clay-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] -left-[10%] w-[500px] h-[500px] bg-clay-500/5 rounded-full blur-[120px]" />
      </div>

      <HeaderHome />

      <section className="relative z-10 pt-32 pb-16 md:pt-44 md:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay-50 border border-clay-200 mb-8">
            <Zap size={14} className="text-clay-600" />
            <span className="text-xs md:text-sm font-medium text-clay-700 uppercase tracking-wide">Comment ca marche</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1]">
            L'IA qui travaille <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay-600 via-clay-500 to-cyan-500">pendant que vous dormez</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Deux workflows n8n puissants tournent en arriere-plan toutes les 15 minutes.
          </p>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">L'investissement locatif classique est casse</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Les meilleures affaires partent en moins de 30 minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((p, i) => (
              <div key={i} className={`bg-white p-8 rounded-2xl border border-gray-200 ${p.border} transition-all duration-300 group hover:shadow-lg`}>
                <div className={`w-14 h-14 ${p.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <p.icon className={p.iconColor} size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">3 etapes, 0 effort</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Le systeme fait tout. Vous recoltez les resultats.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-clay-100 via-clay-100 to-cyan-100 -translate-y-1/2 z-0" />
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step) => (
                <div key={step.num} className={`group relative bg-white border border-gray-200 rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:border-${step.color}-200`}>
                  <div className={`absolute -top-6 left-8 bg-gradient-to-r from-${step.color}-600 to-${step.color}-700 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20 text-lg`}>
                    {step.num}
                  </div>
                  <div className={`w-16 h-16 bg-${step.color}-50 rounded-2xl flex items-center justify-center mb-6 text-${step.color}-600`}>
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-200">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 bg-gradient-to-br from-clay-600 to-clay-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-semibold flex items-center gap-2"><Database size={18} /> Base de donnees Zones</h4>
                  <div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
                </div>
                <div className="space-y-3">
                  {[
                    { ville: "Lyon (69)", user: "thomas@invest.com", libre: false },
                    { ville: "Bordeaux (33)", user: null, libre: true },
                    { ville: "Paris (75)", user: "sophie@immo.fr", libre: false },
                  ].map((z, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${z.libre ? "bg-white/15 border-white/30 scale-105 shadow-lg" : "bg-white/5 border-white/10"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${z.libre ? "bg-white" : "bg-red-300"}`} />
                        <div>
                          <span className={`font-mono block text-sm ${z.libre ? "text-white font-bold" : "text-clay-100"}`}>Zone: {z.ville}</span>
                          <span className={`text-xs ${z.libre ? "text-white/80" : "text-clay-200/60"}`}>{z.libre ? "Statut: DISPONIBLE" : `Utilisateur: ${z.user}`}</span>
                        </div>
                      </div>
                      {z.libre ? (
                        <button className="text-xs font-bold text-clay-700 bg-white px-3 py-1 rounded hover:bg-clay-50 transition-colors">Reserver</button>
                      ) : (
                        <Lock size={16} className="text-red-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/15 border border-white/20 text-white text-sm font-bold mb-4">
                Modele Business Unique
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">La "Concession" :<br />Fini la concurrence interne.</h2>
              <p className="text-lg text-clay-100 mb-8 leading-relaxed">Contrairement aux logiciels classiques, ici nous vendons de l'exclusivite. C'est votre territoire.</p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 mt-1"><Shield className="text-white" size={18} /></div>
                  <div><h4 className="text-white font-bold text-lg">Zero concurrence</h4><p className="text-clay-100 text-sm mt-1">Si vous achetez la zone "Lyon", personne d'autre ne recevra les alertes pour Lyon.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 mt-1"><Database className="text-white" size={18} /></div>
                  <div><h4 className="text-white font-bold text-lg">Garantie Technique</h4><p className="text-clay-100 text-sm mt-1">Notre base de donnees verifie qu'un code postal n'appartient qu'a un seul client actif.</p></div>
                </li>
              </ul>
              <div className="mt-10">
                <Link to="/tarifs" className="inline-flex items-center text-white border-b border-white/50 hover:border-white transition-colors pb-1 font-medium">
                  Voir les zones disponibles <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Un outil complet pour automatiser votre prospection immobiliere.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-clay-200 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-clay-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-clay-100 transition-colors">
                  <f.icon className="text-clay-600" size={24} />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-clay-600 to-clay-700 p-8 md:p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl animate-pulse" />
            <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">Pret a automatiser ?</h2>
            <p className="relative z-10 text-clay-100 text-lg mb-10 max-w-2xl mx-auto">Commencez gratuitement et voyez les premiers leads arriver en quelques heures.</p>
            <Link to="/register" className="relative z-10 inline-block bg-white text-clay-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-clay-50 transition-all shadow-xl hover:scale-105">
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>

      <FooterHome />
    </div>
  );
};

export default Fonctionnalites;
