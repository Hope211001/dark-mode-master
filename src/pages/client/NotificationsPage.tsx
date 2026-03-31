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
  AlertCircle,
  Inbox
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
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <ClientSidebar />

      <main className="md:ml-64 transition-[margin] duration-300 min-h-screen flex flex-col">
        <ClientHeader
          title="Notifications"
          subtitle="Gérez vos alertes et opportunités détectées."
        />

        {/* 
           - Supprimé 'mx-auto' pour ne plus centrer au milieu de l'écran 
           - 'max-w-4xl' limite la largeur pour que ce ne soit pas trop large sur grand écran
           - 'w-full' et 'p-8' pour l'alignement standard dashboard
        */}
        <div className="p-10 max-w-4xl w-full space-y-8">

          {/* BARRE D'OUTILS ALIGNÉE À GAUCHE */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <Tabs defaultValue="all" className="w-auto" onValueChange={(val) => setFilter(val as any)}>
              <TabsList className="bg-slate-900 border border-slate-800 p-1">
                <TabsTrigger value="all" className="px-5 data-[state=active]:bg-slate-800">
                  Toutes
                </TabsTrigger>
                <TabsTrigger value="unread" className="px-5 data-[state=active]:bg-slate-800">
                  Non lues
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-slate-500 hover:text-white text-xs"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
          </div>

          {/* LISTE DES NOTIFICATIONS */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-start py-20 opacity-50 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm italic">Synchronisation...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                <Inbox className="h-10 w-10 text-slate-800 mb-4" />
                <p className="text-slate-500 text-sm italic">Aucune notification à afficher.</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`
                      group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer border
                      ${!notif.is_read
                        ? 'bg-slate-900 border-blue-500/20 hover:border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-transparent border-transparent hover:bg-slate-900/50'}
                    `}
                  >
                    {/* INDICATEUR NON-LU (Point bleu brillant) */}
                    {!notif.is_read && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}

                    {/* ICÔNE */}
                    <div className={`
                      flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center border
                      ${!notif.is_read
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-slate-900/50 text-slate-600 border-slate-800'}
                    `}>
                      {notif.titre.toLowerCase().includes('score') ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>

                    {/* CONTENU TEXTUEL : Gestion intelligente des couleurs Lu/Non-lu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={`text-sm truncate transition-colors ${!notif.is_read
                            ? 'font-bold text-slate-100' // Blanc pour Nouveau
                            : 'font-medium text-slate-500' // Gris pour Lu
                          }`}>
                          {notif.titre || "Notification"}
                        </h4>
                        <span className="flex-shrink-0 text-[11px] font-medium text-slate-600">
                          {timeAgo(notif.date_detection)}
                        </span>
                      </div>

                      <p className={`text-sm line-clamp-1 transition-colors ${!notif.is_read ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                        Opportunité détectée avec un score de : <span className={!notif.is_read ? 'text-blue-400 font-bold' : 'text-slate-700'}>{notif.score}/10</span>
                      </p>
                    </div>

                    {/* BADGE "NEW" */}
                    {!notif.is_read && (
                      <div className="self-center ml-2 hidden sm:block">
                        <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm shadow-blue-500/20 uppercase">
                          New
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;