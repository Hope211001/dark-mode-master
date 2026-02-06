import { useEffect, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ClientStatsCard } from "@/components/client/ClientStatsCard";
import { LeadCard } from "@/components/client/LeadCard";
import { ZoneCard } from "@/components/client/ZoneCard";
import { RecentActivity } from "@/components/client/RecentActivity";
import { TrendingUp, Mail, MapPin, Target, Users, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Import de tes services
import { zoneService, Zone } from "@/services/zones.services";
import { leadsService, Lead } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";

const ClientDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // États pour les compteurs
  const [totalZonesCount, setTotalZonesCount] = useState<number>(0);
  const [freeZonesCount, setFreeZonesCount] = useState<number>(0);
  const [soldZonesCount, setSoldZonesCount] = useState<number>(0);

  useEffect(() => {
    fetchDashboardData();
    loadAllData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [leadsRes, zonesRes] = await Promise.all([
        leadsService.getMyLeads(1, 4),
        zoneService.getMyZones()
      ]);

      setLeads(leadsRes?.data || []);
      console.log("Zones reçues :", zonesRes);
      setZones(Array.isArray(zonesRes) ? zonesRes : []);

    } catch (error) {
      console.error("Erreur de synchronisation dashboard :", error);
    } finally {
      setLoading(false);
    }
  };


  const loadAllData = async () => {
    setLoading(true);
    try {
      // On utilise allSettled au lieu de all pour éviter qu'une erreur bloque tout
      const results = await Promise.allSettled([
        zoneService.getCountAllZone(),
        zoneService.getCountZoneLibre(),
        zoneService.getCountZoneVendu()
      ]);

      // Traitement des résultats
      if (results[0].status === 'fulfilled') setTotalZonesCount(results[0].value);
      if (results[1].status === 'fulfilled') setFreeZonesCount(results[1].value);
      if (results[2].status === 'fulfilled') setSoldZonesCount(results[2].value);

    } catch (error) {
      console.error("Erreur globale chargement", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ClientSidebar />

      <main className="ml-64">
        <ClientHeader
          title="Tableau de bord"
          subtitle="Voici un aperçu de vos concessions et leads en cours."
        />

        <div className="p-8 space-y-8">
          {/* Stats Grid Dynamique - Style Premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Opportunités */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-slate-900/90 to-slate-900/90 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400 mb-1">Opportunités actives</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl font-black text-white tracking-tight">
                        {loading ? ".." : leads.length}
                      </h3>
                      <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-full">
                        +{leads.length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">nouveaux leads détectés</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl animate-pulse" />
                    <div className="relative p-3 bg-primary/10 rounded-xl border border-primary/30">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Emails */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500/20 via-slate-900/90 to-slate-900/90 backdrop-blur-xl border border-violet-500/30 shadow-2xl shadow-violet-500/10 hover:shadow-violet-500/20 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400 mb-1">Emails envoyés</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl font-black text-white tracking-tight">0</h3>
                      <span className="text-xs font-semibold text-violet-400 px-2 py-1 bg-violet-500/10 rounded-full">
                        Auto
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">via prospection n8n</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/30 rounded-xl blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="relative p-3 bg-violet-500/10 rounded-xl border border-violet-500/30">
                      <Mail className="h-6 w-6 text-violet-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Zones */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-slate-900/90 to-slate-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400 mb-1">Zones disponibles</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl font-black text-white tracking-tight">
                        {loading ? ".." : freeZonesCount}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-full">
                        {freeZonesCount > 0 ? "Actives" : "Aucune"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">secteurs configurés</p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-xl blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="relative p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                      <MapPin className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Full Width */}
          <div className="max-w-7xl mx-auto">
            {/* Recent Leads Section - Enhanced Full Width */}
            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 shadow-2xl overflow-hidden hover:shadow-primary/5 transition-all duration-300">
              {/* Header avec gradient animé */}
              <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-violet-500/10 p-8 border-b border-slate-700/50 overflow-hidden">
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl animate-pulse" />
                      <div className="relative p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/30 backdrop-blur-sm">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-white tracking-tight">
                        Dernières pépites détectées
                      </CardTitle>
                      <p className="text-sm text-slate-300 mt-1 font-medium">
                        Opportunités immobilières à fort potentiel • Détection automatique
                      </p>
                    </div>
                  </div>
                  <Link to="/client/leads">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 text-white shadow-lg shadow-primary/25 border-0 group font-semibold"
                    >
                      Voir tout le flux
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                      <Loader2 className="relative animate-spin text-primary h-12 w-12 mb-4" />
                    </div>
                    <p className="text-slate-300 text-base font-medium">Chargement des opportunités...</p>
                    <p className="text-slate-500 text-sm mt-1">Analyse en cours</p>
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-24 px-6">
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="absolute inset-0 bg-slate-700/20 rounded-full blur-2xl" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-full flex items-center justify-center border border-slate-700/50">
                        <Target className="h-10 w-10 text-slate-500" />
                      </div>
                    </div>
                    <p className="text-white text-xl font-bold mb-3">
                      Aucun lead détecté pour le moment
                    </p>
                    <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
                      Nos algorithmes intelligents scannent vos zones en continu.
                      <br />
                      Vous serez notifié instantanément dès qu'une opportunité apparaît.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span>Système de détection actif</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/50">
                      <p className="text-slate-400 text-sm font-medium">
                        <span className="text-primary font-bold text-lg">{leads.length}</span> opportunité{leads.length > 1 ? 's' : ''} disponible{leads.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        Mise à jour en temps réel
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {leads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          id={lead.id}
                          titre={lead.titre}
                          ville={lead.ville}
                          surface={lead.surface}
                          prix={lead.prix || 0}
                          score={lead.score}
                          statut_prospection={lead.statut_prospection}
                          date_detection={lead.date_detection}
                          url={lead.url}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Enhanced Background Effects - Plus dynamiques */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-primary/15 to-violet-500/15 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-0 left-64 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 to-orange-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '3s' }} />
    </div>
  );
};

export default ClientDashboard;