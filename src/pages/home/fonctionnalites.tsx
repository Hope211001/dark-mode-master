import { Link } from "react-router-dom";
import {
  Search, BarChart, Mail, ArrowRight, Clock, AlertTriangle,
  MousePointerClick, Shield, Database, Lock, Zap, CheckCircle, Star,
} from "lucide-react";
import HeaderHome from "@/components/partials/header/header.home";
import FooterHome from "@/components/partials/footer/footer.home";

const steps = [
  {
    num: 1,
    title: "Recuperation (Le Chasseur)",
    desc: "Notre robot interroge Apify pour scanner les dernieres annonces Leboncoin, PAP.fr et SeLoger. Il filtre instantanement pour verifier si l'annonce est dans votre zone exclusive.",
    icon: Search,
    color: "blue",
    tags: ["Apify", "PostgreSQL", "n8n"],
  },
  {
    num: 2,
    title: "Enrichissement (Le Cerveau)",
    desc: "On ne regarde pas juste le prix. On interroge Beyond Pricing. Si Loyer = 800EUR mais Potentiel Airbnb = 2500EUR, l'annonce recoit un score de 9.5/10.",
    icon: BarChart,
    color: "indigo",
    tags: ["Beyond Pricing", "Math.js", "Scoring"],
  },
  {
    num: 3,
    title: "Contact (Le Bras Arme)",
    desc: "Si le score est superieur a 7/10, le systeme attend 20 min (pour simuler un humain) et envoie un email personnalise depuis votre adresse. Il relance meme a J+2 si pas de reponse.",
    icon: Mail,
    color: "purple",
    tags: ["Gmail API", "Outlook", "n8n"],
  },
];

const problems = [
  { icon: Clock, color: "red", title: "Trop de temps perdu", desc: "Vous passez vos soirees a rafraichir Leboncoin. Quand vous appelez enfin, l'appartement est deja sous offre." },
  { icon: AlertTriangle, color: "orange", title: "Rentabilite incertaine", desc: "Vous estimez la rentabilite au doigt mouille. Sans donnees precises, vous risquez d'investir dans un bien non rentable." },
  { icon: MousePointerClick, color: "yellow", title: "Concurrence deloyale", desc: "Sur les autres logiciels d'alerte, vous etes 500 sur la meme ville. C'est la course au clic." },
];

const features = [
  { icon: Zap, title: "Scan toutes les 15 min", desc: "3 plateformes scannees en continu" },
  { icon: Star, title: "Scoring intelligent", desc: "Basee sur les donnees Airbnb reelles" },
  { icon: Shield, title: "Zone exclusive", desc: "Zero concurrence sur la plateforme" },
  { icon: Mail, title: "Contact automatise", desc: "Emails envoyes depuis votre adresse" },
  { icon: Database, title: "Dashboard complet", desc: "Tous vos leads en un seul endroit" },
  { icon: CheckCircle, title: "Relance automatique", desc: "Suivi J+2 si pas de reponse" },
];

const colorMap: Record<string, { gradient: string; border: string; shadow: string; bg: string; text: string }> = {
  blue: { gradient: "from-blue-600 to-blue-700", border: "border-blue-500/30", shadow: "shadow-blue-900/20", bg: "bg-blue-600/20", text: "text-blue-400" },
  indigo: { gradient: "from-indigo-600 to-indigo-700", border: "border-indigo-500/30", shadow: "shadow-indigo-900/20", bg: "bg-indigo-600/20", text: "text-indigo-400" },
  purple: { gradient: "from-purple-600 to-purple-700", border: "border-purple-500/30", shadow: "shadow-purple-900/20", bg: "bg-purple-600/20", text: "text-purple-400" },
  red: { gradient: "from-red-600 to-red-700", border: "border-red-500/30", shadow: "shadow-red-900/20", bg: "bg-red-500/10", text: "text-red-400" },
  orange: { gradient: "from-orange-600 to-orange-700", border: "border-orange-500/30", shadow: "shadow-orange-900/20", bg: "bg-orange-500/10", text: "text-orange-400" },
  yellow: { gradient: "from-yellow-600 to-yellow-700", border: "border-yellow-500/30", shadow: "shadow-yellow-900/20", bg: "bg-yellow-500/10", text: "text-yellow-400" },
};

