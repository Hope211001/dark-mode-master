import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Bell, HelpCircle, Loader2, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Assure-toi que l'interface dans ce fichier contient bien 'date_detection'
import { notificationService, NotificationItem } from "@/services/notification.service";
import { useSidebar } from "@/contexts/SidebarContext";

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ClientHeaderProps {
  title: string;
  subtitle?: string;
}

export function ClientHeader({ title, subtitle }: ClientHeaderProps) {
  const navigate = useNavigate();
  const { toggle } = useSidebar();

  // États
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. CHARGEMENT INITIAL & SOCKET ---
  useEffect(() => {
    // A. Charger les données API
    const loadData = async () => {
      try {
        const data = await notificationService.getAll();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Erreur chargement notifs", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // B. Connexion Socket.io
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // C. Écouter les nouveaux leads
    socket.on('new_lead_notification', (newLead: any) => {
      console.log("🔔 Nouvelle notif reçue !", newLead);

      // Ajouter à la liste et incrémenter le compteur
      setNotifications((prev) => [newLead, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Nettoyage
    return () => {
      socket.disconnect();
    };
  }, []);

  // --- 2. ACTIONS ---

  const handleNotificationClick = async (notif: NotificationItem) => {
    navigate(`/client/showLead/${notif.id}`);

    if (!notif.is_read) {
      try {
        await notificationService.markAsRead(notif.id);

        // Update optimiste local
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  // Fonction utilitaire temps
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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 md:px-6">
      {/* GAUCHE */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* DROITE */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* --- SYSTEME DE NOTIFICATION --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs font-bold text-destructive-foreground flex items-center justify-center animate-in zoom-in duration-200">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 max-h-[500px] flex flex-col overflow-hidden">
            <DropdownMenuLabel className="flex items-center justify-between sticky top-0 bg-popover z-10 py-3 border-b">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={(e) => { e.preventDefault(); handleMarkAllRead(); }}
                >
                  Tout marquer lu
                </Badge>
              )}
            </DropdownMenuLabel>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 flex justify-center text-muted-foreground">
                  <Loader2 className="animate-spin h-5 w-5" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Aucune notification.
                </div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className={`flex flex-col items-start gap-1 p-3 cursor-pointer border-b border-border last:border-0 focus:bg-accent transition-colors
          ${!notif.is_read
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500'
                        : 'border-l-2 border-l-transparent'
                      }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${!notif.is_read ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className={`font-medium ${!notif.is_read ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                          {notif.titre || "Nouveau Lead"}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-muted-foreground pl-4 line-clamp-2">
                      Avec le prix : {notif?.prix
                        ? `${notif.prix.toLocaleString()} €`
                        : 'N/A'}
                    </span>

                    <span className="text-[10px] pl-4 font-medium mt-1 text-blue-600 dark:text-blue-400">
                      {timeAgo(notif.date_detection)}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>

            <DropdownMenuSeparator className="shrink-0" />

            <DropdownMenuItem
              className="justify-center text-primary cursor-pointer py-3 font-medium shrink-0"
              onClick={() => navigate('/client/notifications')}
            >
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}