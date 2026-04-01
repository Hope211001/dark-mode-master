import { useState } from "react";
import {
  MapPin, Maximize, Euro, Calendar, Mail, Phone,
  TrendingUp, CheckCircle, XCircle, Loader2,
  Send, X, MessageSquare, ExternalLink, Eye, Archive
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

  const { id, titre, ville, surface, prix = 0, statut, date_detection, phone, url, score } = lead;
  const currentStatus = statut || "new";
  const st = statusConfig[currentStatus] || statusConfig.new;
  const displayScore = score != null ? (score <= 10 ? score * 10 : score) : null;
  const scoreColor = displayScore != null
    ? displayScore >= 80 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    : displayScore >= 60 ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
    : "text-slate-400 border-slate-500/30 bg-slate-500/10"
    : "";

  const formattedDate = new Date(date_detection).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });

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
        className="glass-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl group border-white/10 cursor-pointer"
        onClick={() => navigate(`/client/showLead/${id}`)}
      >
        {/* Header Image / Icon */}
        <div className="relative h-32 bg-secondary/30 overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
          <div className="text-primary/20 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={64} />
          </div>

          {/* Overlays statuts et phone */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={cn("border text-[10px] uppercase font-bold", st.className)}>
              {st.label}
            </Badge>
            {phone && (
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold gap-1">
                <Phone className="h-2.5 w-2.5" />
                Tél
              </Badge>
            )}
          </div>
          {displayScore != null && (
            <div className={cn("absolute top-3 right-3")}>
              <Badge variant="outline" className={cn("font-mono font-bold text-[11px]", scoreColor)}>
                {displayScore}%
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Titre & Localisation */}
          <div className="h-12">
            <h3 className="font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors text-sm">
              {titre}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{ville}</span>
            </div>
          </div>

          {/* Grille de détails techniques */}
          <div className="grid grid-cols-2 gap-2 border-y border-white/5 py-3">
            <div className="flex items-center gap-2 text-xs">
              <Maximize className="h-3.5 w-3.5 text-primary/60" />
              <span className="text-foreground font-semibold">{surface} m²</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Euro className="h-3.5 w-3.5 text-primary/60" />
              <span className="text-foreground font-semibold">{prix.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">/hc</span></span>
            </div>
          </div>

          {/* Date et Source */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Détecté le {formattedDate}</span>
            </div>
            <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase">LBC</Badge>
          </div>

          {/* Actions principales */}
          <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
            {/* Bouton Contacter / état */}
            {currentStatus === "contacted" ? (
              <Button size="sm" variant="outline" className="w-full font-bold text-xs h-9 opacity-70 cursor-default" disabled>
                <CheckCircle className="h-3.5 w-3.5 mr-2" />
                Déjà contacté
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 font-bold text-xs h-9"
                onClick={handleOpenContact}
              >
                <Mail className="h-3.5 w-3.5 mr-2" />
                Contacter
              </Button>
            )}

            {/* 3 icônes : Voir annonce, Voir détail, Archiver */}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8 gap-1.5 font-medium border-border/40 hover:border-primary/30 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, '_blank');
                }}
                title="Voir l'annonce originale"
              >
                <ExternalLink className="h-3 w-3" />
                Annonce
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8 gap-1.5 font-medium border-border/40 hover:border-primary/30 hover:text-primary"
                onClick={() => navigate(`/client/showLead/${id}`)}
                title="Voir le détail"
              >
                <Eye className="h-3 w-3" />
                Détail
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 border-border/40 text-muted-foreground hover:border-destructive/30 hover:text-destructive hover:bg-destructive/5"
                onClick={handleReject}
                disabled={rejecting}
                title="Archiver le lead"
              >
                {rejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
