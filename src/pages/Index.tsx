import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Zap, Search, BarChart, Mail,
  ChevronDown, CheckCircle, Star, Play, Sparkles,
  TrendingUp, Clock, Users, Eye, Phone,
} from "lucide-react";
import FooterHome from "@/components/partials/footer/footer.home";
import HeaderHome from "@/components/partials/header/header.home";

const LandingPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Est-ce que je peux changer de zone ?", a: "Oui, a tout moment. Vous pouvez liberer votre zone et en prendre une autre directement depuis le dashboard." },
    { q: "Comment fonctionne le scoring ?", a: "Nous comparons le loyer mensuel demande avec le revenu potentiel genere par une location courte duree (Airbnb) dans le meme quartier via Beyond Pricing." },
    { q: "Les emails sont-ils envoyes de ma part ?", a: "Oui. Vous connectez votre compte Gmail ou Outlook. Le proprietaire voit VOTRE nom et repond directement dans VOTRE boite mail." },
    { q: "Y a-t-il un engagement ?", a: "Non. Abonnement mensuel sans engagement, annulable a tout moment." },
  ];

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-gray-100 selection:bg-blue-500 selection:text-white overflow-x-hidden">

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-600/8 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-[30%] -left-[15%] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[120px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <HeaderHome />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative z-10 pt-32 pb-20 md:pt-44 md:pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-10 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
            <span className="text-xs md:text-sm font-semibold text-blue-300 uppercase tracking-wider">Scraping Leboncoin + PAP + SeLoger</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight">
            Chassez l'immobilier
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">en pilote automatique</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Notre IA detecte les annonces, calcule la rentabilite Airbnb, et
            <span className="text-white font-medium"> contacte les proprietaires a votre place</span>.
            <br className="hidden md:block" />
            Vous, vous attendez les reponses.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/register" className="w-full sm:w-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                Verifier si ma ville est libre
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </Link>
            <Link to="/fonctionnalites" className="w-full sm:w-auto bg-white/5 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold text-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Play size={18} className="text-blue-400" />
              Comment ca marche
            </Link>
          </div>

          {/* Animated stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { val: "2h/j", label: "Temps economise", icon: Clock, color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/20", iconColor: "text-blue-400" },
              { val: "x3", label: "Rentabilite Airbnb", icon: TrendingUp, color: "from-green-500/20 to-green-600/10", border: "border-green-500/20", iconColor: "text-green-400" },
              { val: "100%", label: "Exclusivite Zone", icon: Shield, color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/20", iconColor: "text-purple-400" },
              { val: "24/7", label: "Scraping Actif", icon: Zap, color: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/20", iconColor: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} backdrop-blur-sm border ${s.border} rounded-2xl p-5 md:p-6 hover:scale-105 transition-all duration-300 group`}>
                <s.icon className={`${s.iconColor} mb-3 group-hover:scale-110 transition-transform`} size={22} />
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{s.val}</div>
                <div className="text-[10px] md:text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LOGOS / SOURCES ═══════════ */}
      <section className="relative z-10 py-12 border-y border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest font-semibold mb-8">Sources scannees en continu</p>
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {[
              { name: "Leboncoin", color: "text-orange-400" },
              { name: "PAP.fr", color: "text-sky-400" },
              { name: "SeLoger", color: "text-rose-400" },
              { name: "Beyond Pricing", color: "text-green-400" },
              { name: "n8n", color: "text-indigo-400" },
            ].map((s) => (
              <span key={s.name} className={`${s.color} font-bold text-lg md:text-xl opacity-40 hover:opacity-100 transition-opacity cursor-default`}>{s.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COMMENT CA MARCHE ═══════════ */}
      <section className="relative z-10 py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <Sparkles size={14} className="text-green-400" />
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Simple et puissant</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">3 etapes, 0 effort</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Le systeme travaille pour vous 24h/24. Vous recoltez les resultats.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              { num: "01", icon: Search, title: "Detection", desc: "Scan automatique de Leboncoin, PAP.fr et SeLoger toutes les 15 minutes. Les nouvelles annonces sont captees instantanement.", gradient: "from-blue-600 to-blue-700", glow: "shadow-blue-600/20", bg: "bg-blue-500/10", border: "hover:border-blue-500/40" },
              { num: "02", icon: BarChart, title: "Scoring IA", desc: "Analyse de rentabilite basee sur les donnees Airbnb reelles. Chaque lead recoit un score de 0 a 10 base sur le ratio loyer/revenu.", gradient: "from-indigo-600 to-indigo-700", glow: "shadow-indigo-600/20", bg: "bg-indigo-500/10", border: "hover:border-indigo-500/40" },
              { num: "03", icon: Mail, title: "Contact auto", desc: "Email personnalise envoye depuis VOTRE adresse. Relance automatique a J+2 si pas de reponse. Le proprietaire vous repond directement.", gradient: "from-purple-600 to-purple-700", glow: "shadow-purple-600/20", bg: "bg-purple-500/10", border: "hover:border-purple-500/40" },
            ].map((step) => (
              <div key={step.num} className={`relative bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-800 ${step.border} transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl ${step.glow}`}>
                {/* Number */}
                <div className={`absolute -top-5 left-8 bg-gradient-to-r ${step.gradient} text-white font-black text-sm w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
                  {step.num}
                </div>
                <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mb-6 mt-2 group-hover:scale-110 transition-transform`}>
                  <step.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/fonctionnalites" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-lg transition-colors group">
              Voir le detail complet <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ DASHBOARD PREVIEW ═══════════ */}
      <section className="relative z-10 py-28 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Votre tour de controle</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Les leads arrivent automatiquement. Tries par score. Vous n'avez plus qu'a attendre les reponses.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-3 border-b border-gray-700 bg-gray-800/80 px-5 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 bg-gray-900 rounded-lg px-4 py-1.5 text-xs text-gray-500 font-mono">dashboard.immoscout.com/leads</div>
              </div>

              {/* Leads mockup */}
              <div className="p-4 md:p-8 space-y-4">
                {[
                  { titre: "T2 Centre Ville - 45m2", ville: "Lyon 2e", prix: "850", score: "9.2", potentiel: "2400", status: "Email envoye", statusColor: "green", borderColor: "border-l-green-500", delay: "10 min" },
                  { titre: "Studio Gare Part-Dieu", ville: "Lyon 3e", prix: "600", score: "7.5", potentiel: "1200", status: "En attente 15m", statusColor: "yellow", borderColor: "border-l-yellow-500", delay: "45 min" },
                  { titre: "T3 Renove avec terrasse", ville: "Lyon 6e", prix: "1100", score: "8.8", potentiel: "3100", status: "Reponse recue!", statusColor: "blue", borderColor: "border-l-blue-500", delay: "2h" },
                ].map((lead, i) => (
                  <div key={i} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-800/30 rounded-xl border border-gray-700/50 border-l-4 ${lead.borderColor} hover:bg-gray-800/50 transition-all cursor-pointer group`}>
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shrink-0">
                        <Eye size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold group-hover:text-blue-300 transition-colors">{lead.titre}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>{lead.ville}</span>
                          <span>Loyer: {lead.prix}EUR</span>
                          <span className="text-blue-400">Il y a {lead.delay}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <div className={`text-xl font-black ${parseFloat(lead.score) >= 8.5 ? "text-green-400" : "text-yellow-400"}`}>
                          {lead.score}/10
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Potentiel: {lead.potentiel}EUR/mois</p>
                      </div>
                      <div className={`bg-${lead.statusColor}-500/15 text-${lead.statusColor}-400 border border-${lead.statusColor}-500/20 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap`}>
                        {lead.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fade overlay */}
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent flex items-end justify-center pb-6">
                <Link to="/register" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-xl z-20 hover:scale-105">
                  Voir mes leads maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EXCLUSIVITE ═══════════ */}
      <section className="relative z-10 py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 p-8 md:p-16">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                  <Shield size={14} className="text-purple-400" />
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Modele exclusif</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Votre ville,<br />votre territoire
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                  Quand vous reservez une zone, <span className="text-white font-semibold">personne d'autre ne recoit les leads</span> de cette ville. Zero concurrence.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    { icon: Shield, text: "Zone exclusivement reservee pour vous" },
                    { icon: Users, text: "Zero concurrence sur la plateforme" },
                    { icon: CheckCircle, text: "Changez de zone a tout moment" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon size={16} className="text-green-400" />
                      </div>
                      <span className="text-gray-300 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/tarifs" className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02]">
                  Voir les zones disponibles <ArrowRight size={18} />
                </Link>
              </div>

              {/* Zone cards */}
              <div className="space-y-3">
                {[
                  { ville: "Lyon (69)", libre: false, user: "thomas@..." },
                  { ville: "Bordeaux (33)", libre: true, user: null },
                  { ville: "Paris 15e (75)", libre: false, user: "sophie@..." },
                  { ville: "Marseille (13)", libre: true, user: null },
                  { ville: "Toulouse (31)", libre: false, user: "marc@..." },
                ].map((z) => (
                  <div key={z.ville} className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${z.libre ? "bg-green-500/5 border-green-500/30 shadow-lg shadow-green-500/5" : "bg-gray-800/30 border-gray-700/50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${z.libre ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" : "bg-red-500/80"}`} />
                      <div>
                        <span className={`font-mono text-sm font-semibold ${z.libre ? "text-white" : "text-gray-400"}`}>{z.ville}</span>
                        {!z.libre && <span className="text-[10px] text-gray-600 block">{z.user}</span>}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${z.libre ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400/60 border border-red-500/10"}`}>
                      {z.libre ? "LIBRE" : "RESERVE"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TEMOIGNAGES ═══════════ */}
      <section className="relative z-10 py-28 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Temoignages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ils nous font confiance</h2>
            <p className="text-gray-400 text-lg">Des investisseurs qui gagnent du temps chaque jour.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Thomas L.", role: "Investisseur Lyon", text: "J'ai recu 3 leads qualifies des la premiere semaine. Le scoring est incroyablement precis. J'ai fait ma premiere offre en 10 jours.", avatar: "T" },
              { name: "Sophie M.", role: "Investisseur Bordeaux", text: "Plus besoin de rafraichir Leboncoin. Les emails sont envoyes automatiquement. J'ai signe 2 baux en 3 mois grace a ImmoScout.", avatar: "S" },
              { name: "Marc D.", role: "Investisseur Marseille", text: "L'exclusivite zone change tout. Enfin un outil ou je ne suis pas en competition avec 500 personnes. Le ROI est evident.", avatar: "M" },
            ].map((t, i) => (
              <div key={i} className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 group">
                <div className="absolute top-6 right-6 text-6xl font-black text-gray-800/50 leading-none select-none">"</div>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 leading-relaxed mb-8 relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ AVANTAGES RAPIDES ═══════════ */}
      <section className="relative z-10 py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Pourquoi ImmoScout ?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Search, title: "3 plateformes", desc: "Leboncoin, PAP.fr, SeLoger scannes en continu", color: "blue" },
              { icon: Zap, title: "Scan / 15 min", desc: "Les nouvelles annonces detectees instantanement", color: "amber" },
              { icon: Phone, title: "Telephone inclus", desc: "Numeros des proprietaires recuperes automatiquement", color: "green" },
              { icon: TrendingUp, title: "Scoring precis", desc: "Basee sur les donnees Airbnb reelles", color: "purple" },
              { icon: Mail, title: "Email auto", desc: "Envoyes depuis votre propre adresse", color: "rose" },
              { icon: Shield, title: "Zone exclusive", desc: "Aucune concurrence sur votre ville", color: "indigo" },
              { icon: Clock, title: "Relance J+2", desc: "Suivi automatique si pas de reponse", color: "cyan" },
              { icon: Users, title: "Dashboard", desc: "Tous vos leads en un seul endroit", color: "orange" },
            ].map((f, i) => (
              <div key={i} className={`bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-${f.color}-500/30 hover:bg-gray-900/80 transition-all duration-300 group`}>
                <div className={`w-11 h-11 bg-${f.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`text-${f.color}-400`} size={20} />
                </div>
                <h3 className="text-white font-bold mb-1">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="relative z-10 py-24 bg-gray-900/30 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Questions Frequentes</h2>
            <p className="text-gray-400">Tout ce que vous devez savoir avant de commencer.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-800 rounded-2xl bg-gray-900/50 overflow-hidden hover:border-gray-700 transition-colors">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left text-white font-semibold hover:bg-gray-800/30 transition-colors">
                  {faq.q}
                  <ChevronDown className={`transform transition-transform duration-300 shrink-0 ml-4 text-gray-400 ${openFaqIndex === idx ? "rotate-180" : ""}`} size={20} />
                </button>
                <div className={`grid transition-all duration-300 ${openFaqIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">{faq.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="relative z-10 py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem]">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-white opacity-10 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-white opacity-10 blur-3xl" />

            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Ne laissez pas un autre<br className="hidden md:block" /> prendre votre ville
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
                Chaque zone est unique. Une fois reservee, elle n'est plus disponible. Verifiez maintenant.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link to="/register" className="bg-white text-blue-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105 hover:shadow-2xl">
                  Securiser ma zone gratuitement
                </Link>
                <Link to="/contact" className="border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                  Nous contacter
                </Link>
              </div>
              <p className="text-blue-200/80 text-sm flex items-center justify-center gap-2">
                <Shield size={14} /> Garantie satisfait ou rembourse 30 jours  -  Sans engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterHome />
    </div>
  );
};

export default LandingPage;
