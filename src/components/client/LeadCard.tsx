import { MapPin, Maximize, Euro, Calendar, Mail, ExternalLink, Heart, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadCardProps {
  id: string;
  title: string;
  location: string;
  surface: number;
  loyer: number;
  potentielAirbnb: number;
  score: number;
  status: "new" | "contacted" | "responded" | "negotiating" | "converted" | "lost";
  createdAt: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

const statusConfig = {
  new: { label: "Nouveau", className: "bg-primary/20 text-primary border-primary/30" },
  contacted: { label: "Contacté", className: "bg-warning/20 text-warning border-warning/30" },
  responded: { label: "Répondu", className: "bg-success/20 text-success border-success/30" },
  negotiating: { label: "Négociation", className: "bg-accent/20 text-accent border-accent/30" },
  converted: { label: "Converti", className: "bg-success/20 text-success border-success/30" },
  lost: { label: "Perdu", className: "bg-muted text-muted-foreground border-muted" },
};

function ScoreBadge({ score }: { score: number }) {
  const colorClass = score >= 85 
    ? "bg-success/20 text-success border-success/30" 
    : score >= 70 
    ? "bg-warning/20 text-warning border-warning/30" 
    : "bg-muted text-muted-foreground border-muted";
  
  return (
    <Badge variant="outline" className={cn("font-mono font-bold", colorClass)}>
      {score}%
    </Badge>
  );
}

export function LeadCard({
  id,
  title,
  location,
  surface,
  loyer,
  potentielAirbnb,
  score,
  status,
  createdAt,
  imageUrl,
  isFavorite = false,
}: LeadCardProps) {
  const rentabilite = ((potentielAirbnb - loyer) / loyer * 100).toFixed(0);
  
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg group">
      {/* Image */}
      <div className="relative h-40 bg-secondary overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <MapPin className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn("border", statusConfig[status].className)}>
            {statusConfig[status].label}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          <ScoreBadge score={score} />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "absolute bottom-3 right-3 h-8 w-8 bg-background/80 backdrop-blur",
            isFavorite && "text-destructive"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Title & Location */}
        <div>
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Maximize className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{surface} m²</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{loyer.toLocaleString()}€</span>
          </div>
        </div>

        {/* Potential */}
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Potentiel Airbnb</span>
            <span className="text-success text-xs font-medium">+{rentabilite}%</span>
          </div>
          <div className="text-lg font-bold text-primary mono">
            {potentielAirbnb.toLocaleString()}€/mois
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Ajouté {createdAt}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button size="sm" className="flex-1" variant="default">
            <Mail className="h-4 w-4 mr-2" />
            Contacter
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
              <DropdownMenuItem>Ajouter aux favoris</DropdownMenuItem>
              <DropdownMenuItem>Marquer comme contacté</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Archiver</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
