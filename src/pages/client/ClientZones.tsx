import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ZoneCard } from "@/components/client/ZoneCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Lock, Users, TrendingUp } from "lucide-react";

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
    name: "Lyon 2ème - Bellecour",
    city: "Lyon",
    leadsCount: 31,
    leadsThisMonth: 12,
    isExclusive: true,
    competitorCount: 0,
    averageScore: 88,
    status: "active" as const,
  },
  {
    id: "3",
    name: "Villeurbanne Centre",
    city: "Villeurbanne",
    leadsCount: 15,
    leadsThisMonth: 4,
    isExclusive: false,
    competitorCount: 3,
    averageScore: 75,
    status: "active" as const,
  },
  {
    id: "4",
    name: "Lyon 7ème - Jean Macé",
    city: "Lyon",
    leadsCount: 18,
    leadsThisMonth: 6,
    isExclusive: false,
    competitorCount: 2,
    averageScore: 79,
    status: "active" as const,
  },
];

const ClientZones = () => {
  const exclusiveZones = mockZones.filter(z => z.isExclusive);
  const sharedZones = mockZones.filter(z => !z.isExclusive);

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="ml-64">
        <ClientHeader 
          title="Mes Zones" 
          subtitle="Gérez vos zones de prospection exclusives et partagées"
        />
        
        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">{mockZones.length}</p>
                  <p className="text-sm text-muted-foreground">Zones totales</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20">
                  <Lock className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">{exclusiveZones.length}</p>
                  <p className="text-sm text-muted-foreground">Exclusives</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">{sharedZones.length}</p>
                  <p className="text-sm text-muted-foreground">Partagées</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">
                    {mockZones.reduce((acc, z) => acc + z.leadsThisMonth, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Leads ce mois</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Carte des zones</CardTitle>
                <Button variant="default" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une zone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-secondary/50 rounded-xl border border-border flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Carte interactive des zones</p>
                  <p className="text-sm text-muted-foreground/70">Intégration Mapbox/Leaflet à venir</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exclusive Zones */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Zones exclusives</h2>
              <Badge className="bg-primary/20 text-primary">{exclusiveZones.length}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exclusiveZones.map((zone) => (
                <ZoneCard key={zone.id} {...zone} />
              ))}
            </div>
          </div>

          {/* Shared Zones */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Zones partagées</h2>
              <Badge variant="secondary">{sharedZones.length}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedZones.map((zone) => (
                <ZoneCard key={zone.id} {...zone} />
              ))}
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

export default ClientZones;
