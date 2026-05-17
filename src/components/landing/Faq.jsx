import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const ITEMS = [
  {
    q: "Comment vous contactez les propriétaires concrètement ?",
    a: "Une fois votre zone sécurisée et vos critères paramétrés, le système surveille en continu les nouvelles annonces sur Leboncoin et contacte les propriétaires correspondants. La relance est automatique en cas de non-réponse, pour maximiser le taux de retour.",
  },
  {
    q: "Une zone, c'est quoi exactement ?",
    a: "Un département, une ville, un arrondissement (Paris, Lyon, Marseille) ou un secteur défini. Le périmètre dépend de la densité du marché. On le valide ensemble avant l'activation.",
  },
  {
    q: "Je peux acheter plusieurs zones ?",
    a: "Oui. Une entité (une société, un opérateur) peut sécuriser autant de zones qu'elle souhaite couvrir. Chaque zone fonctionne avec sa propre licence et ses propres campagnes.",
  },
  {
    q: "Que se passe-t-il quand un propriétaire répond ?",
    a: "Vous recevez une notification immédiate dans votre tableau de bord. Vous reprenez la conversation pour la mener vers le rendez-vous et la signature. En licence Autonome, c'est vous qui gérez. En licence Assistée (à venir), notre cellule s'occupe de la qualification et cale un rendez-vous dans votre agenda.",
  },
  {
    q: "Pourquoi premier arrivé, premier servi ?",
    a: "Parce qu'une zone n'est attribuée qu'à un seul opérateur du réseau. Tant qu'elle est libre, vous pouvez la sécuriser. Une fois qu'un autre opérateur s'est positionné, elle est verrouillée — et vous devrez choisir une zone proche.",
  },
  {
    q: "Combien de temps avant de signer mon premier bien ?",
    a: "Les premiers résultats apparaissent dans les heures qui suivent le lancement de la campagne — propriétaires contactés, premières réponses entrantes. Le rythme de signature dépend ensuite de la densité de votre zone, de vos critères et de votre rythme de closing. La logique : 1 bien signé suffit à rentabiliser la licence — tout ce qui vient ensuite est de la marge.",
  },
  {
    q: "Quel est le lien avec Goodtime ?",
    a: "MÉRIDIEN a d'abord été développé pour soutenir la croissance territoriale des opérateurs Goodtime. C'est aujourd'hui un produit avec sa propre identité, ouvert progressivement à l'ensemble du marché — avec des conditions préférentielles pour les membres Goodtime.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative py-20 md:py-28 bg-cream" data-testid="faq-section">
      <div className="max-w-[900px] mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="pill mx-auto"><span className="pill-dot" />Vos questions</div>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] leading-[1.1] tracking-tight font-extrabold mt-5">
            Les réponses, sans détour.
          </h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className={`card-soft overflow-hidden ${isOpen ? "border-clay/40" : ""}`} data-testid={`faq-${i}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                >
                  <span className="font-bold text-ink text-base md:text-[1.05rem]">{it.q}</span>
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-clay text-white" : "bg-cream-2 text-ink"}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 text-body leading-relaxed">{it.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
