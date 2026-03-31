import { MapPin, Maximize, Euro, Calendar, Mail, Phone, Heart, MoreHorizontal, TrendingUp, CheckCircle } from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";

interface LeadCardProps {
  id: string;
  titre: string;           
  ville: string;           
  surface: number;         
  prix: number;            
  potentiel_revenu?: number; 
  score: number;           
  statut_prospection: string; 
  date_detection: string;  
  url: string;
  phone?: string;
  isFavorite?: boolean;
  autoContactEnabled?: boolean;
}

// Mapping des statuts DB vers labels UI
const statusConfig: Record<string, { label: string; className: string }> = {
  NOUVEAU: { label: "Nouveau", className: "bg-primary/20 text-primary border-primary/30" },
  CONTACTE: { label: "Contacté", className: "bg-warning/20 text-warning border-warning/30" },
  REPONDU: { label: "Répondu", className: "bg-success/20 text-success border-success/30" },
  NEGOCIATION: { label: "Négociation", className: "bg-accent/20 text-accent border-accent/30" },
  CONVERTI: { label: "Converti", className: "bg-success/20 text-success border-success/30" },
  PERDU: { label: "Perdu", className: "bg-muted text-muted-foreground border-muted" },
};

function ScoreBadge({ score }: { score: number }) {
  const displayScore = score <= 10 ? score * 10 : score;
  
  const colorClass = displayScore >= 80 
    ? "bg-success/20 text-success border-success/30" 
    : displayScore >= 60 
    ? "bg-warning/20 text-warning border-warning/30" 
    : "bg-destructive/10 text-destructive border-destructive/20";
  
  return (
    <Badge variant="outline" className={cn("font-mono font-bold backdrop-blur-md", colorClass)}>
      {displayScore}%
    </Badge>
  );
}

export function LeadCard({
  id,
  titre,
  ville,
  surface,
  prix = 0,
  score,
  statut_prospection,
  date_detection,
  url,
  phone,
  isFavorite = false,
  autoContactEnabled = false,
}: LeadCardProps) {
  
  const navigate = useNavigate();
  const formattedDate = new Date(date_detection).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <Card
      className="glass-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl group border-white/10 cursor-pointer"
      onClick={() => navigate(`/client/showLead/${id}`)}
    >
      {/* Header Image / Icon */}
      <div className="relative h-32 bg-secondary/30 overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
        <div className="text-primary/20 group-hover:scale-110 transition-transform duration-500">
           <TrendingUp size={64} />
        </div>
        
        {/* Overlays statuts et score */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn("border text-[10px] uppercase font-bold", statusConfig[statut_prospection]?.className || statusConfig.NOUVEAU.className)}>
            {statusConfig[statut_prospection]?.label || statut_prospection}
          </Badge>
          {phone && (
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold gap-1">
              <Phone className="h-2.5 w-2.5" />
              Tél
            </Badge>
          )}
        </div>
        
        {/* <div className="absolute top-3 right-3">
          <ScoreBadge score={score} />
        </div> */}

        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "absolute bottom-3 right-3 h-8 w-8 bg-background/50 backdrop-blur hover:bg-background",
            isFavorite && "text-destructive"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Titre & Localisation */}
        <div className="h-12">
          <h3 className="font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors text-sm">
            {titre}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{ville}</span>
          </div>
        </div>

        {/* Grille de détails techniques */}
        <div className="grid grid-cols-2 gap-2 border-y border-white/5 py-3">
          <div className="flex items-center gap-2 text-xs">
            <Maximize className="h-3.5 w-3.5 text-primary/60" />
            <span className="text-foreground font-semibold">{surface} m²</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Euro className="h-3.5 w-3.5 text-primary/60" />
            <span className="text-foreground font-semibold">{prix.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">/hc</span></span>
          </div>
        </div>

        {/* Date et Source */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Détecté le {formattedDate}</span>
          </div>
          <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase">LBC</Badge>
        </div>

        {/* Actions de prospection */}
        <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          {autoContactEnabled ? null : statut_prospection === "CONTACTE" ? (
            <Button size="sm" variant="outline" className="flex-1 font-bold text-xs h-9 opacity-70 cursor-default" disabled>
              <CheckCircle className="h-3.5 w-3.5 mr-2" />
              Déjà contacté
            </Button>
          ) : (
            <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 font-bold text-xs h-9">
              <Mail className="h-3.5 w-3.5 mr-2" />
              Contacter
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card">
                
                {/* --- CORRECTION ICI --- */}
                <DropdownMenuItem asChild>
                    {/* Utilisation des backticks ` ` pour insérer la variable id */}
                    <Link to={`/client/showLead/${id}`} className="w-full h-full block cursor-pointer">
                        Voir le détail
                    </Link>
                </DropdownMenuItem>
                
                {/* <DropdownMenuItem>Voir l'analyse n8n</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="text-destructive">Archiver le lead</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}