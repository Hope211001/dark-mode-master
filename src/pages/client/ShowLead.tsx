import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import {
    Loader2, ArrowLeft, MapPin, Calendar, Maximize, Euro,
    TrendingUp, ExternalLink, Hash, Phone, Map as MapIcon,
    FileText, User, CheckCircle2, XCircle, Image as ImageIcon,
    Navigation, Banknote,
} from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── Statut prospection ────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; className: string }> = {
    NOUVEAU:     { label: "Nouveau",       className: "bg-primary/20 text-primary border-primary/30" },
    CONTACTE:    { label: "Contacté",      className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    REPONDU:     { label: "Répondu",       className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    NEGOCIATION: { label: "Négociation",   className: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
    CONVERTI:    { label: "Converti",      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    PERDU:       { label: "Perdu",         className: "bg-muted text-muted-foreground border-muted" },
};

// ── Score gauge ───────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
    const display = score <= 10 ? score * 10 : score;
    const color = display >= 80
        ? "text-emerald-400 stroke-emerald-400"
        : display >= 60
        ? "text-yellow-400 stroke-yellow-400"
        : "text-destructive stroke-destructive";
    const bgColor = display >= 80
        ? "bg-emerald-500/10 border-emerald-500/20"
        : display >= 60
        ? "bg-yellow-500/10 border-yellow-500/20"
        : "bg-destructive/10 border-destructive/20";
    const label = display >= 80 ? "Excellent" : display >= 60 ? "Bon potentiel" : "Faible";

    const r = 40;
    const circ = 2 * Math.PI * r;
    const offset = circ - (display / 100) * circ;

    return (
        <div className={cn("flex flex-col items-center justify-center p-6 rounded-2xl border", bgColor)}>
            <svg width="104" height="104" className="-rotate-90">
                <circle cx="52" cy="52" r={r} fill="none" strokeWidth="8"
                    className="stroke-border" />
                <circle cx="52" cy="52" r={r} fill="none" strokeWidth="8"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn("transition-all duration-1000", color.split(" ")[1])} />
            </svg>
            <div className="text-center -mt-2">
                <span className={cn("text-4xl font-black", color.split(" ")[0])}>{display}</span>
                <span className="text-muted-foreground text-xs block font-bold uppercase mt-0.5">/ 100</span>
                <span className={cn("text-xs font-semibold mt-1 block", color.split(" ")[0])}>{label}</span>
            </div>
        </div>
    );
}

// ── Ligne de détail ────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value, highlight = false, href }: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
    href?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-2.5 text-muted-foreground text-sm min-w-0">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
            </div>
            {href ? (
                <a href={href} className={cn("font-semibold text-sm text-right truncate max-w-[55%] text-primary hover:underline", highlight && "text-emerald-400")}>
                    {value}
                </a>
            ) : (
                <span className={cn("font-semibold text-sm text-right truncate max-w-[55%]", highlight ? "text-emerald-400" : "text-foreground")}>
                    {value}
                </span>
            )}
        </div>
    );
}

