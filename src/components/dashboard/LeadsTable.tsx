import { ExternalLink, Mail, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  title: string;
  location: string;
  loyer: number;
  potentielAirbnb: number;
  score: number;
  surface: string;
  status: "new" | "contacted" | "replied" | "rejected";
  createdAt: string;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    title: "T3 Lumineux Centre-Ville",
    location: "Lyon 3ème",
    loyer: 950,
    potentielAirbnb: 2800,
    score: 9.2,
    surface: "65m²",
    status: "new",
    createdAt: "Il y a 12 min",
  },
  {
    id: "2",
    title: "Studio Moderne Part-Dieu",
    location: "Lyon 3ème",
    loyer: 650,
    potentielAirbnb: 1900,
    score: 8.8,
    surface: "28m²",
    status: "contacted",
    createdAt: "Il y a 34 min",
  },
  {
    id: "3",
    title: "T2 Rénové Guillotière",
    location: "Lyon 7ème",
    loyer: 780,
    potentielAirbnb: 2100,
    score: 8.1,
    surface: "42m²",
    status: "new",
    createdAt: "Il y a 1h",
  },
  {
    id: "4",
    title: "Appartement Charme Vieux Lyon",
    location: "Lyon 5ème",
    loyer: 1100,
    potentielAirbnb: 3200,
    score: 8.5,
    surface: "55m²",
    status: "replied",
    createdAt: "Il y a 2h",
  },
  {
    id: "5",
    title: "T2 Vue Rhône",
    location: "Lyon 2ème",
    loyer: 890,
    potentielAirbnb: 2400,
    score: 7.9,
    surface: "38m²",
    status: "contacted",
    createdAt: "Il y a 3h",
  },
];

const statusConfig = {
  new: { label: "Nouveau", className: "bg-primary/20 text-primary" },
  contacted: { label: "Contacté", className: "bg-warning/20 text-warning" },
  replied: { label: "Répondu", className: "bg-success/20 text-success" },
  rejected: { label: "Refusé", className: "bg-destructive/20 text-destructive" },
};

function ScoreBadge({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-success bg-success/20 border-success/30";
    if (score >= 8) return "text-primary bg-primary/20 border-primary/30";
    if (score >= 7) return "text-warning bg-warning/20 border-warning/30";
    return "text-muted-foreground bg-muted border-border";
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold",
      getScoreColor(score)
    )}>
      <TrendingUp className="w-3.5 h-3.5" />
      {score.toFixed(1)}
    </div>
  );
}

export function LeadsTable() {
  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Derniers Leads</h2>
            <p className="text-sm text-muted-foreground">Annonces triées par score de rentabilité</p>
          </div>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                Annonce
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                Score
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                Loyer
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                Potentiel
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                Statut
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockLeads.map((lead, index) => (
              <tr 
                key={lead.id} 
                className="hover:bg-muted/20 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{lead.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{lead.location}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{lead.surface}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lead.createdAt}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <ScoreBadge score={lead.score} />
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-foreground">{lead.loyer.toLocaleString()}€</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-success font-medium">
                    {lead.potentielAirbnb.toLocaleString()}€
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                    statusConfig[lead.status].className
                  )}>
                    {statusConfig[lead.status].label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
