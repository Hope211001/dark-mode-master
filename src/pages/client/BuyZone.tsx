import { useState, useEffect } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MapPin, CreditCard, ShoppingBag, Loader2, Info } from "lucide-react";
import { stripeService } from "@/services/stripe.service";
import { zoneService, Zone } from "@/services/zones.services";
import { useToast } from "@/components/ui/use-toast";

const BuyZone = () => {
  const [availableZones, setAvailableZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchingZones, setFetchingZones] = useState(true);
  
  const { toast } = useToast();

  // 1. Charger la liste des zones disponibles au montage
  useEffect(() => {
    loadAvailableZones();
  }, []);

  const loadAvailableZones = async () => {
    try {
      setFetchingZones(true);
      const zones = await zoneService.getAvailableZones();
      setAvailableZones(zones);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger la liste des villes", variant: "destructive" });
    } finally {
      setFetchingZones(false);
    }
  };

  // 2. Mettre à jour les détails quand on choisit une ville dans le Select
  const handleSelectChange = (id: string) => {
    setSelectedZoneId(id);
    const zone = availableZones.find(z => z.id.toString() === id);
    setSelectedZone(zone || null);
  };

  const handlePurchase = async () => {
    if (!selectedZoneId) return;

    setLoading(true);
    try {
      const data = await stripeService.buyZone(selectedZoneId);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: "Échec de la connexion avec Stripe.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader 
          title="Acheter une Zone" 
          subtitle="Choisissez une ville disponible et devenez-en le propriétaire exclusif"
        />
        
        <div className="p-6 max-w-2xl mx-auto">
          <Card className="glass-card border-primary/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Marketplace</span>
              </div>
              <CardTitle>Sélection de la Ville</CardTitle>
              <CardDescription>
                Parcourez la liste des zones actuellement libres sur le marché.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* SELECTOR */}
              <div className="space-y-3">
                <Label htmlFor="zone-select" className="text-base">Quelle ville souhaitez-vous acquérir ?</Label>
                
                {fetchingZones ? (
                  <div className="h-12 flex items-center gap-3 px-4 bg-secondary/20 rounded-lg animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Chargement des villes disponibles...</span>
                  </div>
                ) : (
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="h-14 text-lg bg-secondary/30 border-primary/10">
                      <SelectValue placeholder="Choisir une ville..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableZones.length === 0 ? (
                        <SelectItem disabled value="none">Aucune ville disponible</SelectItem>
                      ) : (
                        availableZones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id.toString()}>
                            {zone.nom} — {zone.price}€
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* ZONE DETAILS (Conditionnel) */}
              {selectedZone ? (
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-foreground">{selectedZone.nom}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>Lat: {selectedZone.lat_center} / Lng: {selectedZone.lng_center}</span>
                      </div>
                    </div>
                    <Badge className="bg-success text-white">LIBRE</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="p-3 bg-background rounded-lg border border-primary/5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Codes Postaux</p>
                      <p className="text-sm font-medium truncate">
                        {selectedZone.codes_postaux?.join(", ") || "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-primary/5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Investissement</p>
                      <p className="text-xl font-bold text-primary">{selectedZone.price}€</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                    <Info className="h-4 w-4 text-blue-500 shrink-0" />
                    <p>L'acquisition de cette zone vous donne accès à tous les leads générés dans cette ville de manière exclusive.</p>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-2xl opacity-50">
                   <MapPin className="h-10 w-10 mb-2 text-muted-foreground" />
                   <p className="text-sm">Sélectionnez une ville pour voir les détails</p>
                </div>
              )}

              {/* ACTION BUTTON */}
              <Button 
                onClick={handlePurchase} 
                disabled={loading || !selectedZone}
                className="w-full h-16 gap-3 text-xl font-black shadow-xl shadow-primary/20"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-6 w-6" />
                    Payer {selectedZone ? `${selectedZone.price}€` : ""} avec Stripe
                  </>
                )}
              </Button>

              <div className="flex flex-col items-center gap-1 opacity-60">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                  alt="Stripe" 
                  className="h-6"
                />
                <p className="text-[10px] uppercase tracking-widest font-bold">Sécurisé par chiffrement AES-256</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BuyZone;