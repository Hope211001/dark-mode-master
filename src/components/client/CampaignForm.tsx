import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import {
  Campaign,
  CampaignInput,
  Source,
  SellerType,
  Furnishing,
  campaignsService,
} from "@/services/campaigns.service";

const TYPES_BIEN = ["appartement", "maison", "studio", "parking", "autre"] as const;
const SOURCES: Source[] = ["leboncoin", "pap.fr", "seloger"];
const SELLER_TYPES: SellerType[] = ["particulier", "pro"];

interface Props {
  open: boolean;
  onClose: () => void;
  zoneId: string;
  campaign?: Campaign | null; // null/undefined = mode création
  onSaved: () => void;
}

// État du formulaire — strings pour les inputs number (pour permettre champ vide), arrays pour multi-select
type FormState = {
  name: string;
  is_active: boolean;
  auto_contact_enabled: boolean;
  // v1
  price_min: string;
  price_max: string;
  surface_min: string;
  search_query: string;
  category_id: string;
  radius: string;
  sources_allowed: Source[];
  max_annonce_scraped: string;
  template_message: string;
  // v2
  surface_max: string;
  types_bien: string[];
  arrondissements_allowed: string; // saisie en CSV pour simplifier
  nb_pieces_min: string;
  nb_pieces_max: string;
  nb_chambres_min: string;
  nb_chambres_max: string;
  furnishing_filter: Furnishing | "any";
  seller_types: SellerType[];
  max_days_old: string;
};

const EMPTY: FormState = {
  name: "",
  is_active: true,
  auto_contact_enabled: false,
  price_min: "",
  price_max: "",
  surface_min: "",
  search_query: "",
  category_id: "",
  radius: "",
  sources_allowed: [],
  max_annonce_scraped: "",
  template_message: "",
  surface_max: "",
  types_bien: [],
  arrondissements_allowed: "",
  nb_pieces_min: "",
  nb_pieces_max: "",
  nb_chambres_min: "",
  nb_chambres_max: "",
  furnishing_filter: "any",
  seller_types: [],
  max_days_old: "",
};

function fromCampaign(c: Campaign): FormState {
  const toStr = (v: number | string | null | undefined) => (v == null ? "" : String(v));
  return {
    name: c.name,
    is_active: c.is_active,
    auto_contact_enabled: c.auto_contact_enabled,
    price_min: toStr(c.price_min),
    price_max: toStr(c.price_max),
    surface_min: toStr(c.surface_min),
    search_query: c.search_query ?? "",
    category_id: toStr(c.category_id),
    radius: toStr(c.radius),
    sources_allowed: c.sources_allowed ?? [],
    max_annonce_scraped: c.max_annonce_scraped ?? "",
    template_message: c.template_message ?? "",
    surface_max: toStr(c.surface_max),
    types_bien: c.types_bien ?? [],
    arrondissements_allowed: (c.arrondissements_allowed ?? []).join(", "),
    nb_pieces_min: toStr(c.nb_pieces_min),
    nb_pieces_max: toStr(c.nb_pieces_max),
    nb_chambres_min: toStr(c.nb_chambres_min),
    nb_chambres_max: toStr(c.nb_chambres_max),
    furnishing_filter: c.furnishing_filter ?? "any",
    seller_types: c.seller_types ?? [],
    max_days_old: toStr(c.max_days_old),
  };
}

