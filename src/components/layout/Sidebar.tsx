import { Home, Map, Mail, Settings, Bell, TrendingUp, Filter, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Dashboard", href: "/", active: true },
  { icon: <TrendingUp className="w-5 h-5" />, label: "Leads", href: "/leads", badge: 12 },
  { icon: <Map className="w-5 h-5" />, label: "Zones", href: "/zones" },
  { icon: <Mail className="w-5 h-5" />, label: "Messages", href: "/messages" },
  { icon: <Filter className="w-5 h-5" />, label: "Filtres", href: "/filters" },
];

const bottomNavItems: NavItem[] = [
  { icon: <Bell className="w-5 h-5" />, label: "Notifications", href: "/notifications", badge: 3 },
  { icon: <Settings className="w-5 h-5" />, label: "Paramètres", href: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-effect">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">PropHunter</h1>
            <p className="text-xs text-muted-foreground">Mini-SaaS Immobilier</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <span className={cn(
              "transition-colors",
              item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-primary/20 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </a>
        ))}
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

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Jean Dupont</p>
            <p className="text-xs text-muted-foreground truncate">Zone: Lyon</p>
          </div>
          <Link>
          </Link>
          <button className="p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
