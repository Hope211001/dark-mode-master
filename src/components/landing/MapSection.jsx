import { motion } from "framer-motion";
import MapFrance from "./MapFrance";

export default function MapSection({ onZonePick }) {
  return (
    <section id="carte" className="relative py-20 md:py-28 bg-cream" data-testid="map-section">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10"
        >
          <div className="md:col-span-7">
            <div className="pill"><span className="pill-dot" />Carte des zones</div>
            <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.1] tracking-tight font-extrabold mt-5">
              Trouvez votre zone. Vérifiez si elle est encore libre.
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-8">
            <p className="text-body text-base md:text-lg leading-relaxed">
              Cliquez sur un département pour voir son statut. Pour Paris, Lyon
              et Marseille, vous pouvez aussi descendre au niveau des arrondissements.
            </p>
          </div>
        </motion.div>

        <div className="relative h-[560px] md:h-[680px] rounded-[28px] bg-paper border border-line overflow-hidden p-2 shadow-[0_18px_50px_-30px_rgba(15,14,12,0.18)]">
          <div className="w-full h-full bg-cream-2 rounded-[22px] overflow-hidden relative">
            <MapFrance onSelectZone={onZonePick} />
          </div>
        </div>
      </div>
    </section>
  );
}
