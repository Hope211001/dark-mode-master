import { MapPin, TrendingUp, Eye, Settings, Lock, Hash, Mail, Loader2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscriptionService, Subscription } from "@/services/subscription";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface ZoneCardProps {
  id: string;
  nom: string;
  codes_postaux: string[];
  leadsCount?: number;
  leadsThisMonth?: number;
  price?: number;
  status?: "active" | "paused" | "expired";
  onCanceled?: () => void;
}

const statusConfig = {
  active: { label: "Active", className: "bg-success/20 text-success border-success/30" },
  paused: { label: "En pause", className: "bg-warning/20 text-warning border-warning/30" },
  expired: { label: "Expirée", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function ZoneCard({
  id,
  nom,
  codes_postaux = [],
  leadsCount = 0,
  leadsThisMonth = 0,
  price = 0,
  status = "active",
  onCanceled,
}: ZoneCardProps) {

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [fetching, setFetching] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const handleCancel = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: `Annuler l'abonnement à ${nom} ?`,
      html: `
        <p>L'abonnement sera <strong>annulé à la fin du cycle en cours</strong>.</p>
        <p class="mt-2 text-sm opacity-80">Vous gardez l'accès jusqu'à la prochaine date de renouvellement.</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Garder',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#475569',
      background: '#0f172a',
      color: '#fff',
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    try {
      setCanceling(true);
      const res = await subscriptionService.cancelByZone(id);
      const cancelDate = res.cancel_at ? new Date(res.cancel_at).toLocaleDateString('fr-FR') : 'fin du cycle';
      // Refresh local pour cacher le bouton tout de suite
      await fetchSubscription();
      await Swal.fire({
        icon: 'success',
        title: 'Annulation programmée',
        text: `L'abonnement prendra fin le ${cancelDate}.`,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#059669',
      });
      onCanceled?.();
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Impossible d'annuler l'abonnement.";
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: msg,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubscription();
    }
  }, [id]);

  const fetchSubscription = async () => {
    try {
      setFetching(true);
      const data = await subscriptionService.getSubscriptionByZone(id);
      setSubscription(data);
    } catch (error: any) {
      console.error("Erreur lors de la récupération de la zone:", id, error);
      // On ne met pas de toast ici pour ne pas polluer l'écran si l'utilisateur a bcp de zones
    } finally {
      setFetching(false);
    }
  };

  return (
    <Card className="glass-card transition-all duration-300 hover:border-primary/30 group shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {nom}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span>{codes_postaux.length} codes postaux</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-[10px]">
              <Lock className="h-3 w-3 mr-1" />
              CONCESSION
            </Badge>
            <Badge variant="outline" className={cn("border text-[10px]", statusConfig[status].className)}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {codes_postaux.slice(0, 4).map((cp) => (
            <span key={cp} className="text-[10px] bg-secondary px-2 py-0.5 rounded border border-border">
              {cp}
            </span>
          ))}
          {codes_postaux.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{codes_postaux.length - 4}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-xs text-muted-foreground font-medium">
            Prix : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)}
          </span>
        </div>

        {/* AFFICHAGE DYNAMIQUE DE L'AUTO-CONTACT */}
        <div className={cn(
            "flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300",
            fetching 
              ? "bg-secondary/10 border-border" 
              : subscription?.auto_contact_enabled 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : "bg-slate-500/10 border-slate-500/20"
        )}>
          <div className="flex items-center gap-2">
            {fetching ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Mail className={cn("h-4 w-4", subscription?.auto_contact_enabled ? "text-emerald-500" : "text-slate-400")} />
            )}
            <span className="text-xs text-muted-foreground font-medium">
              Auto-contact : 
              <span className={cn(
                "ml-1 font-bold",
                subscription?.auto_contact_enabled ? "text-emerald-500" : "text-slate-500"
              )}>
                {fetching ? "Chargement..." : (subscription?.auto_contact_enabled ? "Activé" : "Désactivé")}
              </span>
            </span>
          </div>
        </div>

        {/* Badge "Annulation programmée" — visible si cancel_at set */}
        {subscription?.cancel_at && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10">
            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-xs text-amber-200 font-medium">
              Annulation programmée le{" "}
              <span className="font-bold">
                {new Date(subscription.cancel_at).toLocaleDateString('fr-FR')}
              </span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Link to={`/client/leads?zone=${id}`} className="flex-1">
            <Button size="sm" variant="default" className="w-full h-9 font-bold bg-primary hover:bg-primary/90">
              <Eye className="h-4 w-4 mr-2" />
              Flux Leads
            </Button>
          </Link>
          <Link to={`/client/zone-setting/${id}`}>
            <Button size="sm" variant="outline" className="h-9 w-9 p-0" title="Paramètres">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          {!subscription?.cancel_at && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={canceling}
              className="h-9 w-9 p-0 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/60"
              title="Annuler l'abonnement"
            >
              {canceling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}