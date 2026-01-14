import { MapPin, Lock, Check } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  status: "owned" | "available" | "taken";
  leads?: number;
}

const zones: Zone[] = [
  { id: "1", name: "Lyon 1er", status: "owned", leads: 3 },
  { id: "2", name: "Lyon 2ème", status: "owned", leads: 5 },
  { id: "3", name: "Lyon 3ème", status: "owned", leads: 8 },
  { id: "4", name: "Lyon 5ème", status: "available" },
  { id: "5", name: "Lyon 6ème", status: "taken" },
  { id: "6", name: "Lyon 7ème", status: "owned", leads: 4 },
  { id: "7", name: "Lyon 8ème", status: "available" },
  { id: "8", name: "Villeurbanne", status: "taken" },
];

const statusConfig = {
  owned: {
    icon: Check,
    label: "Votre zone",
    bgClass: "bg-success/20 border-success/40",
    iconClass: "text-success",
  },
  available: {
    icon: MapPin,
    label: "Disponible",
    bgClass: "bg-primary/10 border-primary/30 hover:bg-primary/20",
    iconClass: "text-primary",
  },
  taken: {
    icon: Lock,
    label: "Réservée",
    bgClass: "bg-muted/50 border-border",
    iconClass: "text-muted-foreground",
  },
};

export function ZoneMap() {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Zones Exclusives</h2>
        <p className="text-sm text-muted-foreground">Gérez vos zones de prospection</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-border">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${key === 'owned' ? 'bg-success' : key === 'available' ? 'bg-primary' : 'bg-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-2 gap-3">
        {zones.map((zone) => {
          const config = statusConfig[zone.status];
          const Icon = config.icon;

          return (
            <button
              key={zone.id}
              disabled={zone.status === "taken"}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${config.bgClass} ${zone.status !== 'taken' ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
              <div className={`p-2 rounded-lg bg-background/50`}>
                <Icon className={`w-4 h-4 ${config.iconClass}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground text-sm">{zone.name}</p>
                {zone.leads !== undefined && (
                  <p className="text-xs text-muted-foreground">{zone.leads} leads actifs</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Zones possédées</span>
          <span className="font-mono text-foreground font-semibold">
            {zones.filter(z => z.status === "owned").length} / {zones.length}
          </span>
        </div>
      </div>
    </div>
  );
}
