import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const CALENDAR_URL = "https://api.leadconnectorhq.com/widget/booking/R5SUJQOuFXYWUnR7S7Sb";

export default function BookingModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    // Inject LeadConnector embed script if not already there
    const id = "leadconnector-form-embed";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://api.leadconnectorhq.com/js/form_embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [open]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-ink/55 backdrop-blur-md flex items-stretch md:items-center justify-center md:p-6 overflow-y-auto"
      data-testid="booking-overlay"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative bg-paper w-full max-w-3xl my-auto md:my-8 max-h-[100vh] md:max-h-[92vh] rounded-none md:rounded-3xl shadow-xl border border-line overflow-hidden flex flex-col"
        data-testid="booking-modal"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-7 py-4 bg-paper border-b border-line">
          <div>
            <div className="text-mute text-xs font-mono uppercase tracking-wider">Rendez-vous · 20 min</div>
            <div className="text-ink font-bold text-lg md:text-xl mt-0.5">Échangeons sur votre zone</div>
          </div>
          <button onClick={onClose} className="text-mute hover:text-ink p-2" data-testid="booking-close" aria-label="fermer">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-cream-2/40">
          <iframe
            src={CALENDAR_URL}
            title="Prendre rendez-vous MÉRIDIEN"
            className="w-full bg-paper"
            style={{ minHeight: "640px", border: "none" }}
            scrolling="no"
            data-testid="booking-iframe"
          />
        </div>

        <div className="px-5 md:px-7 py-3 bg-paper border-t border-line text-mute text-xs text-center">
          Échange court, sans engagement. On vérifie ensemble la dispo de votre zone.
        </div>
      </motion.div>
    </motion.div>
  );
}
