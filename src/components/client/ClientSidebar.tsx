import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import io from "socket.io-client"; // <--- AJOUT SOCKET
import {
  LayoutDashboard,
  Users,
  MapPin,
  Settings,
  Bell,
  LogOut,
  User as UserIcon,
  Search
} from "lucide-react";

import { NavLink } from "@/components/NavLink";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { authService, User } from "@/services/auth.service";
import { notificationService } from "@/services/notification.service"; // <--- AJOUT SERVICE

// URL du Socket (assure-toi que c'est la même que dans ClientHeader)
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const navItems = [
  {
    title: "Dashboard",
    url: "/client",
    icon: LayoutDashboard
  },
  {
    title: "Notification",
    url: "/client/notifications",
    icon: Bell,
    isNotification: true, // Marqueur pour identifier cet item
  },
  {
    title: "Mes Leads",
    url: "/client/leads",
    icon: Users,
  },
  {
    title: "Achat de zones",
    url: "/client/mapexplorer",
    icon: Search
  },
  {
    title: "Mes Zones",
    url: "/client/zones",
    icon: MapPin
  },
];

const settingsItems = [
  {
    title: "Paramètres",
    url: "/client/settings",
    icon: Settings
  },
  {
    title: "Mon Profil",
    url: "/client/profile",
    icon: UserIcon
  },
];

export function ClientSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // État pour le badge de notification
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Charger Profil + Notifications
  useEffect(() => {
    const initData = async () => {
      try {
        // A. Profil
        const profileRes = await authService.getProfile();
        setUser(profileRes.user);

        // B. Notifications (Compte initial)
        const notifRes = await notificationService.getAll();
        setUnreadCount(notifRes.unreadCount || 0);

      } catch (error) {
        console.error("Erreur chargement sidebar", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [navigate]);

  // 2. Gestion Temps Réel (Socket.io)
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    // Écouter les nouveaux leads
    socket.on('new_lead_notification', () => {
      // On incrémente simplement le compteur visuel
      setUnreadCount((prev) => prev + 1);
    });

    // Écouter si tout a été marqué comme lu ailleurs (Optionnel mais recommandé)
    socket.on('refresh_list', () => {
      // On recharge le compteur réel
      notificationService.getAll().then(data => setUnreadCount(data.unreadCount));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 3. Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  // 4. Initiales Avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    return email ? email.substring(0, 2).toUpperCase() : "??";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <Link to="/">
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">ImmoScout</span>
              <span className="text-xs text-muted-foreground">Espace Client</span>
            </div>
          </div>
        </Link>


        {/* User Info Dynamique */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
              <AvatarFallback>{getInitials(user?.name, user?.email)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {loading ? "Chargement..." : (user?.name || "Utilisateur")}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            // Logique pour déterminer si on affiche un badge
            let displayBadge = null;

            // Si c'est l'item "Notification" ET qu'il y a des non-lus
            if (item.isNotification && unreadCount > 0) {
              displayBadge = unreadCount > 99 ? '99+' : unreadCount;
            }

            return (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/client"}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground group"
                activeClassName="bg-primary/10 text-primary border border-primary/20"
              >
                <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="flex-1">{item.title}</span>

                {/* Badge Dynamique */}
                {displayBadge && (
                  <Badge className="bg-destructive text-destructive-foreground text-xs hover:bg-destructive h-5 px-1.5 min-w-[1.25rem] flex items-center justify-center">
                    {displayBadge}
                  </Badge>
                )}
              </NavLink>
            );
          })}

          <div className="my-6 border-t border-border" />

          {settingsItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground group"
              activeClassName="bg-primary/10 text-primary border border-primary/20"
            >
              <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Subscription & Logout */}
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Rôle</span>
              <Badge className="bg-primary text-primary-foreground text-xs uppercase">{user?.role || '...'}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Membre depuis : {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '...'}
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}