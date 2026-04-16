import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import {
    Loader2, ArrowLeft, MapPin, Calendar, Maximize, Euro,
    TrendingUp, ExternalLink, Hash, Phone, Map as MapIcon,
    FileText, User, Mail, Archive, Send, X, MessageSquare, CheckCircle,
} from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ErrorAlert from "@/components/alert/error";
import SuccessAlert from "@/components/alert/success";

// ── Statut ────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; className: string }> = {
    new:        { label: "Nouveau",    className: "bg-primary/20 text-primary border-primary/30" },
    contacted:  { label: "Contacté",   className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    replied:    { label: "Répondu",    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    rejected:   { label: "Rejeté",     className: "bg-destructive/20 text-destructive border-destructive/30" },
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

// ── Page ──────────────────────────────────────────────────────────────────
const ShowLead = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [contacting, setContacting] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactMessage, setContactMessage] = useState("");
    const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
    const [successAlert, setSuccessAlert] = useState({ visible: false, message: "" });

    useEffect(() => {
        if (!id) return;
        leadsService.getById(id)
            .then(setLead)
            .catch(() => {
                setErrorAlert({ visible: true, message: "Lead introuvable" });
                navigate(-1);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleContact = async () => {
        if (!contactMessage.trim()) {
            setErrorAlert({ visible: true, message: "Veuillez rédiger un message." });
            return;
        }
        try {
            setContacting(true);
            await leadsService.contactLead(lead.id, contactMessage);
            setShowContactModal(false);
            setContactMessage("");
            setSuccessAlert({ visible: true, message: "Message envoyé avec succès !" });
            const updated = await leadsService.getById(lead.id);
            setLead(updated);
        } catch {
            setErrorAlert({ visible: true, message: "Erreur lors de l'envoi." });
        } finally {
            setContacting(false);
        }
    };

    const handleReject = async () => {
        try {
            setRejecting(true);
            await leadsService.updateStatus(lead.id, 'rejected');
            setSuccessAlert({ visible: true, message: "Lead archivé." });
            setTimeout(() => navigate('/client/leads'), 1200);
        } catch {
            setErrorAlert({ visible: true, message: "Erreur lors de l'archivage." });
        } finally {
            setRejecting(false);
        }
    };

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
    if (!lead) return null;

    const status = statusConfig[lead.statut] ?? statusConfig.new;
    const prixM2 = lead.surface > 0 ? Math.round(lead.prix / lead.surface) : 0;
    const sd = lead.scrore_details ?? lead.score_details;

    const currentStatus = lead?.statut || "new";

    return (
        <div className="min-h-screen bg-background">
            <ErrorAlert
                message={errorAlert.message}
                visible={errorAlert.visible}
                onClose={() => setErrorAlert({ visible: false, message: "" })}
            />
            <SuccessAlert
                message={successAlert.message}
                visible={successAlert.visible}
                onClose={() => setSuccessAlert({ visible: false, message: "" })}
            />

            {/* Modal Contact */}
            {showContactModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
                    <div className="relative animate-in zoom-in-95 fade-in duration-200 bg-[#0f172a] border border-primary/20 rounded-2xl shadow-2xl shadow-primary/5 w-full max-w-lg overflow-hidden">
                        <div className="relative bg-gradient-to-r from-primary/10 to-transparent px-6 py-5 border-b border-white/5">
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base">Contacter le propriétaire</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Rédigez votre message pour ce lead</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pt-4 pb-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2 block">Votre message</label>
                            <Textarea
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                placeholder="Bonjour, je suis très intéressé par votre bien..."
                                className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-xl focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none"
                                autoFocus
                            />
                            <p className="text-[10px] text-slate-500 mt-1.5 text-right">
                                {contactMessage.length} caractère{contactMessage.length > 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="px-6 pb-5 flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowContactModal(false)}
                                className="flex-1 rounded-xl border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-11"
                                disabled={contacting}
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleContact}
                                className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-11 gap-2"
                                disabled={contacting || !contactMessage.trim()}
                            >
                                {contacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Envoyer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <ClientSidebar />

            <main className="md:ml-64 transition-[margin] duration-300">
                <ClientHeader title="Détail du Lead" subtitle={lead.titre} />

                <div className="p-4 md:p-6 lg:p-8">

                    {/* ── Hero banner ── */}
                    <div className="relative bg-gradient-to-br from-primary/8 via-card to-card rounded-2xl border border-border p-5 md:p-8 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none rounded-2xl" />

                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-4 text-muted-foreground hover:text-foreground -ml-2 gap-1.5"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-4 w-4" /> Retour à la liste
                        </Button>

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                            <div className="space-y-3 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground gap-1">
                                        <Hash className="h-2.5 w-2.5" />{lead.lbc_id || lead.id}
                                    </Badge>
                                    <Badge className={cn("border text-[10px] uppercase font-bold", status.className)}>
                                        {status.label}
                                    </Badge>
                                    {lead.categorie_scraping && (() => {
                                        const catConfig: Record<string, { label: string; className: string; dot: string }> = {
                                            "leboncoin": { label: "Leboncoin", className: "border-orange-500/30 bg-orange-500/10 text-orange-400", dot: "bg-orange-400" },
                                            "pap.fr": { label: "PAP.fr", className: "border-sky-500/30 bg-sky-500/10 text-sky-400", dot: "bg-sky-400" },
                                            "seloger": { label: "SeLoger", className: "border-rose-500/30 bg-rose-500/10 text-rose-400", dot: "bg-rose-400" },
                                        };
                                        const cat = catConfig[lead.categorie_scraping] || { label: lead.categorie_scraping, className: "border-violet-500/30 bg-violet-500/10 text-violet-400", dot: "bg-violet-400" };
                                        return (
                                            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", cat.className)}>
                                                <span className={cn("h-1.5 w-1.5 rounded-full", cat.dot)} />
                                                {cat.label}
                                            </span>
                                        );
                                    })()}
                                </div>
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight max-w-2xl">
                                    {lead.titre}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground bg-secondary/60 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5 border border-border">
                                        <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5" />{lead.ville}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground bg-secondary/60 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5 border border-border">
                                        <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                        {new Date(lead.date_detection).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <Button className="shrink-0 gap-2 font-semibold h-10 md:h-11 px-5 md:px-6" asChild>
                                <a href={lead.url} target="_blank" rel="noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Voir l'annonce
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* ── Contenu ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                        {/* ── Colonne gauche (2/3) ── */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">

                            {/* Prix + Surface + Score - Résumé rapide mobile-first */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-4 bg-card rounded-xl border border-border text-center">
                                    <Euro className="h-4 w-4 text-primary mx-auto mb-1.5" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Prix</p>
                                    <p className="text-lg md:text-xl font-black text-foreground mt-0.5">
                                        {lead.prix?.toLocaleString('fr-FR')} <span className="text-primary text-sm">€</span>
                                    </p>
                                </div>
                                <div className="p-4 bg-card rounded-xl border border-border text-center">
                                    <Maximize className="h-4 w-4 text-primary mx-auto mb-1.5" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Surface</p>
                                    <p className="text-lg md:text-xl font-black text-foreground mt-0.5">
                                        {lead.surface} <span className="text-muted-foreground text-sm font-normal">m²</span>
                                    </p>
                                </div>
                                <div className="p-4 bg-card rounded-xl border border-border text-center">
                                    <Euro className="h-4 w-4 text-muted-foreground mx-auto mb-1.5" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Prix / m²</p>
                                    <p className="text-lg md:text-xl font-black text-foreground mt-0.5">
                                        {prixM2.toLocaleString()} <span className="text-muted-foreground text-sm font-normal">€</span>
                                    </p>
                                </div>
                                <div className="p-4 bg-card rounded-xl border border-border text-center">
                                    <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-1.5" />
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Score</p>
                                    <p className={cn("text-lg md:text-xl font-black mt-0.5",
                                        (lead.score <= 10 ? lead.score * 10 : lead.score) >= 80 ? "text-emerald-400" :
                                        (lead.score <= 10 ? lead.score * 10 : lead.score) >= 60 ? "text-yellow-400" : "text-destructive"
                                    )}>
                                        {lead.score <= 10 ? lead.score * 10 : lead.score}<span className="text-muted-foreground text-sm font-normal">/100</span>
                                    </p>
                                </div>
                            </div>

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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <Card className="border-border bg-card">
                                    <CardHeader className="pb-3 border-b border-border/50">
                                        <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                            <User className="h-4 w-4 text-violet-400" />
                                            Contact propriétaire
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <DetailRow icon={User} label="Nom" value={lead.owner_name || "Non renseigné"} />
                                        <DetailRow
                                            icon={Phone}
                                            label="Téléphone"
                                            value={lead.phone || "Indisponible"}
                                            highlight={!!lead.phone}
                                            href={lead.phone ? `tel:${lead.phone}` : undefined}
                                        />
                                    </CardContent>
                                </Card>

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
                        </div>

                        {/* ── Colonne droite (1/3) ── */}
                        <div className="space-y-4 md:space-y-6">

                            {/* Actions Contacter + Archiver */}
                            <Card className="border-border bg-card">
                                <CardContent className="p-4 space-y-3">
                                    {currentStatus === "contacted" ? (
                                        <Button size="lg" variant="outline" className="w-full font-bold text-sm h-11 opacity-70 cursor-default" disabled>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Déjà contacté
                                        </Button>
                                    ) : (
                                        <Button
                                            size="lg"
                                            className="w-full bg-primary hover:bg-primary/90 font-bold text-sm h-11"
                                            onClick={() => { setContactMessage(""); setShowContactModal(true); }}
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            Contacter le propriétaire
                                        </Button>
                                    )}
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full font-bold text-sm h-11 border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/40"
                                        onClick={handleReject}
                                        disabled={rejecting}
                                    >
                                        {rejecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Archive className="h-4 w-4 mr-2" />}
                                        Archiver le lead
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Score gauge */}
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

                            {/* Revenu potentiel */}
                            {lead.potentiel_revenu && (
                                <Card className="border-emerald-500/20 bg-emerald-500/5">
                                    <CardContent className="pt-5 pb-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Revenu potentiel</p>
                                                <p className="text-2xl font-black text-emerald-400">
                                                    {lead.potentiel_revenu.toLocaleString()} <span className="text-sm font-semibold">€ / mois</span>
                                                </p>
                                            </div>
                                            <div className="h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                                <Euro className="h-6 w-6 text-emerald-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* CTA voir l'annonce (mobile-friendly) */}
                            <Button className="w-full gap-2 font-semibold h-12 lg:hidden" asChild>
                                <a href={lead.url} target="_blank" rel="noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Voir l'annonce originale
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShowLead;
