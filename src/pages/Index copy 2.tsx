import React, { useState } from 'react';
import { 
  ArrowRight, MapPin, TrendingUp, Mail, Shield, Clock, Zap, 
  Menu, X, CheckCircle, Database, BarChart, Lock, Search, 
  AlertTriangle, MousePointerClick, ChevronDown 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FooterHome from '@/components/partials/footer/footer.home';

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-gray-100 selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <MapPin className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ImmoScout</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#problem" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Le Problème</a>
              <a href="#solution" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">La Solution</a>
              <a href="#concession" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Exclusivité</a>
              <Link to="/tarifs" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Tarifs</Link>
              <div className="h-4 w-px bg-gray-700"></div>
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Connexion</Link>
              <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg transform hover:-translate-y-0.5">
                Essai Gratuit
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-gray-950 border-b border-gray-800 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5 z-50">
            <a href="#problem" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2 border-b border-gray-800">Le Problème</a>
            <a href="#solution" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2 border-b border-gray-800">La Solution</a>
            <Link to="/tarifs" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2 border-b border-gray-800">Tarifs</Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-300 hover:text-white py-2">Connexion</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white py-4 rounded-xl text-center font-bold text-lg mt-2 shadow-blue-900/20 shadow-lg">Commencer</Link>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-fade-in-up hover:bg-blue-500/20 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-blue-400 uppercase tracking-wide">Technologie n8n + Apify intégrée</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
            Chassez l'immobilier <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">en pilote automatique</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Arrêtez de rafraîchir Leboncoin. Notre algorithme détecte les annonces, calcule la rentabilité Airbnb (Scoring), et <span className="text-white font-medium">contacte les propriétaires à votre place</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4">
            <Link to="/register" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center group hover:scale-105">
              Vérifier si ma ville est libre
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <button className="w-full sm:w-auto bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition-all border border-gray-700 flex items-center justify-center hover:bg-gray-700/80">
              Voir la démo vidéo
            </button>
          </div>

          {/* Social Proof / Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-t border-gray-800 pt-10 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl hover:bg-gray-900/50 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">2h/j</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide">Temps économisé</div>
            </div>
            <div className="p-4 rounded-xl hover:bg-gray-900/50 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">x3</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide">Rentabilité Airbnb</div>
            </div>
            <div className="p-4 rounded-xl hover:bg-gray-900/50 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide">Exclusivité Zone</div>
            </div>
            <div className="p-4 rounded-xl hover:bg-gray-900/50 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide">Scraping Actif</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section id="problem" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">L'investissement locatif classique est cassé</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Si vous cherchez encore manuellement, vous avez déjà perdu. Les meilleures affaires partent en moins de 30 minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800 hover:border-red-500/30 transition-colors group">
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                <Clock className="text-red-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Trop de temps perdu</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Vous passez vos soirées à rafraîchir Leboncoin. Quand vous appelez enfin, l'appartement est déjà sous offre ou le propriétaire est harcelé.
              </p>
            </div>
            <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800 hover:border-orange-500/30 transition-colors group">
              <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <AlertTriangle className="text-orange-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Rentabilité incertaine</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Vous estimez la rentabilité "au doigt mouillé". Sans données précises (Beyond Pricing), vous risquez d'investir dans un bien qui ne rapportera pas assez.
              </p>
            </div>
            <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800 hover:border-yellow-500/30 transition-colors group">
              <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                <MousePointerClick className="text-yellow-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Concurrence déloyale</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sur les autres logiciels d'alerte, vous êtes 500 sur la même ville. C'est la course au clic. Le premier qui appelle gagne, les autres perdent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOLUTION SECTION (Workflow) --- */}
      <section id="solution" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">
              ⚡️ Le "Cerveau" de l'opération
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Comment l'IA travaille pour vous</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Deux workflows n8n puissants tournent en arrière-plan toutes les 15 minutes.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1: Scraping */}
              <div className="group relative bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20">
                <div className="absolute -top-6 left-8 bg-gray-900 border border-gray-700 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20">1</div>
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 mx-auto md:mx-0">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Récupération (Le Chasseur)</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Notre robot interroge <strong>Apify</strong> pour scanner les dernières annonces Leboncoin. Il filtre instantanément pour vérifier si l'annonce est dans votre zone exclusive.
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Apify</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">PostgreSQL</span>
                </div>
              </div>

              {/* Step 2: Scoring */}
              <div className="group relative bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20">
                <div className="absolute -top-6 left-8 bg-gray-900 border border-gray-700 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20">2</div>
                <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 mx-auto md:mx-0">
                  <BarChart size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Enrichissement (Le Cerveau)</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  On ne regarde pas juste le prix. On interroge <strong>Beyond Pricing</strong>.
                  <br/>Si Loyer = 800€ mais Potentiel Airbnb = 2500€, l'annonce reçoit un score de <strong>9.5/10</strong>.
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Beyond Pricing</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Math.js</span>
                </div>
              </div>

              {/* Step 3: Prospecting */}
              <div className="group relative bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20">
                <div className="absolute -top-6 left-8 bg-gray-900 border border-gray-700 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20">3</div>
                <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 mx-auto md:mx-0">
                  <Mail size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Contact (Le Bras Armé)</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Si le score superieur 7/10, le système attend 20 min (pour simuler un humain) et envoie un email personnalisé <strong>depuis votre adresse</strong>. Il relance même à J+2 si pas de réponse.
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Gmail API</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Outlook</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BUSINESS MODEL: LA CONCESSION --- */}
      <section id="concession" className="relative z-10 py-24 bg-gray-800/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Visual Part */}
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Database size={18} className="text-blue-400"/> Base de données Zones
                  </h4>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* List of zones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg border border-red-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                      <div>
                        <span className="text-gray-300 font-mono block text-sm">Zone: Lyon (69)</span>
                        <span className="text-xs text-gray-500">Utilisateur: thomas@invest.com</span>
                      </div>
                    </div>
                    <Lock size={16} className="text-red-400" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-900/10 rounded-lg border border-green-500/30 transform scale-105 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                      <div>
                        <span className="text-white font-mono font-bold block text-sm">Zone: Bordeaux (33)</span>
                        <span className="text-xs text-green-400">Statut: DISPONIBLE</span>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-gray-900 bg-green-400 px-3 py-1 rounded hover:bg-green-300 transition-colors">
                      Réserver
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg border border-red-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                      <div>
                        <span className="text-gray-300 font-mono block text-sm">Zone: Paris (75)</span>
                        <span className="text-xs text-gray-500">Utilisateur: sophie@immo.fr</span>
                      </div>
                    </div>
                    <Lock size={16} className="text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text Part */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold mb-4">
                💎 Modèle Business Unique
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">La "Concession" : <br/>Fini la concurrence interne.</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Contrairement aux logiciels classiques où tout le monde se bat pour les mêmes annonces, ici nous vendons de l'exclusivité. C'est votre territoire.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="text-green-400" size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Zéro concurrence sur la plateforme</h4>
                    <p className="text-gray-400 text-sm mt-1">Si vous achetez la zone "Lyon", personne d'autre ne recevra les alertes pour Lyon.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Database className="text-blue-400" size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Garantie Technique</h4>
                    <p className="text-gray-400 text-sm mt-1">Notre base de données vérifie qu'un code postal n'appartient qu'à un seul client actif.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-10">
                <Link to="/register" className="inline-flex items-center text-white border-b border-blue-500 hover:text-blue-400 transition-colors pb-1 font-medium">
                  Voir la carte des zones disponibles <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- DASHBOARD PREVIEW --- */}
      <section className="relative z-10 py-24 bg-gray-950 border-t border-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Votre tour de contrôle</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Connectez-vous pour voir votre "rivière de leads". Les annonces sont triées par score. Vous n'avez plus qu'à attendre que les propriétaires vous répondent.
          </p>
          
          <div className="relative mx-auto max-w-5xl rounded-t-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden group">
            {/* Header Browser Style */}
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 p-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="text-xs text-gray-500 font-mono">dashboard.immoscout.com/leads</div>
              <div></div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-4 md:p-8 grid gap-4 text-left transition-opacity">
               {/* Lead 1 */}
               <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700 border-l-4 border-l-green-500 hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-gray-700 rounded bg-cover bg-center" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=100")'}}></div>
                    <div>
                      <h4 className="text-white font-semibold">T2 Centre Ville - 45m²</h4>
                      <p className="text-xs md:text-sm text-gray-400">69002 Lyon • Loyer: 850€ • <span className="text-blue-400">Il y a 10 min</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">Score: 9.2/10</div>
                      <p className="text-xs text-gray-500">Potentiel: 2400€/mois</p>
                    </div>
                    <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-600/30">
                      Email envoyé ✅
                    </div>
                  </div>
               </div>

               {/* Lead 2 */}
               <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700 border-l-4 border-l-yellow-500 hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-gray-700 rounded bg-cover bg-center" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=100")'}}></div>
                    <div>
                      <h4 className="text-white font-semibold">Studio Gare Part-Dieu</h4>
                      <p className="text-xs md:text-sm text-gray-400">69003 Lyon • Loyer: 600€ • <span className="text-blue-400">Il y a 45 min</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-xl font-bold text-yellow-400">Score: 7.5/10</div>
                      <p className="text-xs text-gray-500">Potentiel: 1200€/mois</p>
                    </div>
                     <div className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-600/30 flex items-center gap-1">
                      <Clock size={12}/> En attente (15m)
                    </div>
                  </div>
               </div>

                {/* Lead 3 (Blurry) */}
               <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700 opacity-50 blur-[1px]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded"></div>
                    <div>
                      <h4 className="text-white font-semibold">Appartement T3 Rénové</h4>
                      <p className="text-sm text-gray-400">69001 Lyon • Loyer: 1100€</p>
                    </div>
                  </div>
               </div>
            </div>
            
            {/* Overlay Gradient at bottom */}
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent flex items-end justify-center pb-8">
                <Link to="/register" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-lg z-20">
                    Voir mes leads maintenant
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Questions Fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: "Est-ce que je peux changer de zone ?", a: "Oui, à tout moment. Si vous voyez que Lyon est trop concurrentiel ou ne donne pas assez de résultats, vous pouvez 'libérer' la zone et en prendre une autre (ex: Bordeaux) directement depuis le dashboard." },
              { q: "Comment fonctionne le scoring ?", a: "Nous utilisons l'API de Beyond Pricing. Nous comparons le loyer mensuel demandé sur Leboncoin avec le revenu potentiel généré par une location courte durée (Airbnb) dans le même quartier." },
              { q: "Les emails sont-ils vraiment envoyés de ma part ?", a: "Oui. Lors de la configuration, vous connectez votre compte Gmail ou Outlook. Le système utilise votre API pour envoyer les emails. Le propriétaire voit VOTRE nom et répond directement dans VOTRE boîte mail." },
              { q: "Y a-t-il un engagement ?", a: "Non. Vous pouvez annuler votre abonnement mensuel à tout moment. L'accès s'arrêtera à la fin de la période facturée." }
            ].map((faq, idx) => (
              <div key={idx} className="border border-gray-800 rounded-lg bg-gray-950 overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-white font-medium hover:bg-gray-900 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`transform transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} size={20} />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 text-gray-400 text-sm border-t border-gray-800 bg-gray-900/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-center shadow-2xl border border-white/10">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            
            <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">
              Ne laissez pas un autre prendre votre ville
            </h2>
            <p className="relative z-10 text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Chaque zone est unique. Une fois qu'un investisseur la réserve, elle n'est plus disponible pour vous. Vérifiez la disponibilité maintenant.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl transform hover:scale-105">
                Sécuriser ma zone
              </Link>
            </div>
            <p className="relative z-10 text-blue-200 text-sm mt-6 flex items-center justify-center gap-2">
              <Shield size={14} /> Garantie satisfait ou remboursé 30 jours
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <FooterHome />
    </div>
  );
};

export default LandingPage;