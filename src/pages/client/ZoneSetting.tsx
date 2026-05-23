import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, Plus, Layers,
  Power, Edit, Trash2, Mail, Filter,
} from "lucide-react";
import Swal from "sweetalert2";

import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Campaign, campaignsService } from "@/services/campaigns.service";
import { subscriptionService, Subscription } from "@/services/subscription";

import { CampaignForm } from "@/components/client/CampaignForm";
import ErrorAlert from "@/components/alert/error";

// Résumé compact des filtres pour affichage table (1 ligne)
function summarizeFilters(c: Campaign): string {
  const parts: string[] = [];
  if (c.price_min != null || c.price_max != null) {
    parts.push(`${c.price_min ?? "—"}–${c.price_max ?? "—"} €`);
  }
  if (c.surface_min != null || c.surface_max != null) {
    parts.push(`${c.surface_min ?? "—"}–${c.surface_max ?? "—"} m²`);
  }
  if (c.nb_pieces_min != null || c.nb_pieces_max != null) {
    parts.push(`${c.nb_pieces_min ?? "—"}–${c.nb_pieces_max ?? "—"} pièces`);
  }
  if (c.types_bien?.length) parts.push(c.types_bien.join("+"));
  if (c.furnishing_filter) parts.push(c.furnishing_filter === "meuble" ? "Meublé" : "Non meublé");
  if (c.seller_types?.length) parts.push(c.seller_types.join("+"));
  if (c.sources_allowed?.length) parts.push(c.sources_allowed.join(","));
  if (c.max_days_old != null) parts.push(`< ${c.max_days_old}j`);
  return parts.length ? parts.join(" · ") : "Aucun filtre — tous les leads";
}

// Cette page liste les campagnes d'une zone et expose l'annulation d'abo Stripe.
// Les anciens filtres édités directement sur la zone (price_min_filter, surface_min_filter,
// template_message, etc.) ont été remplacés par le modèle Campagnes — chaque ciblage
// (jusqu'à N par zone) vit comme une row dédiée dans la table `campaigns`.

const ZoneSetting = () => {
  const { zoneId } = useParams<{ zoneId: string }>();

  const [zoneInfo, setZoneInfo] = useState<Subscription | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
  const [busyId, setBusyId] = useState<string | null>(null); // ligne en cours d'action (toggle/delete)

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

  const handleToggle = async (c: Campaign) => {
    try {
      setBusyId(c.id);
      await campaignsService.toggle(c.id);
      await fetchAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Erreur";
      Swal.fire({ icon: "error", title: "Erreur", text: msg, confirmButtonColor: "#D45F2A" });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (c: Campaign) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Supprimer "${c.name}" ?`,
      html: "<p>Les leads déjà attribués à cette campagne perdent leur lien mais restent visibles dans votre historique.</p>",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      setBusyId(c.id);
      await campaignsService.remove(c.id);
      await fetchAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Erreur";
      Swal.fire({ icon: "error", title: "Erreur", text: msg, confirmButtonColor: "#D45F2A" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader title={zoneInfo?.nom || "Zone"} subtitle="Campagnes de prospection" />

        <div className="p-6 space-y-6">
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
            <Card className="overflow-hidden border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                    <TableHead className="font-semibold">Nom</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Auto</TableHead>
                    <TableHead className="font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> Filtres</span>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id} className={c.is_active ? "" : "opacity-60"}>
                      <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            c.is_active
                              ? "border-clay-300 bg-clay-50 text-clay-700 text-[10px] hover:bg-clay-50"
                              : "border-border bg-muted text-muted-foreground text-[10px] hover:bg-muted"
                          }
                        >
                          {c.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {c.auto_contact_enabled ? (
                          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px] gap-1 hover:bg-emerald-50">
                            <Mail className="h-3 w-3" /> Auto
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md">
                        <div className="line-clamp-2">{summarizeFilters(c)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggle(c)}
                            disabled={busyId === c.id}
                            title={c.is_active ? "Désactiver" : "Activer"}
                          >
                            {busyId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(c)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(c)}
                            disabled={busyId === c.id}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

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
