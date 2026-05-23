import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, XCircle, Clock, Layers } from "lucide-react";
import Swal from "sweetalert2";

import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Campaign, campaignsService } from "@/services/campaigns.service";
import { subscriptionService, Subscription } from "@/services/subscription";

import { CampaignCard } from "@/components/client/CampaignCard";
import { CampaignForm } from "@/components/client/CampaignForm";
import ErrorAlert from "@/components/alert/error";

// Cette page liste les campagnes d'une zone et expose l'annulation d'abo Stripe.
// Les anciens filtres édités directement sur la zone (price_min_filter, surface_min_filter,
// template_message, etc.) ont été remplacés par le modèle Campagnes — chaque ciblage
// (jusqu'à N par zone) vit comme une row dédiée dans la table `campaigns`.

const ZoneSetting = () => {
  const { zoneId } = useParams<{ zoneId: string }>();

  const [zoneInfo, setZoneInfo] = useState<Subscription | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });

  const fetchAll = useCallback(async () => {
    if (!zoneId) return;
    try {
      setLoading(true);
      const [zone, camps] = await Promise.all([
        subscriptionService.getSubscriptionByZone(zoneId),
        campaignsService.listByZone(zoneId),
      ]);
      setZoneInfo(zone);
      setCampaigns(camps);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ||
        (error as { message?: string })?.message ||
        "Serveur injoignable";
      setErrorAlert({ visible: true, message: `Erreur de chargement : ${msg}` });
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreate = () => {
    setEditingCampaign(null);
    setFormOpen(true);
  };

  const openEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setFormOpen(true);
  };

  const handleCancelSubscription = async () => {
    if (!zoneId) return;
    const result = await Swal.fire({
      icon: "warning",
      title: "Annuler l'abonnement ?",
      html: `
        <p>L'abonnement sera <strong>annulé à la fin du cycle en cours</strong>.</p>
        <p class="mt-2 text-sm opacity-80">Vous gardez l'accès à la zone et à ses leads jusqu'à la prochaine date de renouvellement.</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Oui, annuler",
      cancelButtonText: "Garder",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    try {
      setCanceling(true);
      const res = await subscriptionService.cancelByZone(zoneId);
      const cancelDate = res.cancel_at ? new Date(res.cancel_at).toLocaleDateString("fr-FR") : "fin du cycle";
      await fetchAll();
      await Swal.fire({
        icon: "success",
        title: "Annulation programmée",
        text: `Votre abonnement prendra fin le ${cancelDate}.`,
        confirmButtonColor: "#059669",
      });
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Impossible d'annuler l'abonnement.";
      Swal.fire({ icon: "error", title: "Erreur", text: msg, confirmButtonColor: "#dc2626" });
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader title={zoneInfo?.nom || "Zone"} subtitle="Campagnes de prospection" />

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Retour */}
          <Link
            to="/client/zones"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-clay-600 transition-colors"
          >
            <ArrowLeft size={14} /> Mes zones
          </Link>

          <ErrorAlert
            visible={errorAlert.visible}
            message={errorAlert.message}
            onClose={() => setErrorAlert({ visible: false, message: "" })}
          />

          {/* Header section campagnes */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-clay-600" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">Campagnes</h2>
                <span className="text-xs font-mono text-muted-foreground">
                  {loading ? "…" : `${campaigns.length}`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Chaque campagne = un ciblage indépendant (filtres + template). Vous pouvez en créer plusieurs sur la même zone.
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2 bg-clay-500 hover:bg-clay-600 text-white">
              <Plus className="h-4 w-4" />
              Nouvelle campagne
            </Button>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-clay-500" />
            </div>
          ) : campaigns.length === 0 ? (
            <Card className="border-dashed border-border bg-transparent">
              <CardContent className="py-12 text-center space-y-3">
                <Layers className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-muted-foreground">Aucune campagne pour le moment.</p>
                <Button onClick={openCreate} variant="outline">
                  Créer la première
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} onEdit={() => openEdit(c)} onChanged={fetchAll} />
              ))}
            </div>
          )}

          {/* ─── Zone Stripe sub : annulation ─── */}
          <div className="pt-8 mt-8 border-t border-border">
            {zoneInfo?.cancel_at ? (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-amber-900 font-semibold">Annulation programmée</h3>
                  <p className="text-sm text-amber-800 mt-1">
                    Votre abonnement à cette zone sera résilié le{" "}
                    <span className="font-bold">
                      {new Date(zoneInfo.cancel_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    . Vos campagnes restent actives jusqu'à cette date.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-red-900 font-semibold">Annuler l'abonnement à cette zone</h3>
                    <p className="text-sm text-red-800/80 mt-1">
                      L'abonnement reste actif jusqu'à la fin du cycle en cours. Toutes les campagnes seront désactivées à l'échéance.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  variant="outline"
                  className="w-full border-red-300 bg-transparent text-red-700 hover:bg-red-100 hover:text-red-800"
                >
                  {canceling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                  Annuler mon abonnement
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Form dialog (création + édition) */}
      {zoneId && (
        <CampaignForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          zoneId={zoneId}
          campaign={editingCampaign}
          onSaved={fetchAll}
        />
      )}
    </div>
  );
};

export default ZoneSetting;