function toPayload(f: FormState, zoneId: string, isCreate: boolean): CampaignInput {
  const num = (s: string): number | null => (s.trim() === "" ? null : Number(s));
  const int = (s: string): number | null => (s.trim() === "" ? null : parseInt(s, 10));
  const text = (s: string): string | null => (s.trim() === "" ? null : s.trim());
  const csvArray = (s: string): string[] =>
    s.split(",").map((x) => x.trim()).filter(Boolean);

  return {
    ...(isCreate ? { zoneId } : {}),
    name: f.name.trim(),
    is_active: f.is_active,
    auto_contact_enabled: f.auto_contact_enabled,
    price_min: num(f.price_min),
    price_max: num(f.price_max),
    surface_min: num(f.surface_min),
    search_query: text(f.search_query),
    category_id: num(f.category_id),
    radius: num(f.radius),
    sources_allowed: f.sources_allowed,
    max_annonce_scraped: text(f.max_annonce_scraped),
    template_message: text(f.template_message),
    surface_max: num(f.surface_max),
    types_bien: f.types_bien,
    arrondissements_allowed: csvArray(f.arrondissements_allowed),
    nb_pieces_min: int(f.nb_pieces_min),
    nb_pieces_max: int(f.nb_pieces_max),
    nb_chambres_min: int(f.nb_chambres_min),
    nb_chambres_max: int(f.nb_chambres_max),
    furnishing_filter: f.furnishing_filter === "any" ? null : f.furnishing_filter,
    seller_types: f.seller_types,
    max_days_old: int(f.max_days_old),
  };
}

