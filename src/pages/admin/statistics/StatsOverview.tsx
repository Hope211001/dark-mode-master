import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp, Sparkles, Mail, Map, MapPin, MapPinOff, Loader2
} from "lucide-react";

interface Stats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  totalZones: number;
  zonesLibres: number;
  zonesVendues: number;
}

const statCards = [
  { key: "totalLeads" as keyof Stats, label: "Total Leads", subtitle: "tous les leads détectés", icon: TrendingUp, gradient: "from-primary/20 via-slate-900/90 to-slate-900/90", border: "border-primary/30", shadow: "shadow-primary/10 hover:shadow-primary/20", iconBg: "bg-primary/10 border-primary/30", iconColor: "text-primary", glow: "bg-primary/30" },
  { key: "newLeads" as keyof Stats, label: "Nouveaux", subtitle: "en attente de contact", icon: Sparkles, gradient: "from-amber-500/20 via-slate-900/90 to-slate-900/90", border: "border-amber-500/30", shadow: "shadow-amber-500/10 hover:shadow-amber-500/20", iconBg: "bg-amber-500/10 border-amber-500/30", iconColor: "text-amber-400", glow: "bg-amber-500/30" },
  { key: "contactedLeads" as keyof Stats, label: "Contactés", subtitle: "messages envoyés", icon: Mail, gradient: "from-violet-500/20 via-slate-900/90 to-slate-900/90", border: "border-violet-500/30", shadow: "shadow-violet-500/10 hover:shadow-violet-500/20", iconBg: "bg-violet-500/10 border-violet-500/30", iconColor: "text-violet-400", glow: "bg-violet-500/30" },
  { key: "totalZones" as keyof Stats, label: "Total Zones", subtitle: "villes couvertes", icon: Map, gradient: "from-cyan-500/20 via-slate-900/90 to-slate-900/90", border: "border-cyan-500/30", shadow: "shadow-cyan-500/10 hover:shadow-cyan-500/20", iconBg: "bg-cyan-500/10 border-cyan-500/30", iconColor: "text-cyan-400", glow: "bg-cyan-500/30" },
  { key: "zonesVendues" as keyof Stats, label: "Zones vendues", subtitle: "sous contrat", icon: MapPin, gradient: "from-emerald-500/20 via-slate-900/90 to-slate-900/90", border: "border-emerald-500/30", shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/20", iconBg: "bg-emerald-500/10 border-emerald-500/30", iconColor: "text-emerald-400", glow: "bg-emerald-500/30" },
  { key: "zonesLibres" as keyof Stats, label: "Zones libres", subtitle: "disponibles", icon: MapPinOff, gradient: "from-rose-500/20 via-slate-900/90 to-slate-900/90", border: "border-rose-500/30", shadow: "shadow-rose-500/10 hover:shadow-rose-500/20", iconBg: "bg-rose-500/10 border-rose-500/30", iconColor: "text-rose-400", glow: "bg-rose-500/30" },
];

export function StatsOverview({ stats, loading }: { stats: Stats; loading: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {statCards.map((s) => (
        <Card key={s.key} className={`relative overflow-hidden bg-gradient-to-br ${s.gradient} backdrop-blur-xl border ${s.border} shadow-2xl ${s.shadow} transition-all duration-300 group`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="relative p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wide leading-tight">{s.label}</p>
                <div className="relative shrink-0">
                  <div className={`absolute inset-0 ${s.glow} rounded-lg blur-xl animate-pulse`} />
                  <div className={`relative p-2 ${s.iconBg} rounded-lg border`}>
                    <s.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${s.iconColor}`} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-500" /> : stats[s.key]}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">{s.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
