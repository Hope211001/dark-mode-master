import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ClientStatsCard } from "@/components/client/ClientStatsCard";
import { LeadCard } from "@/components/client/LeadCard";
import { ZoneCard } from "@/components/client/ZoneCard";
import { RecentActivity } from "@/components/client/RecentActivity";
import { TrendingUp, Mail, MapPin, Target, Users, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockLeads = [
  {
    id: "1",
    title: "Appartement T3 Lumineux",
    location: "Lyon 6ème - Foch",
    surface: 75,
    loyer: 1200,
    potentielAirbnb: 2800,
    score: 94,
    status: "new" as const,
    createdAt: "il y a 2h",
  },
  {
    id: "2",
    title: "Studio Moderne Centre",
    location: "Lyon 2ème - Bellecour",
    surface: 28,
    loyer: 650,
    potentielAirbnb: 1400,
    score: 87,
    status: "contacted" as const,
    createdAt: "il y a 1 jour",
  },
  {
    id: "3",
    title: "T2 Vue Parc",
    location: "Villeurbanne - Gratte-Ciel",
    surface: 45,
    loyer: 850,
    potentielAirbnb: 1650,
    score: 78,
    status: "responded" as const,
    createdAt: "il y a 3 jours",
  },
];

const mockZones = [
  {
    id: "1",
    name: "Lyon 6ème - Foch",
    city: "Lyon",
    leadsCount: 23,
    leadsThisMonth: 8,
    isExclusive: true,
    competitorCount: 0,
    averageScore: 82,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Villeurbanne Centre",
    city: "Villeurbanne",
    leadsCount: 15,
    leadsThisMonth: 4,
    isExclusive: false,
    competitorCount: 3,
    averageScore: 75,
    status: "active" as const,
  },
];

const ClientDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="ml-64">
        <ClientHeader 
          title="Tableau de bord" 
          subtitle="Bienvenue, Jean. Voici un aperçu de votre activité."
        />
        
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ClientStatsCard
              title="Leads ce mois"
              value={12}
              change="+4"
              changeType="positive"
              description="vs mois dernier"
              icon={Users}
              highlight
            />
            <ClientStatsCard
              title="Emails envoyés"
              value={34}
              change="+12"
              changeType="positive"
              description="ce mois"
              icon={Mail}
            />
            <ClientStatsCard
              title="Zones actives"
              value={4}
              change="2 exclusives"
              changeType="neutral"
              description=""
              icon={MapPin}
            />
            <ClientStatsCard
              title="Taux de réponse"
              value="24%"
              change="+5%"
              changeType="positive"
              description="vs moyenne"
              icon={Target}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Derniers leads</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Voir tous →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {mockLeads.map((lead) => (
                      <LeadCard key={lead.id} {...lead} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Zones Overview */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Mes zones</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Gérer →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockZones.map((zone) => (
                      <ZoneCard key={zone.id} {...zone} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Leads convertis</span>
                    <span className="text-lg font-bold text-success mono">3</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Gain estimé</span>
                    <span className="text-lg font-bold text-primary mono">4 200€</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Score moyen</span>
                    <span className="text-lg font-bold text-foreground mono">82%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-96 h-96 bg-success/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ClientDashboard;
