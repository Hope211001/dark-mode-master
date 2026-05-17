import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, CalendarRange, MapPin, MapPinOff } from "lucide-react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

interface Props {
  withPhone: number;
  withoutPhone: number;
  daily: any[];
  monthly: any[];
  loading: boolean;
}

export function StatsPhone({ withPhone, withoutPhone, daily, monthly, loading }: Props) {
  const [view, setView] = useState<"daily" | "monthly">("daily");
  const total = withPhone + withoutPhone;
  const chartData = view === "daily" ? daily.slice(-30) : monthly;

  const formatX = (val: string) => {
    if (view === "daily") { const d = new Date(val); return `${d.getDate()}/${d.getMonth() + 1}`; }
    const [y, m] = val.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${y.slice(2)}`;
  };

  const PhoneTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    const formatted = view === "daily"
      ? new Date(label).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : (() => { const [y, m] = label.split("-"); return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }); })();
    const tot = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-2xl">
        <p className="text-xs font-bold text-foreground mb-2">{formatted}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-6 text-sm py-0.5">
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} /><span className="text-muted-foreground">{p.name}</span></div>
            <span className="font-bold text-foreground">{p.value || 0}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 flex justify-between text-sm"><span className="text-muted-foreground font-semibold">Total</span><span className="font-black text-foreground">{tot}</span></div>
      </div>
    );
  };

  return (
    <>
      {/* Résumé */}
      <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Disponibilité téléphone</h2>
              <p className="text-sm text-muted-foreground">Leads avec et sans numéro de téléphone</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-foreground">{loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : total}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Total leads</p>
            </div>
          </div>
          {!loading && total > 0 && (
            <div className="h-3 rounded-full overflow-hidden flex bg-muted/50 mb-6">
              <div className="bg-clay-500 transition-all duration-1000 rounded-l-full" style={{ width: `${(withPhone / total) * 100}%` }} />
              <div className="bg-slate-500 transition-all duration-1000 rounded-r-full" style={{ width: `${(withoutPhone / total) * 100}%` }} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative flex items-center gap-4 p-5 rounded-xl border border-clay-500/30 bg-clay-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="h-12 w-12 rounded-xl bg-clay-500/15 border border-clay-500/30 flex items-center justify-center shrink-0"><MapPin className="h-5 w-5 text-clay-400" /></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-bold text-clay-400">Avec téléphone</p><p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{total > 0 ? Math.round((withPhone / total) * 100) : 0}% du total</p></div>
              <div className="text-right"><p className="text-3xl font-black text-clay-400">{loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : withPhone}</p><p className="text-[10px] text-muted-foreground">leads</p></div>
            </div>
            <div className="relative flex items-center gap-4 p-5 rounded-xl border border-slate-500/30 bg-slate-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="h-12 w-12 rounded-xl bg-slate-500/15 border border-slate-500/30 flex items-center justify-center shrink-0"><MapPinOff className="h-5 w-5 text-slate-400" /></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-bold text-slate-400">Sans téléphone</p><p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{total > 0 ? Math.round((withoutPhone / total) * 100) : 0}% du total</p></div>
              <div className="text-right"><p className="text-3xl font-black text-slate-400">{loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : withoutPhone}</p><p className="text-[10px] text-muted-foreground">leads</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphique */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {view === "daily" ? "Téléphone par jour" : "Téléphone par mois"}
            <span className="text-sm text-muted-foreground font-normal ml-2">{view === "daily" ? "(30 derniers jours)" : "(tout l'historique)"}</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant={view === "daily" ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => setView("daily")}><CalendarDays className="h-3.5 w-3.5" />Jour</Button>
            <Button variant={view === "monthly" ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => setView("monthly")}><CalendarRange className="h-3.5 w-3.5" />Mois</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="h-[350px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : chartData.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">Aucune donnée disponible.</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              {view === "daily" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="grad-avec-tel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0.02} /></linearGradient>
                    <linearGradient id="grad-sans-tel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#64748b" stopOpacity={0.3} /><stop offset="100%" stopColor="#64748b" stopOpacity={0.02} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tickFormatter={formatX} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<PhoneTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16 }} formatter={(v: string) => <span className="text-xs text-muted-foreground">{v}</span>} />
                  <Area type="monotone" dataKey="avec_tel" name="Avec téléphone" stroke="#10b981" strokeWidth={2} fill="url(#grad-avec-tel)" dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "hsl(var(--background))" }} />
                  <Area type="monotone" dataKey="sans_tel" name="Sans téléphone" stroke="#64748b" strokeWidth={2} fill="url(#grad-sans-tel)" dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "hsl(var(--background))" }} />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tickFormatter={formatX} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<PhoneTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16 }} formatter={(v: string) => <span className="text-xs text-muted-foreground">{v}</span>} />
                  <Bar dataKey="avec_tel" name="Avec téléphone" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={35} />
                  <Bar dataKey="sans_tel" name="Sans téléphone" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={35} />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  );
}
