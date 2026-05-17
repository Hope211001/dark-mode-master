import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import io from "socket.io-client"; // <--- AJOUT SOCKET
import {
  LayoutDashboard,
  Users,
  MapPin,
  Settings,
  Bell,
  LogOut,
  User as UserIcon,
  Search,
  Receipt,
  X,
} from "lucide-react";

import { NavLink } from "@/components/NavLink";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { OnboardingChecklist } from "@/components/client/OnboardingChecklist";

import { authService, User } from "@/services/auth.service";
import { notificationService } from "@/services/notification.service"; // <--- AJOUT SERVICE
import { useSidebar } from "@/contexts/SidebarContext";

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
    title: "Leads Archivé",
    url: "/client/archive-leads",
    icon: Receipt
  },
  {
    title: "Leads injoignable",
    url: "/client/injoignable",
    icon: Receipt
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
  {
    title: "Factures",
    url: "/client/invoices",
    icon: Receipt
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
  const location = useLocation();
  const { isOpen, close } = useSidebar();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // État pour le badge de notification
  const [unreadCount, setUnreadCount] = useState(0);

  // Fermer la sidebar mobile lors d'un changement de route
  useEffect(() => {
    close();
  }, [location.pathname]);

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
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-sidebar transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          {/* Logo + Close mobile */}
          <Link to="/">
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-clay-600 to-clay-600 shadow-lg shadow-clay-500/20">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">Immo<span className="text-clay-600">Scout</span></span>
                <span className="text-xs text-muted-foreground">Espace Client</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={(e) => { e.preventDefault(); close(); }}
            >
              <X className="h-5 w-5" />
            </Button>
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
        <nav className="flex-1 overflow-y-auto space-y-1 p-4">
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

        {/* Onboarding guide — au-dessus du bouton Logout, masquable */}
        <div className="border-t border-border pt-3">
          <OnboardingChecklist user={user} />
        </div>

        {/* Logout */}
        <div className="px-4 pb-4">
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
    </>
  );
}