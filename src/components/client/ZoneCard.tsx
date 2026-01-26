import { MapPin, TrendingUp, Eye, Settings, Lock, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ZoneCardProps {
  id: string;
  nom: string;          // Vient de Supabase
  codes_postaux: string[]; // Vient de Supabase
  leadsCount?: number;     // Optionnel (sera rempli par n8n plus tard)
  leadsThisMonth?: number; // Optionnel
  averageScore?: number;   // Optionnel
  status?: "active" | "paused" | "expired";
}

const statusConfig = {
  active: { label: "Active", className: "bg-success/20 text-success border-success/30" },
  paused: { label: "En pause", className: "bg-warning/20 text-warning border-warning/30" },
  expired: { label: "Expirée", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function ZoneCard({
  id,
  nom,
  codes_postaux = [],
  leadsCount = 0,
  leadsThisMonth = 0,
  averageScore = 0,
  status = "active",
}: ZoneCardProps) {
  return (
    <Card className="glass-card transition-all duration-300 hover:border-primary/30 group shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icône de localisation stylisée */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {nom}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span>{codes_postaux.length} codes postaux</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* Badge d'exclusivité (Modèle Concession du PDF) */}
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-[10px]">
              <Lock className="h-3 w-3 mr-1" />
              CONCESSION
            </Badge>
            <Badge variant="outline" className={cn("border text-[10px]", statusConfig[status].className)}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Liste courte des codes postaux possédés */}
        <div className="flex flex-wrap gap-1 mb-2">
          {codes_postaux.slice(0, 4).map((cp) => (
            <span key={cp} className="text-[10px] bg-secondary px-2 py-0.5 rounded border border-border">
              {cp}
            </span>
          ))}
          {codes_postaux.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{codes_postaux.length - 4}</span>
          )}
        </div>

        {/* Stats Grid (Données n8n) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-secondary/30 rounded-lg border border-border/50">
            <div className="text-lg font-bold text-foreground mono">{leadsCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Total</div>
          </div>
          <div className="text-center p-2 bg-secondary/30 rounded-lg border border-border/50">
            <div className="text-lg font-bold text-primary mono">+{leadsThisMonth}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Mois</div>
          </div>
          <div className="text-center p-2 bg-secondary/30 rounded-lg border border-border/50">
            <div className="text-lg font-bold text-foreground mono">{averageScore || '--'}%</div>
            <div className="text-[10px] text-muted-foreground uppercase">Score</div>
          </div>
        </div>

        {/* Performance (Comparaison temporelle) */}
        <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-success/10 to-transparent rounded-lg border border-success/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground font-medium">Flux de leads</span>
          </div>
          <span className="text-success font-bold text-xs">+12%</span>
        </div>

        {/* Actions principales */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Link to={`/client/leads?zone=${id}`} className="flex-1">
            <Button size="sm" variant="default" className="w-full h-9 font-bold bg-primary hover:bg-primary/90">
              <Eye className="h-4 w-4 mr-2" />
              Flux Leads
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="h-9 w-9 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}