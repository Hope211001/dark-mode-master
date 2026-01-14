import { MapPin, Users, TrendingUp, Eye, Settings, Lock, Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ZoneCardProps {
  id: string;
  name: string;
  city: string;
  leadsCount: number;
  leadsThisMonth: number;
  isExclusive: boolean;
  competitorCount: number;
  averageScore: number;
  status: "active" | "paused" | "expired";
}

const statusConfig = {
  active: { label: "Active", className: "bg-success/20 text-success border-success/30" },
  paused: { label: "En pause", className: "bg-warning/20 text-warning border-warning/30" },
  expired: { label: "Expirée", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function ZoneCard({
  id,
  name,
  city,
  leadsCount,
  leadsThisMonth,
  isExclusive,
  competitorCount,
  averageScore,
  status,
}: ZoneCardProps) {
  return (
    <Card className="glass-card transition-all duration-300 hover:border-primary/30 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              isExclusive ? "bg-primary/20" : "bg-secondary"
            )}>
              <MapPin className={cn(
                "h-5 w-5",
                isExclusive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExclusive ? (
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                <Lock className="h-3 w-3 mr-1" />
                Exclusive
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                <Unlock className="h-3 w-3 mr-1" />
                Partagée
              </Badge>
            )}
            <Badge variant="outline" className={cn("border", statusConfig[status].className)}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground mono">{leadsCount}</div>
            <div className="text-xs text-muted-foreground">Total leads</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-2xl font-bold text-primary mono">+{leadsThisMonth}</div>
            <div className="text-xs text-muted-foreground">Ce mois</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground mono">{averageScore}%</div>
            <div className="text-xs text-muted-foreground">Score moyen</div>
          </div>
        </div>

        {/* Competition indicator */}
        {!isExclusive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Concurrence
              </span>
              <span className="text-foreground font-medium">{competitorCount} utilisateurs</span>
            </div>
            <Progress value={Math.min(competitorCount * 20, 100)} className="h-2" />
          </div>
        )}

        {/* Performance */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-success/10 to-transparent rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">Performance</span>
          </div>
          <span className="text-success font-medium text-sm">+23% vs mois dernier</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button size="sm" variant="default" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Voir les leads
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
