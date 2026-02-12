import { useEffect, useState } from "react";
import { MapPin, Lock, Check, Loader2 } from "lucide-react";
import { zoneService, Zone } from "@/services/zones.services";
import { useToast } from "@/components/ui/use-toast";

// On définit les statuts visuels pour le composant
type UIStatus = "owned" | "available" | "taken";

const statusConfig = {
  owned: {
    icon: Check,
    label: "Votre zone",
    bgClass: "bg-success/20 border-success/40",
    iconClass: "text-success",
    dotClass: "bg-success"
  },
  available: {
    icon: MapPin,
    label: "Disponible",
    bgClass: "bg-primary/10 border-primary/30 hover:bg-primary/20",
    iconClass: "text-primary",
    dotClass: "bg-primary"
  },
  taken: {
    icon: Lock,
    label: "Réservée",
    bgClass: "bg-muted/50 border-border opacity-60",
    iconClass: "text-muted-foreground",
    dotClass: "bg-muted-foreground"
  },
};

export function ZoneMap() {
  const { toast } = useToast();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Récupérer le vrai userId depuis ton store Auth (ex: via JWT)
  // Pour l'exemple, on considère que si owner_id existe, c'est le nôtre si on veut simplifier
  // ou on compare avec l'ID du user connecté.
  const currentUserId = "ton-user-id-ici"; 

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      // On utilise getMapStatus qui récupère TOUTES les zones (Libres et Vendues)
      const data = await zoneService.getMapStatus();
      setZones(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les zones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour déterminer le statut UI à partir des données DB
  const getUIStatus = (zone: Zone): UIStatus => {
    if (zone.statut_market === 'VENDU') {
      // Si tu as l'ID du user, tu peux vérifier : zone.owner_id === currentUserId
      // Ici, on va simplifier : si elle est vendue et que tu es sur ton dashboard, 
      // on peut vérifier si owner_id est présent.
      return zone.owner_id ? "owned" : "taken";
    }
    return "available";
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Zones Exclusives</h2>
        <p className="text-sm text-muted-foreground">Gérez vos zones de prospection</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-border">
        {(Object.entries(statusConfig) as [UIStatus, typeof statusConfig.owned][]).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${config.dotClass}`} />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="col-span-2 py-10 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : zones.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-sm text-muted-foreground">
            Aucune zone configurée.
          </div>
        ) : (
          zones.map((zone) => {
            const uiStatus = getUIStatus(zone);
            const config = statusConfig[uiStatus];
            const Icon = config.icon;

            return (
              <button
                key={zone.id}
                disabled={uiStatus === "taken"}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${config.bgClass} ${uiStatus !== 'taken' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className={`p-2 rounded-lg bg-background/50`}>
                  <Icon className={`w-4 h-4 ${config.iconClass}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground text-sm truncate">{zone.nom}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {zone.codes_postaux?.[0] || "No CP"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Summary */}
      {!loading && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Vos zones actives</span>
            <span className="font-mono text-foreground font-semibold">
              {zones.filter(z => z.statut_market === 'VENDU').length} / {zones.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}