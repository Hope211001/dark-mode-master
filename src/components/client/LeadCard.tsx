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
  new:       { label: "Nouveau",   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  contacted: { label: "Contacte",  className: "bg-amber-50 text-amber-700 border-amber-200" },
  replied:   { label: "Repondu",   className: "bg-blue-50 text-blue-700 border-blue-200" },
  rejected:  { label: "Rejete",    className: "bg-red-50 text-red-600 border-red-200" },
};

const sourceConfig: Record<string, { label: string; className: string; dot: string }> = {
  "leboncoin": { label: "Leboncoin", className: "bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-500/30", dot: "bg-white" },
  "pap.fr":    { label: "PAP.fr",    className: "bg-sky-500 text-white border-sky-600 shadow-sm shadow-sky-500/30",       dot: "bg-white" },
  "seloger":   { label: "SeLoger",   className: "bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/30",     dot: "bg-white" },
};

const DESC_MAX = 200;

export function LeadCard({ lead, onStatusChange, onAlert }: LeadCardProps) {
  const navigate = useNavigate();
  const [contacting, setContacting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const { id, titre, ville, surface, prix = 0, statut, date_detection, phone, url, score, description, categorie_scraping } = lead;
  const currentStatus = statut || "new";
  const st = statusConfig[currentStatus] || statusConfig.new;
  const source = categorie_scraping ? sourceConfig[categorie_scraping] : null;

  const displayScore = score != null ? (score <= 10 ? score * 10 : score) : null;
  const scoreColor = displayScore != null
    ? displayScore >= 80 ? "text-emerald-700 border-emerald-200 bg-emerald-50"
    : displayScore >= 60 ? "text-amber-700 border-amber-200 bg-amber-50"
    : "text-gray-500 border-gray-200 bg-gray-50"
    : "";

  const formattedDate = date_detection
    ? new Date(date_detection).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const descText = description || "";
  const isDescLong = descText.length > DESC_MAX;
  const truncatedDesc = isDescLong ? descText.slice(0, DESC_MAX) + "..." : descText;

  const handleOpenContact = () => { setContactMessage(""); setShowContactModal(true); };

  const handleConfirmContact = async () => {
    if (!contactMessage.trim()) { onAlert?.("error", "Veuillez rediger un message avant d'envoyer."); return; }
    try {
      setContacting(true);
      await leadsService.contactLead(id, contactMessage);
      setShowContactModal(false); setContactMessage("");
      onAlert?.("success", "Message envoye avec succes !");
      onStatusChange?.();
    } catch { onAlert?.("error", "Erreur lors de l'envoi du message."); }
    finally { setContacting(false); }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      await leadsService.updateStatus(id, 'rejected');
      onAlert?.("success", "Lead archive.");
      onStatusChange?.();
    } catch { onAlert?.("error", "Erreur lors de l'archivage."); }
    finally { setRejecting(false); }
  };

  return (
    <>
      {/* Modal Contact */}
      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <div className="relative animate-in zoom-in-95 fade-in duration-200 bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="relative bg-emerald-50 px-6 py-5 border-b border-emerald-100">
              <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-base">Contacter le proprietaire</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Redigez votre message pour ce lead</p>
                </div>
              </div>
            </div>
            <div className="px-6 pt-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{titre}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ville}</span>
                    <span className="flex items-center gap-1"><Euro className="h-3 w-3" />{prix.toLocaleString()} EUR</span>
                    {phone && <span className="flex items-center gap-1 text-emerald-600"><Phone className="h-3 w-3" />{phone}</span>}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pt-4 pb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Votre message</label>
              <Textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Bonjour, je suis tres interesse par votre bien..."
                className="bg-gray-50 border-gray-200 text-gray-900 min-h-[120px] rounded-xl focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 resize-none"
                autoFocus
              />
              <p className="text-[10px] text-gray-400 mt-1.5 text-right">{contactMessage.length} caractere{contactMessage.length > 1 ? "s" : ""}</p>
            </div>
            <div className="px-6 pb-5 flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowContactModal(false)} className="flex-1 rounded-xl h-11" disabled={contacting}>
                Annuler
              </Button>
              <Button onClick={handleConfirmContact} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 gap-2" disabled={contacting || !contactMessage.trim()}>
                {contacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <Card
        className="group flex flex-col bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 cursor-pointer rounded-xl"
        onClick={() => navigate(`/client/showLead/${id}`)}
      >
        <CardContent className="flex-1 flex flex-col p-4 space-y-3">
          {/* Source badge */}
          {source && (
            <div className="flex justify-end -mt-1 -mr-1">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em]", source.className)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", source.dot)} />
                {source.label}
              </span>
            </div>
          )}

          {/* Badges + Score */}
          <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5 min-w-0">
              <Badge className={cn("border text-[9px] uppercase font-bold shrink-0", st.className)}>{st.label}</Badge>
              {displayScore != null && (
                <Badge variant="outline" className={cn("font-mono font-bold text-[10px] shrink-0", scoreColor)}>{displayScore}%</Badge>
              )}
            </div>
            <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] font-medium text-gray-400 hover:text-emerald-600 gap-1" onClick={() => window.open(url, '_blank')}>
              <ExternalLink className="h-2.5 w-2.5" /> Voir annonce
            </Button>
          </div>

          {/* Titre */}
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 text-[13px] group-hover:text-emerald-700 transition-colors">{titre}</h3>

          {/* Info */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0" />{ville}</span>
            {formattedDate && <span className="flex items-center gap-1 shrink-0"><CalendarIcon className="h-3 w-3" />{formattedDate}</span>}
            {phone && <span className="flex items-center gap-1 text-emerald-600 shrink-0"><Phone className="h-3 w-3" />Tel</span>}
          </div>

          {/* Description */}
          <div className="min-h-[72px]">
            {descText ? (
              <p className="text-xs text-gray-600 leading-relaxed">
                {truncatedDesc}
                {isDescLong && (
                  <span className="ml-1 text-emerald-600 hover:underline font-medium cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/client/showLead/${id}`); }}>
                    lire plus
                  </span>
                )}
              </p>
            ) : (
              <p className="text-[11px] text-gray-300 italic">Aucune description</p>
            )}
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-md px-2 py-1.5">
              <Maximize className="h-3 w-3 text-gray-400" />
              <span className="text-[11px] font-semibold text-gray-700">{surface} m2</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-md px-2 py-1.5">
              <Euro className="h-3 w-3 text-gray-400" />
              <span className="text-[11px] font-semibold text-gray-700">{prix.toLocaleString()} EUR</span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            {currentStatus === "contacted" ? (
              <Button size="sm" variant="outline" className="flex-1 font-semibold text-[11px] h-8 opacity-60 cursor-default" disabled>
                <CheckCircle className="h-3 w-3 mr-1.5" /> Contacte
              </Button>
            ) : (
              <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] h-8" onClick={handleOpenContact}>
                <Mail className="h-3 w-3 mr-1.5" /> Contacter
              </Button>
            )}
            <Button size="sm" variant="outline" className="flex-1 font-semibold text-[11px] h-8 border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100 hover:border-amber-300" onClick={handleReject} disabled={rejecting}>
              {rejecting ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <Archive className="h-3 w-3 mr-1.5" />}
              Archiver
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
