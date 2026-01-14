import { Mail, MessageSquare, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "email_sent" | "reply_received" | "new_lead" | "alert" | "success";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "reply_received",
    title: "Réponse reçue",
    description: "Le propriétaire du T3 Lyon 3ème a répondu",
    time: "Il y a 5 min",
  },
  {
    id: "2",
    type: "email_sent",
    title: "Email envoyé",
    description: "1ère prise de contact - Studio Part-Dieu",
    time: "Il y a 23 min",
  },
  {
    id: "3",
    type: "new_lead",
    title: "Nouveau lead",
    description: "T2 Guillotière détecté (Score: 8.1)",
    time: "Il y a 1h",
  },
  {
    id: "4",
    type: "email_sent",
    title: "Relance automatique",
    description: "2ème email - T4 Bellecour",
    time: "Il y a 2h",
  },
  {
    id: "5",
    type: "success",
    title: "Visite confirmée",
    description: "RDV fixé pour le T3 Presqu'île",
    time: "Il y a 4h",
  },
];

const activityConfig = {
  email_sent: {
    icon: Mail,
    iconClass: "text-primary bg-primary/10",
  },
  reply_received: {
    icon: MessageSquare,
    iconClass: "text-success bg-success/10",
  },
  new_lead: {
    icon: TrendingUp,
    iconClass: "text-warning bg-warning/10",
  },
  alert: {
    icon: AlertCircle,
    iconClass: "text-destructive bg-destructive/10",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-success bg-success/10",
  },
};

export function ActivityFeed() {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Activité Récente</h2>
        <p className="text-sm text-muted-foreground">Suivi en temps réel</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("p-2.5 rounded-xl", config.iconClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          );
        })}
      </div>

      <button className="mt-6 w-full py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
        Voir toute l'activité →
      </button>
    </div>
  );
}
