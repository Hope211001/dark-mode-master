import { Home, Map, Mail, Settings, Bell, TrendingUp, Filter, Users as UserIcon, LogOut, MapPin, X, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { authService, User } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Dashboard", href: "/admin" },
  { icon: <TrendingUp className="w-5 h-5" />, label: "Tous les Leads", href: "/admin/leads" },
  { icon: <Map className="w-5 h-5" />, label: "Zones", href: "/admin/zones" },
  { icon: <UserIcon className="w-5 h-5" />, label: "User", href: "/admin/user" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Statistiques", href: "/admin/statistics" },
  { icon: <Mail className="w-5 h-5" />, label: "Messages", href: "/admin/contacts" },
  { icon: <Settings className="w-5 h-5" />, label: "Paramètres", href: "/admin/settings" },
];

const bottomNavItems: NavItem[] = [
  // { icon: <Bell className="w-5 h-5" />, label: "Notifications", href: "/notifications", badge: 3 },
  // { icon: <Settings className="w-5 h-5" />, label: "Paramètres", href: "/settings" },
];

export function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const { isOpen, close } = useSidebar();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fermer la sidebar mobile lors d'un changement de route
  useEffect(() => {
    close();
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setProfile(response.user);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Fonction pour obtenir les initiales
  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
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

      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo + Close mobile */}
        <Link to="/" >
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">Immo<span className="text-emerald-600">Scout</span></h1>
                  <p className="text-xs text-muted-foreground">Admin</p>
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
          </div>
        </Link>


      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <span className={cn(
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-primary/20 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-1 border-t border-sidebar-border">
        {bottomNavItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group"
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-destructive/20 text-destructive text-xs font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* User Profile - Dynamique */}
      <div className="p-4 border-t border-sidebar-border">
        {loading ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-gray-700"></div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors duration-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {getInitials(profile?.name, profile?.email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.name || profile?.email || 'Utilisateur'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email || 'email@example.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all duration-200 group"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}