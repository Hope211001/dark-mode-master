import { motion } from "framer-motion";
import { TrendingUp, Building2, ArrowRight, CalendarClock } from "lucide-react";

export default function Example({ onReserve, onBook }) {
  return (
    <section id="exemple" className="relative py-20 md:py-28 bg-cream" data-testid="example-section">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="pill"><span className="pill-dot" />La logique économique</div>
            <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.1] tracking-tight font-extrabold mt-5">
              <span className="text-clay">1 bien signé</span> et votre licence est rentabilisée.
            </h2>
            <p className="text-body text-lg mt-5 leading-relaxed">
              Pas de promesse de revenus, pas de chiffres bullshit. Juste le calcul que
              fait n'importe quel opérateur : la marge mensuelle d'un seul bien
              correctement intégré couvre largement les 250 — 350 € de la licence.
            </p>
            <p className="text-body text-lg mt-4 leading-relaxed">
              <b className="text-ink">Tout ce qui vient ensuite, c'est de la marge.</b> Et votre zone
              continue à tourner pendant ce temps — les campagnes ne s'arrêtent pas
              parce que vous avez signé.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button onClick={onReserve} className="btn-primary" data-testid="example-cta">
                Voir si ma zone est libre
                <ArrowRight size={18} />
              </button>
              <button onClick={onBook} className="btn-secondary" data-testid="example-book">
                <CalendarClock size={16} />
                Prendre rendez-vous
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="card-soft p-6 md:p-8" data-testid="example-card">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-mute text-xs font-mono uppercase tracking-wider">
                  <TrendingUp size={14} className="text-clay" /> Lecture économique
                </div>
                <div className="text-xs text-mute font-mono">Exemple</div>
              </div>

              <Row left="Licence territoriale" right="≈ 300 € / mois" sub="Tarif type — selon densité de la zone" />
              <Row left="1ᵉʳ bien signé" right="couvre la licence" highlight sub="La marge d'un seul bien intégré suffit" />
              <Row left="Biens suivants" right="produisent la marge" sub="Cumul mensuel net" />
              <Row left="Votre zone" right="continue à tourner" sub="Les campagnes ne s'arrêtent pas après signature" last />

              <div className="mt-6 p-4 bg-clay-bg rounded-2xl border border-[#F4D9C4] flex gap-3">
                <Building2 size={18} className="text-clay-dark mt-0.5 shrink-0" />
                <p className="text-clay-dark text-sm leading-relaxed">
                  <b>L'idée à retenir :</b> votre zone reste active même après que vous
                  ayez signé vos premiers biens. Chaque mois suivant, c'est de la marge
                  pure tant que la licence tourne.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Row({ left, right, sub, highlight, last }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-4 ${last ? "" : "border-b border-line"}`}>
      <div className="min-w-0">
        <div className={`font-bold text-ink ${highlight ? "text-clay" : ""}`}>{left}</div>
        {sub && <div className="text-mute text-sm mt-1">{sub}</div>}
      </div>
      <div className={`shrink-0 font-bold ${highlight ? "text-clay" : "text-ink"}`}>{right}</div>
    </div>
  );
}
