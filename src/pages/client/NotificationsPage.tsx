import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCheck, Loader2, Bell, AlertCircle, Inbox
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { notificationService, NotificationItem } from "@/services/notification.service";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de charger les notifications.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast({ title: "Succes", description: "Toutes les notifications ont ete marquees comme lues." });
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      } catch (e) { console.error(e); }
    }
    navigate(`/client/showLead/${notif.id}`);
  };

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
    return "A l'instant";
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <ClientSidebar />

      <main className="md:ml-64 transition-[margin] duration-300 min-h-screen flex flex-col">
        <ClientHeader title="Notifications" subtitle="Gerez vos alertes et opportunites detectees." />

        <div className="p-6 md:p-10 max-w-4xl w-full space-y-8">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
            <Tabs defaultValue="all" className="w-auto" onValueChange={(val) => setFilter(val as any)}>
              <TabsList className="bg-muted border border-border p-1">
                <TabsTrigger value="all" className="px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Toutes
                </TabsTrigger>
                <TabsTrigger value="unread" className="px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Non lues
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-clay-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-muted-foreground hover:text-foreground text-xs">
                <CheckCheck className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
          </div>

          {/* List */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-start py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm italic">Synchronisation...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                <Inbox className="h-10 w-10 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground text-sm italic">Aucune notification a afficher.</p>
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
                        ? 'bg-clay-50/50 border-clay-200 hover:border-clay-300 shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-muted/50'}
                    `}
                  >
                    {!notif.is_read && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-clay-500 rounded-full" />
                    )}

                    <div className={`
                      flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center border
                      ${!notif.is_read
                        ? 'bg-clay-50 text-clay-600 border-clay-200'
                        : 'bg-muted/50 text-muted-foreground border-border'}
                    `}>
                      {notif.titre.toLowerCase().includes('score') ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={`text-sm truncate transition-colors ${!notif.is_read
                            ? 'font-bold text-gray-900'
                            : 'font-medium text-muted-foreground'
                          }`}>
                          {notif.titre || "Notification"}
                        </h4>
                        <span className="flex-shrink-0 text-[11px] font-medium text-muted-foreground">
                          {timeAgo(notif.date_detection)}
                        </span>
                      </div>
                      <p className={`text-sm line-clamp-1 transition-colors ${!notif.is_read ? 'text-gray-600' : 'text-muted-foreground'}`}>
                        Opportunite detectee avec un score de : <span className={!notif.is_read ? 'text-clay-600 font-bold' : 'text-muted-foreground'}>{notif.score}/10</span>
                      </p>
                    </div>

                    {!notif.is_read && (
                      <div className="self-center ml-2 hidden sm:block">
                        <div className="bg-clay-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase">
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
