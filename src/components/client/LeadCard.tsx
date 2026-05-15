import { useEffect, useRef, useState } from "react";
import {
  MapPin, Maximize, Euro, Calendar as CalendarIcon, Mail, Phone,
  TrendingUp, Loader2, Eye, CheckCircle2, Sparkles,
  Send, X, MessageSquare, MessageCircle, ExternalLink, Archive
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { leadsService, Lead } from "@/services/leads.service";
import { configService } from "@/services/config";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

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

const WHATSAPP_WEBHOOK_URL = "https://n8n.srv903010.hstgr.cloud/webhook/envoyer-message-whatsap";
const AI_GENERATE_WEBHOOK_URL = "https://n8n.srv903010.hstgr.cloud/webhook/generer-message-par-ia";

type ContactMode = "leboncoin" | "whatsapp";

export function LeadCard({ lead, onStatusChange, onAlert }: LeadCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contacting, setContacting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactMode, setContactMode] = useState<ContactMode>("leboncoin");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isDescOverflow, setIsDescOverflow] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const aiChannelRef = useRef<RealtimeChannel | null>(null);
  const aiTimeoutRef = useRef<number | null>(null);

  const { id, titre, ville, surface, prix = 0, statut, date_detection, phone, url, score, description, categorie_scraping, message1, date_envoie1 } = lead;

  const formattedSentDate = date_envoie1
    ? new Date(date_envoie1).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;
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

  const prixM2 = surface > 0 ? Math.round(prix / surface) : 0;

  const descText = description || "";

  useEffect(() => {
    const el = descRef.current;
    if (!el || expanded) return;
    setIsDescOverflow(el.scrollHeight > el.clientHeight + 1);
  }, [descText, expanded]);

  const handleOpenContact = async (mode: ContactMode) => {
    setContactMode(mode);
    setShowContactModal(true);
    try {
      const cfg = await configService.getConfigCached();
      setContactMessage(configService.pickTemplate(cfg, mode));
    } catch {
      setContactMessage("");
    }
  };

  const handleConfirmContact = async () => {
    if (!contactMessage.trim()) { onAlert?.("error", "Veuillez rediger un message avant d'envoyer."); return; }
    try {
      setContacting(true);
      if (contactMode === "whatsapp") {
        const fullName = (user?.name || "").trim();
        const parts = fullName.split(/\s+/).filter(Boolean);
        const userFirstName = parts[0] || "";
        const userLastName = parts.slice(1).join(" ") || "";
        const res = await fetch(WHATSAPP_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_id: id,
            phone,
            message: contactMessage,
            titre,
            ville,
            prix,
            url,
            source: categorie_scraping,
            user_id: user?.id,
            user_name: fullName,
            user_first_name: userFirstName,
            user_last_name: userLastName,
            user_email: user?.email,
          }),
        });
        if (!res.ok) throw new Error("Webhook failed");
        await leadsService.updateStatus(id, "contacted");
      } else {
        await leadsService.contactLead(id, contactMessage);
      }
      setShowContactModal(false); setContactMessage("");
      onAlert?.("success", contactMode === "whatsapp" ? "Message WhatsApp envoye !" : "Message envoye avec succes !");
      onStatusChange?.();
    } catch { onAlert?.("error", "Erreur lors de l'envoi du message."); }
    finally { setContacting(false); }
  };

  const cleanupAi = () => {
    if (aiChannelRef.current) {
      supabase.removeChannel(aiChannelRef.current);
      aiChannelRef.current = null;
    }
    if (aiTimeoutRef.current != null) {
      window.clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
  };

  const handleGenerateAi = async () => {
    cleanupAi();
    setGeneratingAi(true);

    // 1) Souscrire au Realtime AVANT de declencher le webhook
    //    (pour ne pas rater l'event si n8n est tres rapide)
    const channel = supabase
      .channel(`lead-ia-${id}-${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leads", filter: `id=eq.${id}` },
        (payload) => {
          const newRow = payload.new as { message_ia?: string | null };
          if (newRow?.message_ia) {
            setContactMessage(newRow.message_ia);
            setGeneratingAi(false);
            cleanupAi();
          }
        }
      )
      .subscribe();
    aiChannelRef.current = channel;

    // 2) Timeout de securite (60s)
    aiTimeoutRef.current = window.setTimeout(() => {
      cleanupAi();
      setGeneratingAi(false);
      onAlert?.("error", "L'IA a mis trop de temps a repondre.");
    }, 60000);

    // 3) Declencher le webhook n8n (fire-and-forget, l'IA va update message_ia)
    try {
      const res = await fetch(AI_GENERATE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: id }),
      });
      if (!res.ok) throw new Error("AI webhook failed");
    } catch {
      cleanupAi();
      setGeneratingAi(false);
      onAlert?.("error", "Erreur lors du declenchement de la generation IA.");
    }
  };

  useEffect(() => () => cleanupAi(), []);

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
            <div className={cn("relative px-6 py-5 border-b", contactMode === "whatsapp" ? "bg-emerald-50 border-emerald-100" : "bg-orange-50 border-orange-100")}>
              <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", contactMode === "whatsapp" ? "bg-emerald-100" : "bg-orange-100")}>
                  {contactMode === "whatsapp"
                    ? <MessageCircle className="h-5 w-5 text-emerald-600" />
                    : <MessageSquare className="h-5 w-5 text-orange-600" />}
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-base">
                    {contactMode === "whatsapp" ? "Contacter via WhatsApp" : "Contacter dans Leboncoin"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {contactMode === "whatsapp"
                      ? `Message envoye au ${phone || "numero"} via WhatsApp`
                      : "Redigez votre message pour ce lead"}
                  </p>
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Votre message</label>
                <button
                  type="button"
                  onClick={handleGenerateAi}
                  disabled={generatingAi || contacting}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-[11px] font-bold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {generatingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {generatingAi ? "Génération..." : "Générer par IA"}
                </button>
              </div>
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
              <Button
                onClick={handleConfirmContact}
                className={cn(
                  "flex-1 rounded-xl text-white font-bold h-11 gap-2",
                  contactMode === "whatsapp" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-500 hover:bg-orange-600"
                )}
                disabled={contacting || !contactMessage.trim()}
              >
                {contacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Message envoye */}
      {showSentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowSentModal(false)} />
          <div className="relative animate-in zoom-in-95 fade-in duration-200 bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
              <button onClick={() => setShowSentModal(false)} className="absolute top-3 right-3 h-8 w-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/15 ring-1 ring-white/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">Message envoy&eacute;</h3>
                  <p className="text-[11px] text-emerald-100/90 mt-0.5">Contact via WhatsApp</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 space-y-3">
              {formattedSentDate && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Envoy&eacute; le <span className="font-semibold text-gray-700">{formattedSentDate}</span></span>
                </div>
              )}
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                {message1 ? (
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{message1}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Aucun message enregistr&eacute;.</p>
                )}
              </div>
            </div>
            <div className="px-6 pb-4">
              <Button onClick={() => setShowSentModal(false)} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10">
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <Card className="bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Top row: badges + source */}
              <div className="flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                <Badge className={cn("border text-[9px] uppercase font-bold", st.className)}>{st.label}</Badge>
                {displayScore != null && (
                  <Badge variant="outline" className={cn("font-mono font-bold text-[10px]", scoreColor)}>{displayScore}%</Badge>
                )}
                {source && (
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", source.className)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", source.dot)} />
                    {source.label}
                  </span>
                )}
              </div>

              {/* Titre */}
              <h3 className="font-bold text-gray-900 leading-snug text-base md:text-lg">{titre}</h3>

              {/* Info pills (compact inline) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span title="Localisation" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold">
                  <MapPin className="h-3 w-3 text-gray-500" />{ville}
                </span>
                <span title="Surface" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold">
                  <Maximize className="h-3 w-3 text-gray-500" />{surface} m&sup2;
                </span>
                <span title="Prix" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                  <Euro className="h-3 w-3" />{prix.toLocaleString()} &euro;
                </span>
                {prixM2 > 0 && (
                  <span title="Prix par m&sup2;" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold">
                    <TrendingUp className="h-3 w-3 text-gray-500" />{prixM2.toLocaleString()} &euro;/m&sup2;
                  </span>
                )}
                {formattedDate && (
                  <span title="D&eacute;tect&eacute; le" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                    <CalendarIcon className="h-3 w-3 text-gray-500" />{formattedDate}
                  </span>
                )}
                {phone && (
                  <span title="T&eacute;l&eacute;phone" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                    <Phone className="h-3 w-3" />{phone}
                  </span>
                )}
              </div>

              {/* Description */}
              {descText ? (
                <div>
                  <p
                    ref={descRef}
                    className={cn("text-sm text-gray-800 leading-relaxed", !expanded && "line-clamp-3")}
                  >
                    {descText}
                  </p>
                  {(isDescOverflow || expanded) && (
                    <button
                      type="button"
                      className="mt-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-semibold"
                      onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                    >
                      {expanded ? "lire moins" : "lire plus"}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Aucune description</p>
              )}

              {/* Liens (bas gauche) */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-emerald-700 border border-gray-300 hover:border-emerald-400 shadow-sm transition-all"
                  >
                    Voir sur {source?.label || "l'annonce"}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/client/showLead/${id}`)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white border border-emerald-600 hover:border-emerald-700 shadow-sm shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Voir détail
                </button>
              </div>
            </div>

            {/* Actions column (right) */}
            <div className="flex flex-col gap-2 w-52 shrink-0" onClick={(e) => e.stopPropagation()}>
              {categorie_scraping === "leboncoin" && currentStatus !== "contacted" && currentStatus !== "unreachable" && (
                <button
                  type="button"
                  className="group/btn flex items-center gap-2.5 h-12 px-3 rounded-xl bg-white border-2 border-orange-200 hover:border-orange-500 hover:bg-orange-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  onClick={() => handleOpenContact("leboncoin")}
                >
                  <span className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/40">
                    <Mail className="h-4 w-4 text-white" />
                  </span>
                  <span className="flex flex-col items-start min-w-0 leading-tight">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Envoyer message</span>
                    <span className="text-sm font-bold text-gray-800 group-hover/btn:text-orange-700 transition-colors">Sur Leboncoin</span>
                  </span>
                </button>
              )}
              {phone && (
                currentStatus === "contacted" ? (
                  <button
                    type="button"
                    onClick={() => setShowSentModal(true)}
                    aria-label="Voir le message envoy&eacute;"
                    className="group/sent relative flex items-center gap-2.5 h-12 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-md shadow-emerald-600/30 hover:shadow-lg hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all text-left w-full"
                  >
                    <span className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ring-1 ring-white/30">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </span>
                    <span className="flex flex-col items-start min-w-0 leading-tight flex-1">
                      <span className="text-[10px] font-bold text-emerald-100/90 uppercase tracking-wider">Contact&eacute;</span>
                      <span className="text-sm font-extrabold text-white">Sur WhatsApp</span>
                    </span>
                    <Eye className="h-4 w-4 text-white/80 group-hover/sent:text-white shrink-0" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="group/btn flex items-center gap-2.5 h-12 px-3 rounded-xl bg-white border-2 border-emerald-200 hover:border-[#25D366] hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    onClick={() => handleOpenContact("whatsapp")}
                  >
                    <span className="h-8 w-8 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0 shadow-sm shadow-[#25D366]/40">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </span>
                    <span className="flex flex-col items-start min-w-0 leading-tight">
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Envoyer message</span>
                      <span className="text-sm font-bold text-gray-800 group-hover/btn:text-emerald-700 transition-colors">Via WhatsApp</span>
                    </span>
                  </button>
                )
              )}
              <button
                type="button"
                className="group/btn flex items-center gap-2.5 h-12 px-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-500 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                onClick={handleReject}
                disabled={rejecting}
              >
                <span className="h-8 w-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 shadow-sm shadow-slate-700/30">
                  {rejecting ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : <Archive className="h-4 w-4 text-white" />}
                </span>
                <span className="flex flex-col items-start min-w-0 leading-tight">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Rejeter</span>
                  <span className="text-sm font-bold text-gray-800 group-hover/btn:text-slate-900 transition-colors">Archiver</span>
                </span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