export function CampaignForm({ open, onClose, zoneId, campaign, onSaved }: Props) {
  const isEdit = !!campaign;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(campaign ? fromCampaign(campaign) : EMPTY);
  }, [open, campaign]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleArrayValue = <T extends string>(key: keyof FormState, value: T) => {
    setForm((f) => {
      const current = f[key] as T[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...f, [key]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire({ icon: "warning", text: "Le nom est requis", confirmButtonColor: "#D45F2A" });
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload(form, zoneId, !isEdit);
      if (isEdit && campaign) await campaignsService.update(campaign.id, payload);
      else await campaignsService.create(payload);
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Erreur lors de la sauvegarde";
      Swal.fire({ icon: "error", title: "Erreur", text: msg, confirmButtonColor: "#D45F2A" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier la campagne" : "Nouvelle campagne"}</DialogTitle>
          <DialogDescription>
            Une campagne = un ciblage indépendant à l'intérieur de cette zone (filtres + template). Plusieurs campagnes peuvent tourner en parallèle sur la même zone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ─── Identification ─── */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nom de la campagne</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="ex : Studios étudiants Paris 11"
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
              <div>
                <Label className="text-sm font-medium">Campagne active</Label>
                <p className="text-xs text-muted-foreground">Si désactivée, plus aucun lead n'est attribué.</p>
              </div>
              <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
              <div>
                <Label className="text-sm font-medium">Contact automatique</Label>
                <p className="text-xs text-muted-foreground">Envoyer le template au propriétaire dès qu'un lead matche.</p>
              </div>
              <Switch checked={form.auto_contact_enabled} onCheckedChange={(v) => set("auto_contact_enabled", v)} />
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["main"]}>

            {/* ─── Filtres principaux ─── */}
            <AccordionItem value="main">
              <AccordionTrigger>Filtres principaux</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Prix min (€)</Label>
                    <Input type="number" value={form.price_min} onChange={(e) => set("price_min", e.target.value)} placeholder="500" />
                  </div>
                  <div>
                    <Label>Prix max (€)</Label>
                    <Input type="number" value={form.price_max} onChange={(e) => set("price_max", e.target.value)} placeholder="2000" />
                  </div>
                  <div>
                    <Label>Surface min (m²)</Label>
                    <Input type="number" value={form.surface_min} onChange={(e) => set("surface_min", e.target.value)} placeholder="20" />
                  </div>
                  <div>
                    <Label>Surface max (m²)</Label>
                    <Input type="number" value={form.surface_max} onChange={(e) => set("surface_max", e.target.value)} placeholder="80" />
                  </div>
                </div>

                <div>
                  <Label>Types de bien</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {TYPES_BIEN.map((t) => (
                      <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={form.types_bien.includes(t)}
                          onCheckedChange={() => toggleArrayValue("types_bien", t)}
                        />
                        <span className="capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Sources de scraping</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {SOURCES.map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={form.sources_allowed.includes(s)}
                          onCheckedChange={() => toggleArrayValue("sources_allowed", s)}
                        />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Vide = toutes les sources.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ─── Filtres détaillés (Leboncoin) ─── */}
            <AccordionItem value="detail">
              <AccordionTrigger>Filtres détaillés (Leboncoin)</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <p className="text-xs text-muted-foreground">
                  Ces filtres seront ignorés tant que le scraper n'extrait pas les champs correspondants — vous pouvez les configurer dès maintenant.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Pièces min</Label>
                    <Input type="number" min="1" value={form.nb_pieces_min} onChange={(e) => set("nb_pieces_min", e.target.value)} placeholder="2" />
                  </div>
                  <div>
                    <Label>Pièces max</Label>
                    <Input type="number" min="1" value={form.nb_pieces_max} onChange={(e) => set("nb_pieces_max", e.target.value)} placeholder="4" />
                  </div>
                  <div>
                    <Label>Chambres min</Label>
                    <Input type="number" min="0" value={form.nb_chambres_min} onChange={(e) => set("nb_chambres_min", e.target.value)} placeholder="1" />
                  </div>
                  <div>
                    <Label>Chambres max</Label>
                    <Input type="number" min="0" value={form.nb_chambres_max} onChange={(e) => set("nb_chambres_max", e.target.value)} placeholder="3" />
                  </div>
                </div>

                <div>
                  <Label>Meublé / Non meublé</Label>
                  <Select value={form.furnishing_filter} onValueChange={(v) => set("furnishing_filter", v as Furnishing | "any")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Peu importe</SelectItem>
                      <SelectItem value="meuble">Meublé</SelectItem>
                      <SelectItem value="non_meuble">Non meublé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type de vendeur</Label>
                  <div className="flex gap-3 mt-1">
                    {SELLER_TYPES.map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={form.seller_types.includes(s)}
                          onCheckedChange={() => toggleArrayValue("seller_types", s)}
                        />
                        <span className="capitalize">{s}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Vide = particulier + pro.</p>
                </div>

                <div>
                  <Label>Annonces récentes (jours)</Label>
                  <Input type="number" min="1" value={form.max_days_old} onChange={(e) => set("max_days_old", e.target.value)} placeholder="ex : 7" />
                  <p className="text-xs text-muted-foreground mt-1">Rejette les leads détectés il y a plus de X jours.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ─── Avancé ─── */}
            <AccordionItem value="advanced">
              <AccordionTrigger>Avancé</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <Label>Mots-clés (recherche libre)</Label>
                  <Input value={form.search_query} onChange={(e) => set("search_query", e.target.value)} placeholder="balcon, terrasse..." />
                  <p className="text-xs text-muted-foreground mt-1">Doit apparaître dans le titre ou la description.</p>
                </div>
                <div>
                  <Label>Arrondissements / codes postaux ciblés</Label>
                  <Input
                    value={form.arrondissements_allowed}
                    onChange={(e) => set("arrondissements_allowed", e.target.value)}
                    placeholder="75011, 75012, 75020"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Séparés par des virgules. Vide = tous.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Rayon (km)</Label>
                    <Input type="number" value={form.radius} onChange={(e) => set("radius", e.target.value)} />
                  </div>
                  <div>
                    <Label>Category ID</Label>
                    <Input type="number" value={form.category_id} onChange={(e) => set("category_id", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Max annonces scrapées par run</Label>
                  <Input value={form.max_annonce_scraped} onChange={(e) => set("max_annonce_scraped", e.target.value)} placeholder="ex : 50" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ─── Template message ─── */}
            <AccordionItem value="template">
              <AccordionTrigger>Message de contact</AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                <Label>Template (envoyé si contact automatique activé)</Label>
                <Textarea
                  value={form.template_message}
                  onChange={(e) => set("template_message", e.target.value)}
                  rows={6}
                  placeholder="Bonjour {{owner_name}}, je suis intéressé par votre bien à {{ville}}..."
                />
                <p className="text-xs text-muted-foreground">Variables : {`{{owner_name}}`}, {`{{ville}}`}.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Annuler</Button>
            <Button type="submit" disabled={saving} className="bg-clay-500 hover:bg-clay-600 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEdit ? "Enregistrer" : "Créer la campagne"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
