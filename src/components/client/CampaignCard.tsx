import { useState } from "react";
import { Edit, Trash2, Power, Loader2, Mail, Filter } from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { Campaign, campaignsService } from "@/services/campaigns.service";

interface Props {
  campaign: Campaign;
  onEdit: () => void;
  onChanged: () => void;
}

// Résumé compact des filtres pour affichage card
function summarize(c: Campaign): string[] {
  const out: string[] = [];
  if (c.price_min != null || c.price_max != null) {
    out.push(`${c.price_min ?? "—"} – ${c.price_max ?? "—"} €`);
  }
  if (c.surface_min != null || c.surface_max != null) {
    out.push(`${c.surface_min ?? "—"} – ${c.surface_max ?? "—"} m²`);
  }
  if (c.nb_pieces_min != null || c.nb_pieces_max != null) {
    out.push(`${c.nb_pieces_min ?? "—"} – ${c.nb_pieces_max ?? "—"} pièces`);
  }
  if (c.types_bien?.length) out.push(c.types_bien.join(" + "));
  if (c.furnishing_filter) out.push(c.furnishing_filter === "meuble" ? "Meublé" : "Non meublé");
  if (c.seller_types?.length) out.push(c.seller_types.join(" + "));
  if (c.sources_allowed?.length) out.push(c.sources_allowed.join(", "));
  if (c.max_days_old != null) out.push(`< ${c.max_days_old} j`);
  return out;
}

export function CampaignCard({ campaign, onEdit, onChanged }: Props) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    try {
      setToggling(true);
      await campaignsService.toggle(campaign.id);
      onChanged();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Erreur";
      Swal.fire({ icon: "error", title: "Erreur", text: msg, confirmButtonColor: "#D45F2A" });
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Supprimer "${campaign.name}" ?`,
      html: `<p>Les leads déjà attribués à cette campagne perdent leur lien mais restent visibles dans votre historique.</p>`,
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      setDeleting(true);
      await campaignsService.remove(campaign.id);
      onChanged();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Erreur";
      Swal.fire({ icon: "error", title: "Erreur", text: msg, confirmButtonColor: "#D45F2A" });
    } finally {
      setDeleting(false);
    }
  };

  const summary = summarize(campaign);

  return (
    <Card className={campaign.is_active ? "border-clay-200" : "border-border opacity-70"}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-foreground truncate">{campaign.name}</h3>
              <Badge
                variant="outline"
                className={
                  campaign.is_active
                    ? "border-clay-300 bg-clay-50 text-clay-700 text-[10px]"
                    : "border-border bg-muted text-muted-foreground text-[10px]"
                }
              >
                {campaign.is_active ? "Active" : "Inactive"}
              </Badge>
              {campaign.auto_contact_enabled && (
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px] gap-1">
                  <Mail className="h-3 w-3" /> Auto
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggle}
              disabled={toggling}
              title={campaign.is_active ? "Désactiver" : "Activer"}
            >
              {toggling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} title="Modifier">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={deleting}
              title="Supprimer"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {summary.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {summary.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
