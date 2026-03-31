import { Search, Bell, RefreshCw, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">Espace Administration</h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success"> Bienvenue</span>
          </div>
        </div>
      </div>
    </header>
  );
}
