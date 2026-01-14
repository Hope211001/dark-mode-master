import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MessageSquare, MapPin, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "new_lead" | "email_sent" | "response" | "zone_update" | "alert" | "conversion";
  title: string;
  description: string;
  time: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "new_lead",
    title: "Nouveau lead détecté",
    description: "Appartement 85m² à Lyon 6ème - Score 94%",
    time: "Il y a 5 min",
  },
  {
    id: "2",
    type: "response",
    title: "Réponse reçue",
    description: "Le propriétaire de Rue Garibaldi a répondu",
    time: "Il y a 2h",
  },
  {
    id: "3",
    type: "email_sent",
    title: "Email envoyé",
    description: "3 nouveaux contacts sur votre zone Villeurbanne",
    time: "Il y a 4h",
  },
  {
    id: "4",
    type: "zone_update",
    title: "Zone mise à jour",
    description: "Lyon 3ème: 2 nouveaux biens correspondent à vos critères",
    time: "Il y a 6h",
  },
  {
    id: "5",
    type: "alert",
    title: "Zone en compétition",
    description: "2 utilisateurs regardent également Lyon 7ème",
    time: "Il y a 1 jour",
  },
  {
    id: "6",
    type: "conversion",
    title: "Lead converti",
    description: "Félicitations! Appartement Rue de la Part-Dieu signé",
    time: "Il y a 2 jours",
  },
];

const activityConfig = {
  new_lead: { icon: MapPin, color: "text-primary", bg: "bg-primary/20" },
  email_sent: { icon: Mail, color: "text-muted-foreground", bg: "bg-secondary" },
  response: { icon: MessageSquare, color: "text-success", bg: "bg-success/20" },
  zone_update: { icon: TrendingUp, color: "text-accent", bg: "bg-accent/20" },
  alert: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/20" },
  conversion: { icon: CheckCircle, color: "text-success", bg: "bg-success/20" },
};

export function RecentActivity() {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Activité récente</CardTitle>
          <Badge variant="secondary" className="text-xs">
            6 événements
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-1 px-6 pb-6">
            {mockActivities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-secondary/30 -mx-3 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", config.bg)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
