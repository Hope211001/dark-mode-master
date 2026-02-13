import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCheck, 
  Loader2, 
  Clock, 
  Bell, 
  Search, 
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Import de ton service
import { notificationService, NotificationItem } from "@/services/notification.service";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // --- 1. Charger les notifications ---
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      // On s'assure que c'est bien un tableau
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error(error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de charger les notifications.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // --- 2. Actions ---

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Mise à jour locale optimiste
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast({ title: "Succès", description: "Toutes les notifications ont été marquées comme lues." });
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    // 1. Marquer comme lu si nécessaire
    if (!notif.is_read) {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch (e) {
        console.error(e);
      }
    }
    // 2. Naviguer vers le lead
    navigate(`/client/showLead/${notif.id}`);
  };

  // --- 3. Utilitaires ---

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return "";
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " an(s)";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mois";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " j";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min";
    return "À l'instant";
  };

  // Filtrage des données affichées
  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background font-sans">
      <ClientSidebar />

      <main className="ml-64 transition-all duration-300">
        <ClientHeader
          title="Centre de notifications"
          subtitle="Retrouvez l'historique de toutes vos alertes et nouveaux leads."
        />

        <div className="p-6 max-w-5xl mx-auto space-y-6">
          
          {/* --- BARRE D'OUTILS --- */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Onglets de filtre */}
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={(val) => setFilter(val as any)}>
              <TabsList className="grid w-full grid-cols-2 sm:w-[300px]">
                <TabsTrigger value="all">
                  Toutes
                  <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5">{notifications.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Non lues
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2 text-[10px] h-5 px-1.5">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Bouton d'action */}
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllRead}
                className="text-muted-foreground hover:text-primary border-dashed"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
          </div>

          {/* --- LISTE DES NOTIFICATIONS --- */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Chargement de l'historique...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Card className="flex flex-col items-center justify-center py-16 border-dashed">
                <div className="bg-secondary/50 p-4 rounded-full mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">C'est calme par ici</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {filter === 'unread' 
                    ? "Vous avez lu toutes vos notifications." 
                    : "Aucune notification à afficher pour le moment."}
                </p>
                {filter === 'unread' && (
                   <Button variant="link" onClick={() => setFilter('all')} className="mt-2">
                     Voir l'historique complet
                   </Button>
                )}
              </Card>
            ) : (
              <div className="grid gap-3">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`
                      group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md
                      ${!notif.is_read 
                        ? 'bg-blue-50/60 border-blue-100 hover:bg-blue-100/50 dark:bg-blue-900/10 dark:border-blue-900/30' 
                        : 'bg-card border-border hover:bg-accent/50'}
                    `}
                  >
                    {/* Indicateur visuel (Point bleu) */}
                    {!notif.is_read && (
                      <span className="absolute left-0 top-6 h-8 w-1 bg-blue-500 rounded-r-full" />
                    )}

                    {/* Icône / Avatar */}
                    <div className={`
                      flex-shrink-0 mt-1 h-10 w-10 rounded-full flex items-center justify-center shadow-sm border
                      ${!notif.is_read 
                        ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400' 
                        : 'bg-secondary text-muted-foreground border-transparent'}
                    `}>
                      {notif.titre.toLowerCase().includes('score') ? (
                         <AlertCircle className="h-5 w-5" />
                      ) : (
                         <Bell className="h-5 w-5" />
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate pr-2 ${!notif.is_read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                          {notif.titre || "Notification système"}
                        </p>
                        <span className="flex-shrink-0 flex items-center text-xs text-muted-foreground whitespace-nowrap">
                          <Clock className="mr-1 h-3 w-3" />
                          {timeAgo(notif.date_detection)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        Score de rentabilité détecté : <span className="font-medium text-foreground">{notif.score}/10</span>. 
                        Cliquez pour voir les détails de cette opportunité.
                      </p>
                    </div>

                    {/* Badge "Nouveau" pour les items non lus */}
                    {!notif.is_read && (
                      <div className="self-center hidden sm:block">
                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 h-6">
                            Nouveau
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fond décoratif (Optionnel) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
};

export default NotificationsPage;