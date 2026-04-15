import { useState } from "react";
import {
  MapPin, Maximize, Euro, Calendar as CalendarIcon, Mail, Phone,
  TrendingUp, CheckCircle, Loader2,
  Send, X, MessageSquare, ExternalLink, Archive
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { leadsService, Lead } from "@/services/leads.service";

interface LeadCardProps {
  lead: Lead;
  onStatusChange?: () => void;
  onAlert?: (type: "success" | "error", message: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new:       { label: "Nouveau",   className: "bg-primary/20 text-primary border-primary/30" },
  contacted: { label: "Contacté",  className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  replied:   { label: "Répondu",   className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  rejected:  { label: "Rejeté",    className: "bg-destructive/20 text-destructive border-destructive/30" },
};

const DESC_MAX = 200;

export function LeadCard({
  lead,
  onStatusChange,
  onAlert,
}: LeadCardProps) {

  const navigate = useNavigate();
  const [contacting, setContacting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const { id, titre, ville, surface, prix = 0, statut, date_detection, phone, url, score, description, categorie_scraping } = lead;
  const currentStatus = statut || "new";
  const st = statusConfig[currentStatus] || statusConfig.new;

  const sourceConfig: Record<string, { label: string; className: string; glow: string; dot: string }> = {
    "leboncoin": {
      label: "Leboncoin",
      className: "bg-gradient-to-r from-orange-500/20 via-orange-500/15 to-amber-500/10 text-orange-300 border-orange-500/40",
      glow: "shadow-[0_0_12px_-2px_rgba(251,146,60,0.45)]",
      dot: "bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)]",
    },
    "pap.fr": {
      label: "PAP.fr",
      className: "bg-gradient-to-r from-sky-500/20 via-sky-500/15 to-blue-500/10 text-sky-300 border-sky-500/40",
      glow: "shadow-[0_0_12px_-2px_rgba(56,189,248,0.45)]",
      dot: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]",
    },
    "seloger": {
      label: "SeLoger",
      className: "bg-gradient-to-r from-rose-500/20 via-rose-500/15 to-red-500/10 text-rose-300 border-rose-500/40",
      glow: "shadow-[0_0_12px_-2px_rgba(244,63,94,0.45)]",
      dot: "bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.9)]",
    },
  };
  const source = categorie_scraping ? sourceConfig[categorie_scraping] : null;
  const displayScore = score != null ? (score <= 10 ? score * 10 : score) : null;
  const scoreColor = displayScore != null
    ? displayScore >= 80 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    : displayScore >= 60 ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
    : "text-slate-400 border-slate-500/30 bg-slate-500/10"
    : "";

  const formattedDate = date_detection
    ? new Date(date_detection).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const descText = description || "";
  const isDescLong = descText.length > DESC_MAX;
  const truncatedDesc = isDescLong ? descText.slice(0, DESC_MAX) + "..." : descText;

  const handleOpenContact = () => {
    setContactMessage("");
    setShowContactModal(true);
  };

  const handleConfirmContact = async () => {
    if (!contactMessage.trim()) {
      onAlert?.("error", "Veuillez rédiger un message avant d'envoyer.");
      return;
    }
    try {
      setContacting(true);
      await leadsService.contactLead(id, contactMessage);
      setShowContactModal(false);
      setContactMessage("");
      onAlert?.("success", "Message envoyé avec succès !");
      onStatusChange?.();
    } catch {
      onAlert?.("error", "Erreur lors de l'envoi du message.");
    } finally {
      setContacting(false);
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      await leadsService.updateStatus(id, 'rejected');
      onAlert?.("success", "Lead archivé.");
      onStatusChange?.();
    } catch {
      onAlert?.("error", "Erreur lors de l'archivage.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <>
      {/* ── Modal Contact ── */}
      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
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
            <div className="px-6 pt-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{titre}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ville}</span>
                    <span className="flex items-center gap-1"><Euro className="h-3 w-3" />{prix.toLocaleString()} €</span>
                    {phone && <span className="flex items-center gap-1 text-emerald-400"><Phone className="h-3 w-3" />{phone}</span>}
                  </div>
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
                onClick={handleConfirmContact}
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

      {/* ── Card ── */}
      <Card
        className="group flex flex-col border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer rounded-xl"
        onClick={() => navigate(`/client/showLead/${id}`)}
      >
        <CardContent className="flex-1 flex flex-col p-4 space-y-3">
          {/* Row 0 : Source badge (top) */}
          {source && (
            <div className="flex justify-end -mt-1 -mr-1">
              <span className={cn(
                "group/src relative inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] backdrop-blur-sm transition-all duration-300 hover:scale-105",
                source.className,
                source.glow
              )}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", source.dot)} />
                  <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", source.dot)} />
                </span>
                {source.label}
              </span>
            </div>
          )}

          {/* Row 1 : Badges + Score + Voir annonce */}
          <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5 min-w-0">
              <Badge className={cn("border text-[9px] uppercase font-bold shrink-0", st.className)}>
                {st.label}
              </Badge>
              {displayScore != null && (
                <Badge variant="outline" className={cn("font-mono font-bold text-[10px] shrink-0", scoreColor)}>
                  {displayScore}%
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px] font-medium text-muted-foreground hover:text-primary gap-1"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="h-2.5 w-2.5" />
              Voir annonce
            </Button>
          </div>

          {/* Row 2 : Titre */}
          <h3 className="font-semibold text-foreground leading-snug line-clamp-2 text-[13px] group-hover:text-primary transition-colors">
            {titre}
          </h3>

          {/* Row 3 : Ville + Date + Téléphone */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />{ville}
            </span>
            {formattedDate && (
              <span className="flex items-center gap-1 shrink-0">
                <CalendarIcon className="h-3 w-3" />{formattedDate}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1 text-emerald-400 shrink-0">
                <Phone className="h-3 w-3" />Tél
              </span>
            )}
          </div>

          {/* Row 4 : Description */}
          <div className="min-h-[72px]">
            {descText ? (
              <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                {truncatedDesc}
                {isDescLong && (
                  <span
                    className="ml-1 text-primary hover:underline font-medium cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); navigate(`/client/showLead/${id}`); }}
                  >
                    lire plus
                  </span>
                )}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground/30 italic">Aucune description</p>
            )}
          </div>

          {/* Row 5 : Stats chips */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-secondary/40 rounded-md px-2 py-1.5">
              <Maximize className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-foreground">{surface} m²</span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary/40 rounded-md px-2 py-1.5">
              <Euro className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-foreground">{prix.toLocaleString()} €</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Row 6 : Contacter + Archiver */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/30" onClick={(e) => e.stopPropagation()}>
            {currentStatus === "contacted" ? (
              <Button size="sm" variant="outline" className="flex-1 font-semibold text-[11px] h-8 opacity-60 cursor-default" disabled>
                <CheckCircle className="h-3 w-3 mr-1.5" />
                Contacté
              </Button>
            ) : (
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 font-semibold text-[11px] h-8"
                onClick={handleOpenContact}
              >
                <Mail className="h-3 w-3 mr-1.5" />
                Contacter
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="flex-1 font-semibold text-[11px] h-8 border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/40"
              onClick={handleReject}
              disabled={rejecting}
            >
              {rejecting ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <Archive className="h-3 w-3 mr-1.5" />}
              Archiver
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
