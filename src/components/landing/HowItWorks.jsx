import { motion } from "framer-motion";
import { Lock, Sliders, Send, Inbox } from "lucide-react";
import PlatformLogos from "./PlatformLogos";

const STEPS = [
  {
    icon: Lock,
    title: "1. Sécurisez votre zone",
    desc: "Vous choisissez un département, une ville, un arrondissement ou un secteur. Une fois sécurisée, elle est à vous — vous êtes le seul opérateur du réseau dessus.",
    chip: "Premier arrivé, premier servi",
  },
  {
    icon: Sliders,
    title: "2. Paramétrez vos critères",
    desc: "Type de bien (meublé, non meublé), surface minimum, loyer minimum, typologie. Vous définissez exactement les biens que vous voulez voir arriver.",
    chip: "Vous gardez la main sur ce qui rentre",
  },
  {
    icon: Send,
    title: "3. Vos campagnes tournent en continu",
    desc: "Le système surveille les nouvelles annonces sur les principales plateformes immobilières et contacte les propriétaires correspondants — tous les jours, avec relance automatique en cas de non-réponse.",
    chip: "Surveillance 7j/7 · relance auto",
  },
  {
    icon: Inbox,
    title: "4. Vous recevez les réponses, vous closez",
    desc: "Dès qu'un propriétaire répond, vous recevez une notification. Vous reprenez la main sur la conversation et menez le closing.",
    chip: "Notifications en temps réel",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment" className="relative py-20 md:py-28 bg-paper" data-testid="how-section">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="pill"><span className="pill-dot" />Comment ça marche</div>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.1] tracking-tight font-extrabold mt-5">
            Sécurisez votre zone. Paramétrez. Recevez les propriétaires.
          </h2>
          <p className="text-body text-lg mt-4 leading-relaxed">
            Vous n'avez pas à prospecter, pas à scroller des annonces, pas à passer
            vos soirées à appeler des inconnus. Vous arrivez le premier sur les nouvelles
            annonces, et le système enclenche la conversation pour vous.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-soft p-6 md:p-7 flex flex-col"
              data-testid={`step-${i + 1}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-clay-bg flex items-center justify-center text-clay-dark">
                <s.icon size={22} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-ink mt-5 leading-snug">{s.title}</h3>
              <p className="text-body mt-3 leading-relaxed text-sm md:text-base">{s.desc}</p>
              <div className="mt-auto pt-5 flex items-center gap-2 text-mute text-xs font-mono">
                <span className="w-1 h-1 rounded-full bg-clay" /> {s.chip}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platforms strip — vrais logos en grand */}
        <div className="mt-14 rounded-3xl bg-paper border border-line p-8 md:p-10" data-testid="platforms-strip">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-ink font-extrabold text-2xl md:text-3xl tracking-tight">
              Vous êtes le premier sur les nouvelles annonces.
            </div>
            <div className="text-mute text-base mt-2">
              Parce que vos campagnes tournent pendant que les autres dorment.
            </div>
          </div>
          <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            <PlatformLogos size="xl" gap="gap-x-12 gap-y-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
