import { motion } from "framer-motion";
import { Play, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="temoignages" className="relative py-20 md:py-28 bg-paper" data-testid="testimonials-section">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="pill mx-auto"><span className="pill-dot" />Ils ont sécurisé leur zone</div>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.1] tracking-tight font-extrabold mt-5">
            5 opérateurs racontent comment ils l'ont rentabilisée.
          </h2>
          <p className="text-body text-base md:text-lg mt-4 leading-relaxed">
            Pas un script marketing. Leur retour brut sur ce qui a marché — et ce qui ne marche pas.
          </p>
        </motion.div>

        {/* Video placeholder — replace src once provided */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 max-w-4xl mx-auto"
          data-testid="testimonials-video-wrapper"
        >
          <div className="relative aspect-video rounded-[28px] overflow-hidden bg-ink border border-line shadow-[0_30px_70px_-30px_rgba(15,14,12,0.4)] group cursor-pointer">
            {/* PLACEHOLDER — to be replaced by real video */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
              style={{ background: "radial-gradient(ellipse at center, #1a1816 0%, #0F0E0C 80%)" }}
              data-testid="video-placeholder"
            >
              <div className="w-20 h-20 rounded-full bg-clay flex items-center justify-center shadow-[0_8px_30px_-8px_rgba(212,95,42,0.6)] group-hover:scale-110 transition-transform">
                <Play size={28} className="text-white ml-1" fill="white" strokeWidth={0} />
              </div>
              <div className="mt-6 text-white font-bold text-lg md:text-xl">
                Témoignages — 5 clients
              </div>
              <div className="mt-2 text-white/55 text-sm">
                Placeholder · Vidéo à intégrer (URL à fournir)
              </div>
              <div className="mt-4 text-white/35 text-xs font-mono">
                Format recommandé : YouTube, Vimeo ou MP4 hébergé · Ratio 16:9
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-mute text-sm">
            <div className="flex items-center gap-2">
              <Quote size={16} className="text-clay" />
              <span>« Une zone sécurisée. Quelques semaines après, le premier bien est signé. »</span>
            </div>
            <div className="font-mono text-xs">5 témoignages · ~3 min</div>
          </div>
        </motion.div>

        {/* Mini text testimonials placeholders (can be replaced or kept) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: "—", role: "Conciergerie · Région à définir", quote: "Citation à insérer une fois la vidéo découpée." },
            { name: "—", role: "Opérateur LCD · Région à définir", quote: "Citation à insérer une fois la vidéo découpée." },
            { name: "—", role: "Investisseur · Région à définir", quote: "Citation à insérer une fois la vidéo découpée." },
          ].map((t, i) => (
            <div key={i} className="card-soft p-6" data-testid={`testimonial-text-${i}`}>
              <Quote size={18} className="text-clay" />
              <p className="text-body text-sm mt-3 leading-relaxed italic">« {t.quote} »</p>
              <div className="mt-5 pt-4 border-t border-line">
                <div className="text-ink font-semibold text-sm">{t.name}</div>
                <div className="text-mute text-xs mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
