import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, CalendarClock } from "lucide-react";
import { fetchStats } from "@/lib/landing-api";
import MapFrance from "./MapFrance";

export default function Hero({ onReserve, onBook }) {
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchStats().then(setStats).catch(() => {}); }, []);

  return (
    <section
      id="hero"
      className="relative pt-28 md:pt-32 pb-16 md:pb-20 overflow-hidden"
      data-testid="hero-section"
    >
      <div className="relative max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT — clear copy */}
          <div className="lg:col-span-6 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pill"
              data-testid="hero-badge"
            >
              <span className="pill-dot" />
              <span>Premier arrivé, premier servi</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] tracking-tight font-extrabold text-ink mt-6"
            >
              Sécurisez votre zone.<br />
              On vous envoie les <span className="text-clay">propriétaires</span> à sous-louer.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-body text-lg md:text-xl mt-6 max-w-xl leading-relaxed"
            >
              Vous choisissez votre territoire — département, ville ou arrondissement.
              Vous paramétrez vos critères. Le système contacte les propriétaires
              tous les jours sur les principales plateformes. Vous recevez les réponses,
              vous closez.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-7 space-y-2.5"
              data-testid="hero-bullets"
            >
              {[
                "Vous êtes le seul opérateur du réseau sur votre zone.",
                "Vos campagnes tournent en continu — vous arrivez le premier sur les nouvelles annonces.",
                "1 bien signé rentabilise votre abonnement. La zone continue de tourner ensuite.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-body">
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-clay-soft flex items-center justify-center">
                    <Check size={12} className="text-clay-dark" strokeWidth={3} />
                  </span>
                  <span className="leading-snug">{b}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <button onClick={onReserve} className="btn-primary" data-testid="hero-cta-primary">
                Sécuriser ma zone
                <ArrowRight size={18} />
              </button>
              <button onClick={onBook} className="btn-secondary" data-testid="hero-cta-book">
                <CalendarClock size={16} />
                Prendre rendez-vous
              </button>
            </motion.div>

            {stats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-7 flex items-center gap-3 text-mute text-sm"
                data-testid="hero-trust"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-clay blink" />
                <span>
                  {stats.closed_this_week} zones sécurisées cette semaine ·
                  Réponse de l'équipe sous 48 h
                </span>
              </motion.div>
            )}
          </div>

          {/* RIGHT — interactive map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative h-[460px] md:h-[600px] rounded-[28px] bg-paper border border-line p-2 shadow-[0_18px_50px_-30px_rgba(15,14,12,0.18)]">
              <div className="absolute -top-3 -right-3 z-30 hidden md:flex">
                <div className="bg-ink text-white rounded-full px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5"
                  style={{ backgroundColor: "#0F0E0C" }}>
                  <MapPin size={12} className="text-clay" />
                  Cliquez sur votre zone
                </div>
              </div>
              <div className="w-full h-full bg-cream-2 rounded-[22px] overflow-hidden relative">
                <MapFrance onSelectZone={onReserve} />
              </div>
            </div>

            {/* mini stats below map */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <Stat value={stats?.available ?? "—"} label="zones libres" tone="green" />
              <Stat value={stats?.limited ?? "—"} label="bientôt prises" tone="amber" />
              <Stat value={(stats?.reserved ?? 0) + (stats?.closed ?? 0)} label="déjà sécurisées" tone="dark" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, tone }) {
  const dot = tone === "green" ? "bg-status-available" : tone === "amber" ? "bg-status-limited" : "bg-ink";
  return (
    <div className="bg-paper border border-line rounded-2xl px-4 py-3.5">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-2xl md:text-3xl font-extrabold text-ink tabular-nums leading-none">{value}</span>
      </div>
      <div className="text-mute text-xs font-medium mt-1.5">{label}</div>
    </div>
  );
}
