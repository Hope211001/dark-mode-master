import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchZones, createReservation } from "@/lib/landing-api";
import { toast } from "sonner";
import { X, Search, Check, ArrowRight, ArrowLeft } from "lucide-react";

const PROFILES = [
  "Conciergerie",
  "Opérateur LCD / sous-location",
  "Investisseur / property manager",
  "Je démarre une activité",
  "Autre",
];

const PORTFOLIO = [
  "Aucun bien pour le moment",
  "1 — 5 biens",
  "6 — 15 biens",
  "16 — 40 biens",
  "Plus de 40 biens",
];

const STATUS_LABEL = {
  available: "Libre",
  limited: "Bientôt prise",
  reserved: "Réservée",
  closed: "Complète",
};

export default function Reservation({ open, onClose, prefilledZone }) {
  const [step, setStep] = useState(1);
  const [zones, setZones] = useState([]);
  const [arr, setArr] = useState({});
  const [filter, setFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    zone_code: "", zone_name: "",
    full_name: "", email: "", phone: "", company: "",
    profile: PROFILES[0], portfolio_size: PORTFOLIO[1],
    message: "", goodtime_member: false,
  });

  useEffect(() => {
    if (!open) return;
    fetchZones().then((all) => {
      const depts = all.filter((z) => z.kind === "departement");
      const arrs = all.filter((z) => z.kind === "arrondissement");
      const am = {};
      arrs.forEach((a) => { (am[a.parent_code] ||= []).push(a); });
      setZones(depts);
      setArr(am);
    });
  }, [open]);

  useEffect(() => {
    if (prefilledZone) {
      setForm((f) => ({ ...f, zone_code: prefilledZone.code, zone_name: prefilledZone.name }));
      setStep(2);
    }
  }, [prefilledZone]);

  if (!open) return null;

  const filtered = zones.filter((z) => !filter || z.name.toLowerCase().includes(filter.toLowerCase()) || z.code.includes(filter));

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.zone_code) return toast.error("Sélectionnez une zone");
    if (!form.full_name || !form.email || !form.phone) return toast.error("Coordonnées incomplètes");
    setSubmitting(true);
    try {
      await createReservation(form);
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Erreur lors de l'envoi");
    } finally { setSubmitting(false); }
  };

  const close = () => {
    setSubmitted(false); setStep(1);
    setForm({
      zone_code: "", zone_name: "", full_name: "", email: "", phone: "",
      company: "", profile: PROFILES[0], portfolio_size: PORTFOLIO[1],
      message: "", goodtime_member: false,
    });
    onClose();
  };

  const dot = (s) => ({ available: "bg-status-available", limited: "bg-status-limited", reserved: "bg-status-reserved", closed: "bg-status-closed" }[s] || "bg-mute");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-ink/55 backdrop-blur-md flex items-stretch md:items-center justify-center md:p-6 overflow-y-auto"
      data-testid="reservation-overlay"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative bg-paper w-full max-w-2xl my-auto md:my-8 max-h-[100vh] md:max-h-[92vh] overflow-y-auto rounded-none md:rounded-3xl shadow-xl border border-line"
        data-testid="reservation-modal"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-8 py-4 bg-paper border-b border-line">
          <div>
            <div className="text-mute text-xs font-mono uppercase tracking-wider">
              {submitted ? "Confirmé" : `Étape ${step} sur 2`}
            </div>
            <div className="text-ink font-bold text-lg md:text-xl mt-0.5">
              {submitted ? "Demande envoyée" : step === 1 ? "Choisissez votre zone" : "Vos coordonnées"}
            </div>
          </div>
          <button onClick={close} className="text-mute hover:text-ink p-2" data-testid="reservation-close" aria-label="fermer">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-7 md:p-10">
            <div className="w-14 h-14 rounded-full bg-clay-soft flex items-center justify-center text-clay-dark">
              <Check size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-ink mt-5">
              Merci. Votre zone <span className="text-clay">{form.zone_name}</span> est en pré-réservation.
            </h3>
            <p className="text-body mt-4 leading-relaxed">
              Notre équipe vous contacte sous 48 h ouvrées pour valider la disponibilité
              finale de la zone et vérifier que ça matche bien.
              D'ici là, on garde la zone pour vous.
            </p>
            <div className="mt-6 p-4 bg-cream-2 rounded-2xl text-body text-sm">
              On vous écrit à <b className="text-ink">{form.email}</b>. Pensez à vérifier vos spams si rien n'arrive.
            </div>
            <button onClick={close} className="btn-primary w-full mt-7" data-testid="reservation-done">
              Parfait, on se parle bientôt
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 md:p-8">
            {step === 1 && (
              <div data-testid="step-1-zone">
                <p className="text-body">
                  Tapez le nom ou le numéro de votre département. Pour Paris, Lyon
                  et Marseille, vous pourrez ensuite affiner par arrondissement.
                </p>
                <div className="relative mt-5">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
                  <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Ex : Paris, 75, Bouches-du-Rhône, 13…"
                    className="w-full bg-cream-2 border border-line rounded-2xl pl-11 pr-4 py-3.5 text-ink placeholder-mute focus:outline-none focus:border-clay focus:bg-paper transition"
                    data-testid="zone-search"
                  />
                </div>

                <div className="mt-4 max-h-[44vh] overflow-y-auto rounded-2xl border border-line bg-cream-2/50">
                  {filtered.map((z) => {
                    const hasArr = arr[z.code];
                    const isSel = form.zone_code === z.code || (hasArr && (form.zone_code || "").startsWith(z.code + "-"));
                    const disabled = z.status === "closed";
                    return (
                      <div key={z.code} className="border-b border-line last:border-0">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => setForm((f) => ({ ...f, zone_code: z.code, zone_name: z.name }))}
                          className={`w-full text-left px-4 py-3.5 flex items-center justify-between gap-4 transition ${
                            disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-paper"
                          } ${isSel ? "bg-paper" : ""}`}
                          data-testid={`zone-row-${z.code}`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="font-mono text-mute text-xs w-8 shrink-0">{z.code}</div>
                            <div className="font-bold text-ink truncate">{z.name}</div>
                            {hasArr && <span className="text-mute text-xs hidden sm:inline">+ arrondissements</span>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${dot(z.status)}`} />
                            <span className="text-xs text-body font-semibold">{STATUS_LABEL[z.status]}</span>
                          </div>
                        </button>

                        {isSel && hasArr && (
                          <div className="bg-paper border-t border-line px-4 py-4">
                            <div className="text-mute text-xs mb-3 font-medium">Affiner par arrondissement (optionnel)</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {arr[z.code].map((a) => (
                                <button
                                  key={a.code}
                                  type="button"
                                  disabled={a.status === "closed"}
                                  onClick={() => setForm((f) => ({ ...f, zone_code: a.code, zone_name: a.name }))}
                                  className={`px-3 py-2.5 text-left rounded-xl border transition text-xs ${
                                    form.zone_code === a.code
                                      ? "border-clay bg-clay-bg text-ink"
                                      : "border-line text-body hover:border-clay/50"
                                  } ${a.status === "closed" ? "opacity-30 cursor-not-allowed" : ""}`}
                                  data-testid={`arr-row-${a.code}`}
                                >
                                  <div className="font-bold">{a.name}</div>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${dot(a.status)}`} />
                                    <span className="text-[10px] text-mute">{STATUS_LABEL[a.status]}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="px-5 py-8 text-center text-mute text-sm">
                      Aucune zone trouvée. Essayez un autre nom.
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="text-mute text-sm min-w-0">
                    {form.zone_code ? (
                      <>Sélection : <b className="text-ink">{form.zone_name}</b> <span className="font-mono text-mute">({form.zone_code})</span></>
                    ) : "Aucune zone sélectionnée"}
                  </div>
                  <button
                    type="button"
                    disabled={!form.zone_code}
                    onClick={() => setStep(2)}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    data-testid="step-1-next"
                  >
                    Continuer
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div data-testid="step-2-form">
                <div className="mb-6 p-4 bg-cream-2 rounded-2xl flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-mute text-xs font-medium">Zone demandée</div>
                    <div className="font-bold text-ink mt-0.5 truncate">{form.zone_name}</div>
                    <div className="font-mono text-mute text-xs">Code {form.zone_code}</div>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost text-sm" data-testid="step-2-back">
                    <ArrowLeft size={16} /> Modifier
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Votre nom" required>
                    <input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className="m-input" data-testid="form-fullname" />
                  </Field>
                  <Field label="Société (optionnel)">
                    <input value={form.company} onChange={(e) => update("company", e.target.value)} className="m-input" data-testid="form-company" />
                  </Field>
                  <Field label="Email" required>
                    <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="m-input" data-testid="form-email" />
                  </Field>
                  <Field label="Téléphone" required>
                    <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className="m-input" data-testid="form-phone" />
                  </Field>
                  <Field label="Votre profil">
                    <select value={form.profile} onChange={(e) => update("profile", e.target.value)} className="m-input" data-testid="form-profile">
                      {PROFILES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Volume de biens actuel">
                    <select value={form.portfolio_size} onChange={(e) => update("portfolio_size", e.target.value)} className="m-input" data-testid="form-portfolio">
                      {PORTFOLIO.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Un mot sur ce que vous voulez faire (optionnel)" className="mt-4">
                  <textarea rows="3" value={form.message} onChange={(e) => update("message", e.target.value)} className="m-input resize-none" placeholder="Ex : je gère déjà 8 biens à Bordeaux, je veux densifier sur Mérignac." data-testid="form-message" />
                </Field>

                <label className="flex items-start gap-3 mt-5 cursor-pointer text-body text-sm" data-testid="form-goodtime-label">
                  <input type="checkbox" checked={form.goodtime_member} onChange={(e) => update("goodtime_member", e.target.checked)} className="mt-1 w-4 h-4 accent-[#D45F2A]" data-testid="form-goodtime" />
                  <span>Je suis membre de l'écosystème <b>Goodtime</b> <span className="text-mute">— pour activer les conditions préférentielles</span></span>
                </label>

                <div className="mt-7 flex flex-col-reverse md:flex-row md:items-center justify-between gap-3">
                  <div className="text-mute text-xs leading-relaxed max-w-md">
                    En envoyant, vous acceptez d'être recontacté par notre équipe pour valider votre zone.
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50" data-testid="form-submit">
                    {submitting ? "Envoi…" : "Envoyer ma demande"}
                    {!submitting && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </motion.div>

      <style>{`
        .m-input {
          width: 100%;
          background: var(--m-cream);
          border: 1px solid var(--m-line);
          color: var(--m-ink);
          padding: 0.75rem 0.95rem;
          border-radius: 14px;
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 200ms, background 200ms;
        }
        .m-input:focus { outline: none; border-color: var(--m-clay); background: #fff; }
        .m-input::placeholder { color: var(--m-mute); }
      `}</style>
    </motion.div>
  );
}

function Field({ label, required, className = "", children }) {
  return (
    <div className={className}>
      <label className="block text-ink text-sm font-semibold mb-1.5">
        {label}{required && <span className="text-clay ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
