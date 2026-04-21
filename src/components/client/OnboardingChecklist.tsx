import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { User } from "@/services/auth.service";
import { zoneService, Zone } from "@/services/zones.services.tsx";
import { Button } from "@/components/ui/button";

type Step = {
  id: string;
  label: string;
  done: boolean;
  href?: string;
};

const DISMISS_KEY = "onboarding_dismissed";

export function OnboardingChecklist({ user }: { user: User | null }) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "1");
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (dismissed || !user) return;
    (async () => {
      try {
        const data = await zoneService.getMyZones();
        setZones(data || []);
      } catch {
        // silent : échec du fetch = on affiche quand même les étapes simples (user)
      }
    })();
  }, [dismissed, user]);

  if (dismissed || !user) return null;

  const hasName = !!user.name?.trim();
  const isVerified = user.is_verified !== false; // true ou undefined (ancien user sans la colonne) → considéré validé
  const hasZone = zones.length > 0;
  const hasAutoContact = zones.some((z) => z.auto_contact_enabled);

  const steps: Step[] = [
    { id: "verify", label: "Confirmer mon email", done: isVerified, href: undefined },
    { id: "name", label: "Renseigner mon nom", done: hasName, href: "/client/profile" },
    { id: "zone", label: "Acheter ma première zone", done: hasZone, href: "/client/mapexplorer" },
    { id: "auto", label: "Activer le contact auto", done: hasAutoContact, href: "/client/zones" },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;
  const progressPct = Math.round((doneCount / steps.length) * 100);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="px-4 pb-3">
      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors"
        >
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span className="flex-1 text-left text-sm font-semibold text-foreground">
            Bien démarrer
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {doneCount}/{steps.length}
          </span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Progress bar */}
        <div className="px-3 pb-1.5">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        {expanded && (
          <div className="px-3 pb-3 pt-1 space-y-1.5">
            {steps.map((step) => {
              const row = (
                <div
                  className={`flex items-center gap-2 text-[12px] py-0.5 transition-colors ${
                    step.done
                      ? "text-muted-foreground"
                      : "text-foreground hover:text-primary cursor-pointer"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className={step.done ? "line-through opacity-70" : ""}>
                    {step.label}
                  </span>
                </div>
              );
              return step.href && !step.done ? (
                <Link key={step.id} to={step.href} className="block">
                  {row}
                </Link>
              ) : (
                <div key={step.id}>{row}</div>
              );
            })}

            {allDone && (
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="outline"
                className="w-full h-7 mt-1 text-[11px]"
              >
                <X className="h-3 w-3 mr-1" />
                Masquer ce guide
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
