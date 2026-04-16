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
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-500 selection:text-white overflow-x-hidden">

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] -left-[15%] w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-emerald-400/4 rounded-full blur-[120px]" />
      </div>

      <HeaderHome />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative z-10 pt-32 pb-20 md:pt-44 md:pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 mb-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs md:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Scraping Leboncoin + PAP + SeLoger</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tight">
            Chassez l'immobilier
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">en pilote automatique</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Notre IA detecte les annonces, calcule la rentabilite Airbnb, et
            <span className="text-gray-900 font-medium"> contacte les proprietaires a votre place</span>.
            <br className="hidden md:block" />
            Vous, vous attendez les reponses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/register" className="w-full sm:w-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-lg">
                Verifier si ma ville est libre
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </Link>
            <Link to="/fonctionnalites" className="w-full sm:w-auto bg-gray-50 text-gray-700 px-10 py-5 rounded-xl font-bold text-lg border border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
              <Play size={18} className="text-emerald-600" />
              Comment ca marche
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { val: "2h/j", label: "Temps economise", icon: Clock, bg: "bg-blue-50", border: "border-blue-100", iconColor: "text-blue-600" },
              { val: "x3", label: "Rentabilite Airbnb", icon: TrendingUp, bg: "bg-emerald-50", border: "border-emerald-100", iconColor: "text-emerald-600" },
              { val: "100%", label: "Exclusivite Zone", icon: Shield, bg: "bg-purple-50", border: "border-purple-100", iconColor: "text-purple-600" },
              { val: "24/7", label: "Scraping Actif", icon: Zap, bg: "bg-amber-50", border: "border-amber-100", iconColor: "text-amber-600" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 md:p-6 hover:scale-105 transition-all duration-300 group`}>
                <s.icon className={`${s.iconColor} mb-3 group-hover:scale-110 transition-transform`} size={22} />
                <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{s.val}</div>
                <div className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COMMENT CA MARCHE ═══════════ */}
      <section className="relative z-10 py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
              <Sparkles size={14} className="text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Simple et puissant</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">3 etapes, 0 effort</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Le systeme travaille pour vous 24h/24. Vous recoltez les resultats.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              { num: "01", icon: Search, title: "Detection", desc: "Scan automatique de Leboncoin, PAP.fr et SeLoger toutes les 15 minutes. Les nouvelles annonces sont captees instantanement.", gradient: "from-emerald-600 to-emerald-700", bg: "bg-emerald-50", border: "hover:border-emerald-200" },
              { num: "02", icon: BarChart, title: "Scoring IA", desc: "Analyse de rentabilite basee sur les donnees Airbnb reelles. Chaque lead recoit un score de 0 a 10 base sur le ratio loyer/revenu.", gradient: "from-teal-600 to-teal-700", bg: "bg-teal-50", border: "hover:border-teal-200" },
              { num: "03", icon: Mail, title: "Contact auto", desc: "Email personnalise envoye depuis VOTRE adresse. Relance automatique a J+2 si pas de reponse. Le proprietaire vous repond directement.", gradient: "from-cyan-600 to-cyan-700", bg: "bg-cyan-50", border: "hover:border-cyan-200" },
            ].map((step) => (
              <div key={step.num} className={`relative bg-white p-8 md:p-10 rounded-3xl border border-gray-100 ${step.border} transition-all duration-500 group hover:-translate-y-2 hover:shadow-xl`}>
                <div className={`absolute -top-5 left-8 bg-gradient-to-r ${step.gradient} text-white font-black text-sm w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
                  {step.num}
                </div>
                <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mb-6 mt-2 group-hover:scale-110 transition-transform`}>
                  <step.icon className="text-gray-700" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/fonctionnalites" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors group">
              Voir le detail complet <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ DASHBOARD PREVIEW ═══════════ */}
      <section className="relative z-10 py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Votre tour de controle</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Les leads arrivent automatiquement. Tries par score. Vous n'avez plus qu'a attendre les reponses.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 font-mono border border-gray-100">dashboard.immoscout.com/leads</div>
              </div>

              <div className="p-4 md:p-8 space-y-4">
                {[
                  { titre: "T2 Centre Ville - 45m2", ville: "Lyon 2e", prix: "850", score: "9.2", potentiel: "2400", status: "Email envoye", borderColor: "border-l-emerald-500", delay: "10 min", statusBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { titre: "Studio Gare Part-Dieu", ville: "Lyon 3e", prix: "600", score: "7.5", potentiel: "1200", status: "En attente 15m", borderColor: "border-l-amber-500", delay: "45 min", statusBg: "bg-amber-50 text-amber-700 border-amber-200" },
                  { titre: "T3 Renove avec terrasse", ville: "Lyon 6e", prix: "1100", score: "8.8", potentiel: "3100", status: "Reponse recue!", borderColor: "border-l-blue-500", delay: "2h", statusBg: "bg-blue-50 text-blue-700 border-blue-200" },
                ].map((lead, i) => (
                  <div key={i} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-50/50 rounded-xl border border-gray-100 border-l-4 ${lead.borderColor} hover:bg-gray-50 transition-all cursor-pointer group`}>
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                        <Eye size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold group-hover:text-emerald-700 transition-colors">{lead.titre}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span>{lead.ville}</span>
                          <span>Loyer: {lead.prix}EUR</span>
                          <span className="text-emerald-600">Il y a {lead.delay}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <div className={`text-xl font-black ${parseFloat(lead.score) >= 8.5 ? "text-emerald-600" : "text-amber-600"}`}>
                          {lead.score}/10
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Potentiel: {lead.potentiel}EUR/mois</p>
                      </div>
                      <div className={`${lead.statusBg} border px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap`}>
                        {lead.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-6">
                <Link to="/register" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-xl z-20 hover:scale-105">
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
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-8 md:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -ml-32 -mb-32" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 mb-6">
                  <Shield size={14} className="text-white" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Modele exclusif</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Votre ville,<br />votre territoire
                </h2>
                <p className="text-emerald-100 mb-8 leading-relaxed text-lg">
                  Quand vous reservez une zone, <span className="text-white font-semibold">personne d'autre ne recoit les leads</span> de cette ville. Zero concurrence.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    { icon: Shield, text: "Zone exclusivement reservee pour vous" },
                    { icon: Users, text: "Zero concurrence sur la plateforme" },
                    { icon: CheckCircle, text: "Changez de zone a tout moment" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon size={16} className="text-white" />
                      </div>
                      <span className="text-emerald-50 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/tarifs" className="inline-flex items-center gap-3 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg hover:scale-[1.02]">
                  Voir les zones disponibles <ArrowRight size={18} />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { ville: "Lyon (69)", libre: false, user: "thomas@..." },
                  { ville: "Bordeaux (33)", libre: true, user: null },
                  { ville: "Paris 15e (75)", libre: false, user: "sophie@..." },
                  { ville: "Marseille (13)", libre: true, user: null },
                  { ville: "Toulouse (31)", libre: false, user: "marc@..." },
                ].map((z) => (
                  <div key={z.ville} className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${z.libre ? "bg-white/15 border-white/30 shadow-lg" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${z.libre ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]" : "bg-red-300"}`} />
                      <div>
                        <span className={`font-mono text-sm font-semibold ${z.libre ? "text-white" : "text-emerald-200"}`}>{z.ville}</span>
                        {!z.libre && <span className="text-[10px] text-emerald-300/60 block">{z.user}</span>}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${z.libre ? "bg-white/25 text-white border border-white/30" : "bg-red-400/20 text-red-200 border border-red-400/20"}`}>
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
      <section className="relative z-10 py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Temoignages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Ils nous font confiance</h2>
            <p className="text-gray-500 text-lg">Des investisseurs qui gagnent du temps chaque jour.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Thomas L.", role: "Investisseur Lyon", text: "J'ai recu 3 leads qualifies des la premiere semaine. Le scoring est incroyablement precis. J'ai fait ma premiere offre en 10 jours.", avatar: "T" },
              { name: "Sophie M.", role: "Investisseur Bordeaux", text: "Plus besoin de rafraichir Leboncoin. Les emails sont envoyes automatiquement. J'ai signe 2 baux en 3 mois grace a ImmoScout.", avatar: "S" },
              { name: "Marc D.", role: "Investisseur Marseille", text: "L'exclusivite zone change tout. Enfin un outil ou je ne suis pas en competition avec 500 personnes. Le ROI est evident.", avatar: "M" },
            ].map((t, i) => (
              <div key={i} className="relative bg-white border border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="absolute top-6 right-6 text-6xl font-black text-gray-100 leading-none select-none">"</div>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={16} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-8 relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ AVANTAGES ═══════════ */}
      <section className="relative z-10 py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Pourquoi ImmoScout ?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Search, title: "3 plateformes", desc: "Leboncoin, PAP.fr, SeLoger scannes en continu", bg: "bg-blue-50", iconColor: "text-blue-600" },
              { icon: Zap, title: "Scan / 15 min", desc: "Les nouvelles annonces detectees instantanement", bg: "bg-amber-50", iconColor: "text-amber-600" },
              { icon: Phone, title: "Telephone inclus", desc: "Numeros des proprietaires recuperes automatiquement", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
              { icon: TrendingUp, title: "Scoring precis", desc: "Basee sur les donnees Airbnb reelles", bg: "bg-purple-50", iconColor: "text-purple-600" },
              { icon: Mail, title: "Email auto", desc: "Envoyes depuis votre propre adresse", bg: "bg-rose-50", iconColor: "text-rose-600" },
              { icon: Shield, title: "Zone exclusive", desc: "Aucune concurrence sur votre ville", bg: "bg-indigo-50", iconColor: "text-indigo-600" },
              { icon: Clock, title: "Relance J+2", desc: "Suivi automatique si pas de reponse", bg: "bg-cyan-50", iconColor: "text-cyan-600" },
              { icon: Users, title: "Dashboard", desc: "Tous vos leads en un seul endroit", bg: "bg-orange-50", iconColor: "text-orange-600" },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={f.iconColor} size={20} />
                </div>
                <h3 className="text-gray-900 font-bold mb-1">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="relative z-10 py-24 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Questions Frequentes</h2>
            <p className="text-gray-500">Tout ce que vous devez savoir avant de commencer.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl bg-white overflow-hidden hover:border-gray-300 transition-colors">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <ChevronDown className={`transform transition-transform duration-300 shrink-0 ml-4 text-gray-400 ${openFaqIndex === idx ? "rotate-180" : ""}`} size={20} />
                </button>
                <div className={`grid transition-all duration-300 ${openFaqIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-500 leading-relaxed">{faq.a}</div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-white opacity-10 blur-3xl animate-pulse" />

            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Ne laissez pas un autre<br className="hidden md:block" /> prendre votre ville
              </h2>
              <p className="text-emerald-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
                Chaque zone est unique. Une fois reservee, elle n'est plus disponible. Verifiez maintenant.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link to="/register" className="bg-white text-emerald-700 px-10 py-5 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:scale-105">
                  Securiser ma zone gratuitement
                </Link>
                <Link to="/contact" className="border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                  Nous contacter
                </Link>
              </div>
              <p className="text-emerald-200/80 text-sm flex items-center justify-center gap-2">
                <Shield size={14} /> Garantie satisfait ou rembourse 30 jours - Sans engagement
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
