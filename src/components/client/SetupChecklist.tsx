import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowRight, Rocket, Cookie, MapPin, Send, Sparkles } from "lucide-react";
import { cookiesService } from "@/services/cookies.service";
import { zoneService } from "@/services/zones.services";

interface ChecklistState {
  cookiesOk: boolean;
  zoneOk: boolean;
  autoContactOk: boolean;
}

export function SetupChecklist() {
  const [state, setState] = useState<ChecklistState | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cookie, zones] = await Promise.all([
          cookiesService.getMyCookie().catch(() => null),
          zoneService.getMyZones().catch(() => []),
        ]);
        if (cancelled) return;
        const cookiesOk = !!cookie && !!cookie.cookies && !!cookie.mail_leboncoin && !!cookie.password_leboncoin;
        const zoneOk = Array.isArray(zones) && zones.length > 0;
        const autoContactOk = Array.isArray(zones) && zones.some((z) => z.auto_contact_enabled === true);
        setState({ cookiesOk, zoneOk, autoContactOk });
      } catch {
        setState({ cookiesOk: false, zoneOk: false, autoContactOk: false });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!state) return null;
  if (state.cookiesOk && state.zoneOk && state.autoContactOk) return null;

  const steps = [
    {
      done: state.cookiesOk,
      icon: Cookie,
      title: "Configurer vos cookies LeBonCoin",
      desc: "Renseignez votre email, mot de passe et cookie de session pour activer l'automatisation.",
      cta: "Configurer les cookies",
      to: "/client/cookies",
    },
    {
      done: state.zoneOk,
      icon: MapPin,
      title: "Créer au moins une zone",
      desc: "Ajoutez les villes que vous souhaitez surveiller pour détecter de nouveaux leads.",
      cta: "Ajouter une zone",
      to: "/client/zones",
    },
    {
      done: state.autoContactOk,
      icon: Send,
      title: "Activer le contact automatique",
      desc: "Dans les paramètres de chaque zone, activez l'option « auto-contact » pour contacter les prospects automatiquement.",
      cta: "Gérer mes zones",
      to: "/client/zones",
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const progress = Math.round((doneCount / steps.length) * 100);

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200">
              <Rocket className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Bienvenue ! Finalisez votre configuration</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {doneCount} / {steps.length} étapes complétées — il vous reste {steps.length - doneCount} étape{steps.length - doneCount > 1 ? "s" : ""} pour démarrer l'automatisation.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-amber-700">
            <div className="w-32 h-2 rounded-full bg-amber-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 mb-4 rounded-xl bg-white/70 border border-amber-200/70 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-700 leading-relaxed">
            Avant de pouvoir détecter et contacter automatiquement des prospects sur <span className="font-semibold text-orange-700">LeBonCoin</span>,
            vous devez configurer votre compte. Renseignez vos <span className="font-semibold">cookies, email et mot de passe LeBonCoin</span> dans les paramètres
            — sans cela, l'envoi de messages ne fonctionnera pas. Ajoutez ensuite vos <span className="font-semibold">villes</span> à surveiller
            et activez l'<span className="font-semibold">auto-contact</span> dans chaque zone pour automatiser entièrement votre prospection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((s) => (
            <div
              key={s.title}
              className={`relative rounded-xl border p-4 transition-all ${
                s.done
                  ? "bg-emerald-50/60 border-emerald-200"
                  : "bg-white border-gray-200 hover:border-amber-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 mt-0.5">
                  {s.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className={`h-3.5 w-3.5 ${s.done ? "text-emerald-600" : "text-amber-600"}`} />
                    <h4 className={`text-sm font-bold ${s.done ? "text-emerald-900 line-through decoration-emerald-400/60" : "text-gray-900"}`}>
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
              {!s.done && (
                <Link
                  to={s.to}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  {s.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
