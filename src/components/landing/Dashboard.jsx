import { motion } from "framer-motion";
import { Activity, Inbox, Sliders, Bell, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import PlatformLogos, { PlatformLogo } from "./PlatformLogos";

export default function Dashboard() {
  return (
    <section id="plateforme" className="relative py-20 md:py-28 bg-cream" data-testid="dashboard-section">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10"
        >
          <div className="lg:col-span-7">
            <div className="pill"><span className="pill-dot" />La plateforme</div>
            <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.1] tracking-tight font-extrabold mt-5">
              Vos campagnes tournent.<br />Vous suivez en temps réel.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-body text-base md:text-lg leading-relaxed">
              Une fois votre zone sécurisée, vous paramétrez vos critères, vous lancez vos
              campagnes, et le système contacte les propriétaires pour vous tous les jours.
              Vous recevez une notification dès qu'un propriétaire répond.
            </p>
          </div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[28px] bg-paper border border-line p-3 md:p-4 shadow-[0_30px_70px_-40px_rgba(15,14,12,0.25)]"
          data-testid="dashboard-mockup"
        >
          <div className="rounded-[20px] bg-cream-2/60 p-4 md:p-6 lg:p-8">
            {/* Top bar mockup */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-clay text-white font-bold flex items-center justify-center text-sm">M</div>
                <div>
                  <div className="text-ink font-bold text-sm">Tableau de bord — Bordeaux</div>
                  <div className="text-mute text-xs">Zone sécurisée · 3 campagnes actives</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-paper border border-line rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-available pulse-ring" />
                <span className="text-xs font-mono text-body">Synchronisé · il y a 4 min</span>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Kpi icon={Inbox} label="Propriétaires contactés" value="487" delta="+38 cette semaine" tone="ink" />
              <Kpi icon={Activity} label="Taux de réponse" value="22 %" delta="+3,1 pts vs S-1" tone="green" />
              <Kpi icon={Bell} label="Réponses entrantes" value="14" delta="3 nouveaux aujourd'hui" tone="clay" />
              <Kpi icon={ArrowUpRight} label="Taux d'intérêt" value="61 %" delta="biens correspondants" tone="amber" />
            </div>

            {/* Two column: campaigns + responses */}
            <div className="mt-4 md:mt-5 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
              {/* Campaigns */}
              <div className="lg:col-span-7 bg-paper rounded-2xl border border-line p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-ink font-bold text-sm">
                    <Sliders size={16} className="text-clay" /> Campagnes en cours
                  </div>
                  <span className="text-mute text-xs font-mono">3 actives</span>
                </div>
                <div className="space-y-2.5">
                  <Campaign name="T2 meublés · 600€+" platforms={["leboncoin"]} contacts={184} reply="24 %" status="live" />
                  <Campaign name="T3-T4 non meublés · centre" platforms={["leboncoin"]} contacts={211} reply="19 %" status="live" />
                  <Campaign name="Studios meublés · CHU" platforms={["leboncoin"]} contacts={92} reply="27 %" status="live" />
                </div>
              </div>

              {/* Responses */}
              <div className="lg:col-span-5 bg-paper rounded-2xl border border-line p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-ink font-bold text-sm">
                    <Inbox size={16} className="text-clay" /> Réponses récentes
                  </div>
                  <span className="text-clay font-bold text-xs bg-clay-bg px-2 py-0.5 rounded-full">3 nouveaux</span>
                </div>
                <div className="space-y-3">
                  <Response name="M. Lefèvre" tag="T3 · Caudéran" time="il y a 12 min" hot />
                  <Response name="Mme Bernard" tag="T2 meublé · Chartrons" time="il y a 1 h" hot />
                  <Response name="Famille Dubois" tag="T4 · Pessac" time="il y a 3 h" />
                  <Response name="M. Martin" tag="Studio · Centre" time="hier" />
                </div>
              </div>
            </div>

            {/* Platforms covered footnote */}
            <div className="mt-5 pt-4 border-t border-line flex flex-col md:flex-row md:items-center justify-between gap-3">
              <span className="text-mute text-xs font-mono shrink-0">Plateformes surveillées :</span>
              <PlatformLogos size="md" gap="gap-6" />
            </div>
          </div>
        </motion.div>

        {/* Optional placeholders for additional screenshots */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <ImagePlaceholder
            label="Capture : paramétrage des critères"
            sub="Recommandé : 1200 × 800 px, format PNG"
            testid="placeholder-criteria"
          />
          <ImagePlaceholder
            label="Capture : détail d'une réponse propriétaire"
            sub="Recommandé : 1200 × 800 px, format PNG"
            testid="placeholder-response-detail"
          />
        </div>
      </div>
    </section>
  );
}

function Kpi({ icon: Icon, label, value, delta, tone }) {
  const tint = tone === "green" ? "text-status-available" : tone === "clay" ? "text-clay" : tone === "amber" ? "text-status-limited" : "text-ink";
  const bg = tone === "green" ? "bg-[#DAF2E5]" : tone === "clay" ? "bg-clay-bg" : tone === "amber" ? "bg-[#FCEAD2]" : "bg-cream-2";
  return (
    <div className="bg-paper rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${tint}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-3 text-2xl md:text-[28px] font-extrabold text-ink tabular-nums leading-none">{value}</div>
      <div className="text-mute text-xs mt-1.5">{label}</div>
      <div className="text-status-available text-[11px] font-mono mt-1.5">{delta}</div>
    </div>
  );
}

function Campaign({ name, platforms, contacts, reply, status }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-3 bg-cream-2/60 rounded-xl">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${status === "live" ? "bg-status-available pulse-ring" : "bg-mute"}`} />
          <div className="text-ink font-semibold text-sm truncate">{name}</div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {platforms.map((p) => (
            <PlatformLogo key={p} slug={p} size="sm" />
          ))}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-ink font-bold text-sm tabular-nums">{contacts}</div>
        <div className="text-mute text-[10px] font-mono">contactés</div>
      </div>
      <div className="text-right shrink-0 hidden sm:block">
        <div className="text-status-available font-bold text-sm tabular-nums">{reply}</div>
        <div className="text-mute text-[10px] font-mono">réponses</div>
      </div>
    </div>
  );
}

function Response({ name, tag, time, hot }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-line last:border-0">
      <div className="w-9 h-9 rounded-full bg-cream-2 flex items-center justify-center text-ink font-bold text-xs shrink-0">
        {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-ink font-semibold text-sm truncate">{name}</span>
          {hot && <span className="text-clay text-[10px] font-bold">●</span>}
        </div>
        <div className="text-mute text-xs truncate">{tag}</div>
        <div className="text-mute text-[10px] font-mono mt-0.5">{time}</div>
      </div>
    </div>
  );
}

function ImagePlaceholder({ label, sub, testid }) {
  return (
    <div
      className="relative aspect-[3/2] rounded-2xl border-2 border-dashed border-line bg-cream-2/40 flex flex-col items-center justify-center text-center px-6"
      data-testid={testid}
    >
      <div className="w-12 h-12 rounded-2xl bg-paper border border-line flex items-center justify-center text-mute">
        <ImageIcon size={20} />
      </div>
      <div className="mt-3 text-ink font-semibold text-sm">{label}</div>
      <div className="text-mute text-xs mt-1">{sub}</div>
    </div>
  );
}