const Fonctionnalites = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] -left-[10%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
      </div>

      <HeaderHome />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-16 md:pt-44 md:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
            <Zap size={14} className="text-green-400" />
            <span className="text-xs md:text-sm font-medium text-green-400 uppercase tracking-wide">Comment ca marche</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1]">
            L'IA qui travaille <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">pendant que vous dormez</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deux workflows n8n puissants tournent en arriere-plan toutes les 15 minutes pour detecter, scorer et contacter automatiquement.
          </p>
        </div>
      </section>

      {/* Le probleme */}
      <section className="relative z-10 py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">L'investissement locatif classique est casse</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Les meilleures affaires partent en moins de 30 minutes. Si vous cherchez encore manuellement, vous avez deja perdu.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((p, i) => {
              const c = colorMap[p.color];
              return (
                <div key={i} className={`bg-gray-950 p-8 rounded-2xl border border-gray-800 hover:${c.border} transition-all duration-300 group`}>
                  <div className={`w-14 h-14 ${c.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <p.icon className={c.text} size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow 3 etapes */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">3 etapes, 0 effort</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Le systeme fait tout. Vous recoltez les resultats.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 -translate-y-1/2 z-0" />
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step) => {
                const c = colorMap[step.color];
                return (
                  <div key={step.num} className={`group relative bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl ${c.shadow}`}>
                    <div className="absolute -top-6 left-8 bg-gray-900 border border-gray-700 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20 text-lg">
                      {step.num}
                    </div>
                    <div className={`w-16 h-16 ${c.bg} rounded-2xl flex items-center justify-center mb-6 ${c.text}`}>
                      <step.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Le modele exclusivite */}
      <section className="relative z-10 py-24 bg-gray-800/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-15 animate-pulse" />
              <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-semibold flex items-center gap-2"><Database size={18} className="text-blue-400" /> Base de donnees Zones</h4>
                  <div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
                </div>
                <div className="space-y-3">
                  {[
                    { ville: "Lyon (69)", user: "thomas@invest.com", libre: false },
                    { ville: "Bordeaux (33)", user: null, libre: true },
                    { ville: "Paris (75)", user: "sophie@immo.fr", libre: false },
                  ].map((z, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${z.libre ? "bg-green-900/10 border-green-500/30 scale-105 shadow-lg" : "bg-gray-800/40 border-red-900/30"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${z.libre ? "bg-green-500 animate-ping" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`} />
                        <div>
                          <span className={`font-mono block text-sm ${z.libre ? "text-white font-bold" : "text-gray-300"}`}>Zone: {z.ville}</span>
                          <span className={`text-xs ${z.libre ? "text-green-400" : "text-gray-500"}`}>{z.libre ? "Statut: DISPONIBLE" : `Utilisateur: ${z.user}`}</span>
                        </div>
                      </div>
                      {z.libre ? (
                        <button className="text-xs font-bold text-gray-900 bg-green-400 px-3 py-1 rounded hover:bg-green-300 transition-colors">Reserver</button>
                      ) : (
                        <Lock size={16} className="text-red-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold mb-4">
                Modele Business Unique
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">La "Concession" :<br />Fini la concurrence interne.</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Contrairement aux logiciels classiques ou tout le monde se bat pour les memes annonces, ici nous vendons de l'exclusivite. C'est votre territoire.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1"><Shield className="text-green-400" size={18} /></div>
                  <div><h4 className="text-white font-bold text-lg">Zero concurrence sur la plateforme</h4><p className="text-gray-400 text-sm mt-1">Si vous achetez la zone "Lyon", personne d'autre ne recevra les alertes pour Lyon.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1"><Database className="text-blue-400" size={18} /></div>
                  <div><h4 className="text-white font-bold text-lg">Garantie Technique</h4><p className="text-gray-400 text-sm mt-1">Notre base de donnees verifie qu'un code postal n'appartient qu'a un seul client actif.</p></div>
                </li>
              </ul>
              <div className="mt-10">
                <Link to="/tarifs" className="inline-flex items-center text-white border-b border-blue-500 hover:text-blue-400 transition-colors pb-1 font-medium">
                  Voir les zones disponibles <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toutes les fonctionnalites */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Un outil complet pour automatiser votre prospection immobiliere.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/30 hover:bg-gray-900 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <f.icon className="text-blue-400" size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-center shadow-2xl border border-white/10">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl animate-pulse" />
            <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">Pret a automatiser ?</h2>
            <p className="relative z-10 text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Commencez gratuitement et voyez les premiers leads arriver en quelques heures.</p>
            <Link to="/register" className="relative z-10 inline-block bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
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
