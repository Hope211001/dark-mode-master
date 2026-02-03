import { useEffect, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ClientStatsCard } from "@/components/client/ClientStatsCard";
import { LeadCard } from "@/components/client/LeadCard";
import { ZoneCard } from "@/components/client/ZoneCard";
import { RecentActivity } from "@/components/client/RecentActivity";
import { TrendingUp, Mail, MapPin, Target, Users, Loader2 } from "lucide-react";
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

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [leadsRes, zonesRes] = await Promise.all([
        leadsService.getMyLeads(1, 3), // Renvoie { data: Lead[], ... }
        zoneService.getMyZones()       // Renvoie Zone[] (Tableau direct)
      ]);

      // 1. Pour les LEADS : On garde .data car c'est un objet paginé
      // On ajoute une sécurité au cas où l'API répondrait 404 (pour éviter le crash)
      setLeads(leadsRes?.data || []);

      // 2. Pour les ZONES : ON ENLÈVE .data
      // Selon ton service, zonesRes est déjà le tableau de zones.
      console.log("Zones reçues :", zonesRes);
      setZones(Array.isArray(zonesRes) ? zonesRes : []);

    } catch (error) {
      console.error("Erreur de synchronisation dashboard :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />

      <main className="ml-64">
        <ClientHeader
          title="Tableau de bord"
          subtitle="Voici un aperçu de vos concessions et leads en cours."
        />

        <div className="p-6 space-y-6">
          {/* Stats Grid Dynamique */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ClientStatsCard
              title="Opportunités"
              value={loading ? ".." : leads.length}
              change="+2"
              changeType="positive"
              description="nouveaux leads"
              icon={Users}
              highlight
            />
            <ClientStatsCard
              title="Emails"
              value={0}
              change="Auto"
              changeType="neutral"
              description="prospection n8n"
              icon={Mail}
            />
            <ClientStatsCard
              title="Concessions"
              value={loading ? ".." : zones.length}
              change={zones.length > 0 ? "Actives" : "Aucune"}
              changeType="neutral"
              icon={MapPin}
            />
            <ClientStatsCard
              title="Score Moyen"
              value="84%"
              change="+2%"
              changeType="positive"
              description="qualité leads"
              icon={Target}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Leads Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/5 shadow-xl">
                <CardHeader className="pb-3 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Dernières pépites détectées
                    </CardTitle>
                    <Link to="/client/leads">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        Voir tout le flux →
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                  ) : leads.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10 italic">Aucun lead détecté pour le moment dans vos zones.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {leads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          id={lead.id}
                          titre={lead.titre}
                          ville={lead.ville}
                          surface={lead.surface}
                          prix={lead.prix || 0} // Sécurité pour toLocaleString
                          score={lead.score}
                          statut_prospection={lead.statut_prospection}
                          date_detection={lead.date_detection}
                          url={lead.url}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Zones Overview Section */}
              <Card className="glass-card border-white/5 shadow-xl">
                <CardHeader className="pb-3 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-success" />
                      Mes secteurs exclusifs
                    </CardTitle>
                    <Link to="/client/zones">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        Gérer mes zones →
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-success" /></div>
                  ) : zones.length === 0 ? (
                    <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-white/10">
                      <p className="text-muted-foreground mb-4">Vous n'avez pas encore de secteur.</p>
                      <Link to="/client/marketplace">
                        <Button variant="outline" size="sm">Acheter une ville</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {zones.map((zone) => (
                        <ZoneCard
                          key={zone.id}
                          id={zone.id.toString()}
                          nom={zone.nom}
                          codes_postaux={zone.codes_postaux || []}
                          status="active"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats Performance */}
              <Card className="glass-card border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Objectif Rentabilité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-white/5">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Leads convertis</span>
                    <span className="text-lg font-black text-success mono">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-white/5">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Estimation Profit</span>
                    <span className="text-lg font-black text-primary mono">0€</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-white/5">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Potentiel n8n</span>
                    <span className="text-lg font-black text-foreground mono">Haut</span>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed (Dernières actions n8n) */}
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-success/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
};

export default ClientDashboard;