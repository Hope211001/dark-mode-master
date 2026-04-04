import { useEffect, useState } from "react";
import { Menu, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { authService, User } from "@/services/auth.service";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Espace Administration", subtitle }: HeaderProps) {
  const { toggle } = useSidebar();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    authService.getProfile()
      .then((res) => setProfile(res.user))
      .catch(() => {});
  }, []);

  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    return email ? email[0].toUpperCase() : 'A';
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
          {subtitle && <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* DROITE */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">Admin</span>
        </div>
        {profile && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow">
              {getInitials(profile.name, profile.email)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground leading-none">{profile.name || "Admin"}</p>
              <p className="text-[11px] text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
          onClick={logout}
          title="Se déconnecter"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