// ── Barre de sous-score ────────────────────────────────────────────────────
function SubScoreBar({ label, value, max = 10 }: { label: string; value?: number; max?: number }) {
    if (value == null) return null;
    const pct = Math.min(100, (Number(value) / max) * 100);
    const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-yellow-500" : "bg-destructive";
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-bold text-foreground">{Number(value).toFixed(1)} / {max}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
const ShowLead = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [lead, setLead] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        leadsService.getById(id)
            .then(setLead)
            .catch(() => {
                toast({ title: "Erreur", description: "Lead introuvable", variant: "destructive" });
                navigate(-1);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
    if (!lead) return null;

    const status = statusConfig[lead.statut_prospection] ?? statusConfig.NOUVEAU;
    const scoreDisplay = lead.score <= 10 ? lead.score * 10 : lead.score;
    const prixM2 = lead.surface > 0 ? Math.round(lead.prix / lead.surface) : 0;
    const sd = lead.scrore_details ?? lead.score_details;

    return (
        <div className="min-h-screen bg-background">
            <ClientSidebar />

            <main className="ml-64">

                {/* ── Hero banner ── */}
                <div className="relative bg-gradient-to-br from-primary/8 via-background to-background border-b border-border px-8 pt-6 pb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-5 text-muted-foreground hover:text-foreground -ml-1 gap-1.5"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4" /> Retour à la liste
                    </Button>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div className="space-y-3">
                            {/* ID badge + titre */}
                            <div className="flex items-center gap-2.5">
                                <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground gap-1">
                                    <Hash className="h-2.5 w-2.5" />{lead.lbc_id || lead.id}
                                </Badge>
                                <Badge className={cn("border text-[10px] uppercase font-bold", status.className)}>
                                    {status.label}
                                </Badge>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight max-w-2xl">
                                {lead.titre}
                            </h1>
                            {/* Méta infos */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/60 rounded-md px-3 py-1.5 border border-border">
                                    <MapPin className="h-3.5 w-3.5" />{lead.ville}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/60 rounded-md px-3 py-1.5 border border-border">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Détecté le {new Date(lead.date_detection).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/60 rounded-md px-3 py-1.5 border border-border">
                                    <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase border-border mr-0">LBC</Badge>
                                    LeBonCoin
                                </span>
                            </div>
                        </div>

                        <Button
                            className="shrink-0 gap-2 font-semibold h-11 px-6"
                            asChild
                        >
                            <a href={lead.url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Voir l'annonce
                            </a>
                        </Button>
                    </div>
                </div>

                {/* ── Contenu ── */}
                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Colonne gauche (2/3) ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Description */}
                        <Card className="border-border bg-card">
                            <CardHeader className="pb-3 border-b border-border/50">
                                <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Description de l'annonce
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {lead.description || "Aucune description fournie."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Contact + Zone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact propriétaire */}
                            <Card className="border-border bg-card">
                                <CardHeader className="pb-3 border-b border-border/50">
                                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                        <User className="h-4 w-4 text-violet-400" />
                                        Contact propriétaire
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <DetailRow
                                        icon={User}
                                        label="Nom"
                                        value={lead.owner_name || "Non renseigné"}
                                    />
                                    <DetailRow
                                        icon={Phone}
                                        label="Téléphone"
                                        value={lead.phone || "Indisponible"}
                                        highlight={!!lead.phone}
                                        href={lead.phone ? `tel:${lead.phone}` : undefined}
                                    />
                                </CardContent>
                            </Card>

                            {/* Zone */}
                            <Card className="border-border bg-card">
                                <CardHeader className="pb-3 border-b border-border/50">
                                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                        <MapIcon className="h-4 w-4 text-amber-400" />
                                        Assignation & Zone
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <DetailRow icon={MapPin} label="Zone" value={lead.zones?.nom || "Non définie"} />
                                    {lead.zone_id && (
                                        <DetailRow icon={Hash} label="Zone ID" value={
                                            <span className="font-mono text-xs">{lead.zone_id}</span>
                                        } />
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Détail du score IA (si disponible) */}
                        {sd && (
                            <Card className="border-border bg-card">
                                <CardHeader className="pb-3 border-b border-border/50">
                                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                                        Détail de l'analyse IA
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-5 space-y-4">
                                    {/* Métriques sous forme de barres */}
                                    <div className="space-y-3">
                                        <SubScoreBar label="Score rentabilité" value={sd.score_rentabilite} max={10} />
                                        <SubScoreBar label="Score localisation" value={sd.score_localisation} max={10} />
                                        <SubScoreBar label="Score vérification" value={sd.score_verification} max={10} />
                                    </div>

                                    <Separator className="bg-border/50" />

                                    {/* Infos complémentaires */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {sd.nb_photos != null && (
                                            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Photos</p>
                                                    <p className="text-sm font-bold text-foreground">{sd.nb_photos}</p>
                                                </div>
                                            </div>
                                        )}
                                        {sd.distance_km != null && (
                                            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                                                <Navigation className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Distance</p>
                                                    <p className="text-sm font-bold text-foreground">{sd.distance_km} km</p>
                                                </div>
                                            </div>
                                        )}
                                        {sd.revenu_estime != null && (
                                            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                                                <Banknote className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Revenu estimé</p>
                                                    <p className="text-sm font-bold text-foreground">{Number(sd.revenu_estime).toLocaleString()} €</p>
                                                </div>
                                            </div>
                                        )}
                                        {sd.has_keywords != null && (
                                            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                                                {sd.has_keywords
                                                    ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                    : <XCircle className="h-4 w-4 text-destructive" />}
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Mots-clés</p>
                                                    <p className="text-sm font-bold text-foreground">{sd.has_keywords ? "Présents" : "Absents"}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* ── Colonne droite (1/3) ── */}
                    <div className="space-y-6">

                        {/* Prix & surface */}
                        <Card className="border-border bg-card overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                            <CardContent className="pt-6 space-y-4">
                                {/* Prix principal */}
                                <div className="p-5 bg-secondary/30 rounded-xl border border-border/50 text-center">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Prix du bien</p>
                                    <p className="text-4xl font-black text-foreground tracking-tight">
                                        {lead.prix?.toLocaleString('fr-FR')} <span className="text-primary">€</span>
                                    </p>
                                </div>

                                {/* Surface / Prix m² */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-secondary/20 rounded-lg border border-border/50 text-center">
                                        <Maximize className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                        <p className="text-xs text-muted-foreground uppercase font-bold mb-0.5">Surface</p>
                                        <p className="text-xl font-bold text-foreground">{lead.surface} <span className="text-sm font-normal text-muted-foreground">m²</span></p>
                                    </div>
                                    <div className="p-4 bg-secondary/20 rounded-lg border border-border/50 text-center">
                                        <Euro className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                        <p className="text-xs text-muted-foreground uppercase font-bold mb-0.5">Prix / m²</p>
                                        <p className="text-xl font-bold text-foreground">{prixM2.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">€</span></p>
                                    </div>
                                </div>

                                {lead.potentiel_revenu && (
                                    <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground font-bold uppercase">Revenu potentiel</span>
                                        <span className="font-bold text-emerald-400">{lead.potentiel_revenu.toLocaleString()} € / mois</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Score */}
                        <Card className="border-border bg-card">
                            <CardHeader className="pb-3 border-b border-border/50">
                                <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                                    Score de rentabilité
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <ScoreGauge score={lead.score || 0} />

                                {sd?.ratio != null && (
                                    <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border/50 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground font-bold uppercase">Ratio rendement</span>
                                        <span className="font-mono font-bold text-foreground">{Number(sd.ratio).toFixed(2)}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShowLead;
