import { NavLink } from "@/components/NavLink";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authService,User } from "@/services/auth.service";
import { useEffect, useState } from "react"; // Ajout de hooks
import { useNavigate } from "react-router-dom"; // Pour la redirection après logout

import {
  LayoutDashboard,
  Users,
  MapPin,
  Settings,
  Bell,
  LogOut,
  User as UserIcon,
  Search,
  Mail
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    url: "/client",
    icon: LayoutDashboard
  },
  {
    title: "Mes Leads",
    url: "/client/leads",
    icon: Users,
  },
  {
    title: "Achat de zones",
    url: "/client/mapexploter",
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

  // 1. Charger les données du profil au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.user);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil", error);
        // Si erreur d'auth, on peut rediriger vers login
        // navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // 2. Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login"); // Redirige vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  // 3. Fonction pour générer les initiales de l'avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    return email ? email.substring(0, 2).toUpperCase() : "??";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">ImmoScout</span>
            <span className="text-xs text-muted-foreground">Espace Client</span>
          </div>
        </div>

        {/* User Info Dynamique */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              {/* On peut utiliser un avatar par défaut basé sur le nom */}
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
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>

        {/* Navigation (inchangé) */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/client"}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground group"
              activeClassName="bg-primary/10 text-primary border border-primary/20"
            >
              <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}

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
              Membre depuis : {user ? new Date(user.created_at).toLocaleDateString() : '...'}
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
