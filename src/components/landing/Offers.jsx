import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, CalendarClock } from "lucide-react";

export default function Offers({ onReserve, onBook }) {
  return (
    <section id="tarif" className="relative py-20 md:py-28 bg-paper" data-testid="offers-section">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="pill"><span className="pill-dot" />Licences territoriales</div>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.1] tracking-tight font-extrabold mt-5">
            Deux licences. Vous pouvez en sécuriser plusieurs.
          </h2>
          <p className="text-body text-lg mt-4 leading-relaxed">
            Vous démarrez aujourd'hui en Autonome. Bientôt, on ouvrira l'Assistée
            où on prend en main la qualification propriétaire et la prise de rendez-vous
            pour vous.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {/* Autonome */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="relative card-soft p-7 md:p-9 border-2 border-clay/20"
            data-testid="offer-autonome"
          >
            <div className="absolute -top-3 left-7 bg-clay text-white text-xs font-bold px-3 py-1 rounded-full">
              Disponible maintenant
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-ink mt-2">Licence Autonome</h3>
            <p className="text-body mt-3">
              Vos campagnes tournent. Le système contacte et relance automatiquement les
              propriétaires. <b className="text-ink">Vous menez ensuite la conversation et closez.</b>
            </p>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-ink tracking-tight">250</span>
              <span className="text-mute font-semibold">— 350 €</span>
              <span className="text-mute">/ mois HT</span>
            </div>
            <div className="text-mute text-xs mt-1">Selon la densité de votre zone</div>

            <ul className="mt-7 space-y-3">
              {[
                "Zone exclusive — un seul opérateur du réseau dessus",
                "Paramétrage des critères : meublé, surface, loyer, typologie",
                "Campagnes en continu sur leboncoin, SeLoger, PAP, Bien'ici",
                "Relance automatique des propriétaires non répondants",
                "Notification dès qu'un propriétaire répond",
                "Tableau de bord — campagnes, taux de réponse, taux d'intérêt",
                "Possibilité de sécuriser plusieurs zones",
              ].map((l) => (
                <li key={l} className="flex gap-3 text-body">
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-clay-soft flex items-center justify-center">
                    <Check size={12} className="text-clay-dark" strokeWidth={3} />
                  </span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>

            <button onClick={onReserve} className="btn-primary w-full mt-8" data-testid="offer-autonome-cta">
              Sécuriser ma zone
              <ArrowRight size={18} />
            </button>

            <button onClick={onBook} className="w-full mt-3 inline-flex items-center justify-center gap-2 text-mute hover:text-ink text-sm py-2" data-testid="offer-autonome-book">
              <CalendarClock size={14} />
              ou prendre rendez-vous d'abord
            </button>
          </motion.div>

          {/* Assistée */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative p-7 md:p-9 text-white overflow-hidden rounded-[18px]"
            style={{ backgroundColor: "#0F0E0C", border: "1px solid #0F0E0C" }}
            data-testid="offer-assistee"
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(212,95,42,0.32), transparent 65%)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-semibold text-white">
                <Sparkles size={12} className="text-clay" />
                Bientôt — places limitées
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-4">Licence Assistée</h3>
              <p className="text-white/70 mt-3">
                Notre cellule de qualification prend la main : <b className="text-white">propriétaires
                qualifiés et rendez-vous calés directement dans votre agenda.</b> Vous arrivez en closing.
              </p>

              <div className="mt-7 text-white/85">
                <span className="text-2xl font-bold">Sur sélection</span>
                <div className="text-white/55 text-sm mt-1">Tarification annoncée à l'ouverture</div>
              </div>

              <ul className="mt-7 space-y-3">
                {[
                  "Tout ce qui est inclus dans la Licence Autonome",
                  "Qualification approfondie de chaque propriétaire répondant",
                  "Premiers échanges menés par notre équipe",
                  "Pré-closing et calage des objections",
                  "Rendez-vous calés directement dans votre agenda",
                ].map((l) => (
                  <li key={l} className="flex gap-3 text-white/85">
                    <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <Check size={12} className="text-clay" strokeWidth={3} />
                    </span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onReserve}
                className="w-full mt-8 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-ink rounded-full font-semibold hover:bg-cream-2 transition"
                data-testid="offer-assistee-cta"
              >
                Me prévenir à l'ouverture
                <ArrowRight size={18} />
              </button>

              <div className="mt-4 text-white/50 text-xs text-center">
                Premières places ouvertes en priorité aux opérateurs déjà actifs
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goodtime discreet line */}
        <div className="mt-10 text-center" data-testid="goodtime-line">
          <span className="inline-flex items-center gap-2 text-mute text-sm">
            <span className="w-1 h-1 bg-mute rounded-full" />
            Conditions préférentielles pour les membres Goodtime
            <span className="w-1 h-1 bg-mute rounded-full" />
          </span>
        </div>
      </div>
    </section>
  );
}
