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
  { key: "totalLeads" as keyof Stats, label: "Total Leads", subtitle: "tous les leads detectes", icon: TrendingUp, bg: "bg-clay-50", border: "border-clay-200", iconBg: "bg-clay-100", iconColor: "text-clay-600" },
  { key: "newLeads" as keyof Stats, label: "Nouveaux", subtitle: "en attente de contact", icon: Sparkles, bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { key: "contactedLeads" as keyof Stats, label: "Contactes", subtitle: "messages envoyes", icon: Mail, bg: "bg-violet-50", border: "border-violet-200", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  { key: "totalZones" as keyof Stats, label: "Total Zones", subtitle: "villes couvertes", icon: Map, bg: "bg-cyan-50", border: "border-cyan-200", iconBg: "bg-cyan-100", iconColor: "text-cyan-600" },
  { key: "zonesVendues" as keyof Stats, label: "Zones vendues", subtitle: "sous contrat", icon: MapPin, bg: "bg-blue-50", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { key: "zonesLibres" as keyof Stats, label: "Zones libres", subtitle: "disponibles", icon: MapPinOff, bg: "bg-rose-50", border: "border-rose-200", iconBg: "bg-rose-100", iconColor: "text-rose-600" },
];

export function StatsOverview({ stats, loading }: { stats: Stats; loading: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {statCards.map((s) => (
        <Card key={s.key} className={`relative overflow-hidden ${s.bg} border ${s.border} shadow-sm hover:shadow-md transition-all duration-300 group`}>
          <CardContent className="relative p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wide leading-tight">{s.label}</p>
                <div className={`p-2 ${s.iconBg} rounded-lg`}>
                  <s.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${s.iconColor}`} />
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : stats[s.key]}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">{s.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
