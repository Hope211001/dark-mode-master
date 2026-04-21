import { useEffect, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ZoneCard } from "@/components/client/ZoneCard";
import MapExplorer from "@/components/Map/MapExplorer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Lock, Users, TrendingUp, Loader2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { zoneService, Zone } from "@/services/zones.services.tsx";
import { useToast } from "@/components/ui/use-toast";

const ClientZones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // États pour les compteurs (TYPES CORRIGÉS en number)
  const [totalZonesCount, setTotalZonesCount] = useState<number>(0);
  const [freeZonesCount, setFreeZonesCount] = useState<number>(0);
  const [soldZonesCount, setSoldZonesCount] = useState<number>(0);


  // Chargement des données réelles au montage
  useEffect(() => {
    fetchMyZones();
    loadAllData();
  }, []);


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


  const fetchMyZones = async () => {
    try {
      setLoading(true);
      // Appel à la route router.get('/my/owned', ...)
      const data = await zoneService.getMyZones();
      setZones(data);
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de récupérer vos concessions. Vérifiez votre connexion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  /**
   * LOGIQUE DU MODÈLE BUSINESS (PDF) :
   * Une zone possédée est par défaut une "Concession Exclusive".
   */
  const exclusiveZones = zones.filter(z => z.statut_market === 'VENDU');
  // Les zones "partagées" pourraient être des zones d'essai ou multi-utilisateurs si votre modèle évolue
  const sharedZones = zones.filter(z => z.statut_market === 'LIBRE');

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />

      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader
          title="Mes Zones"
          subtitle="Gérez vos concessions exclusives et suivez le flux de leads n8n"
        />

        <div className="p-6 space-y-6">
          {/* Stats Overview avec données réelles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card border-primary/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">
                     {loading ? "..." : totalZonesCount}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Total Zones</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-success/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <Lock className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">
                    {loading ? ".." : exclusiveZones.length}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">MES ZONES</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">
                    {loading ? ".." : freeZonesCount}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Disponible</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-blue-500/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mono">
                     {loading ? ".." : soldZonesCount}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">zone indisponible</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder amélioré */}
          <Card className="glass-card border-primary/10 overflow-hidden">
            <CardHeader className="pb-3 bg-secondary/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Couverture Géographique
                </CardTitle>
                <Link to="/client/buy-zone">
                  <Button variant="default" size="sm" className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    Acheter une zone
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] border-t border-border/50">
                {exclusiveZones.length === 0 ? (
                  <div className="h-full bg-secondary/10 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-primary/20 mx-auto mb-2" />
                      <p className="text-muted-foreground font-medium">Aucune zone à afficher sur la carte</p>
                    </div>
                  </div>
                ) : (
                  <MapExplorer zonesData={exclusiveZones} searchPos={null} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Affichage des zones */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse font-medium">Synchronisation avec n8n...</p>
            </div>
          ) : (
            <>
              {/* Exclusive Zones Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Mes Concessions Exclusives</h2>
                  <Badge className="bg-primary text-white border-none">{exclusiveZones.length}</Badge>
                </div>

                {exclusiveZones.length === 0 ? (
                  <Card className="p-12 text-center border-2 border-dashed border-border bg-transparent">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Aucune zone active</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                          Vous n'avez pas encore de concession exclusive. Visitez la marketplace pour réserver votre première ville.
                        </p>
                      </div>
                      <Link to="/client/marketplace">
                        <Button variant="outline" className="mt-2">Ouvrir la Marketplace</Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exclusiveZones.map((zone) => (
                      <ZoneCard
                        key={zone.id}
                        id={zone.id.toString()}
                        nom={zone.nom}
                        codes_postaux={zone.codes_postaux}
                        leadsCount={0} // À synchroniser avec votre table 'leads' plus tard
                        leadsThisMonth={0}
                        status="active"
                        price = {zone.price}
                        onCanceled={() => { fetchMyZones(); loadAllData(); }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Shared Zones Section (Si applicable) */}
              {/* {sharedZones.length > 0 && (
                <div className="space-y-4 mt-12 pt-10 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Zones Partagées</h2>
                    <Badge variant="secondary">{sharedZones.length}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sharedZones.map((zone) => (
                      <ZoneCard 
                        key={zone.id} 
                        id={zone.id.toString()}
                        nom={zone.nom} 
                        codes_postaux={zone.codes_postaux}
                        status="active"
                      />
                    ))}
                  </div>
                </div>
              )} */}
            </>
          )}
        </div>
      </main>

      {/* Background Glow Effects pour le style "Glass" */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-success/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
};

export default ClientZones;