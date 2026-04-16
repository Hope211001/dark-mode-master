import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, CalendarRange } from "lucide-react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  daily: any[];
  monthly: any[];
  loading: boolean;
}

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export function StatsGeneral({ daily, monthly, loading }: Props) {
  const [view, setView] = useState<"daily" | "monthly">("daily");
  const data = view === "daily" ? daily.slice(-30) : monthly;

  const formatX = (val: string) => {
    if (view === "daily") { const d = new Date(val); return `${d.getDate()}/${d.getMonth() + 1}`; }
    const [y, m] = val.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${y.slice(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.[0]) return null;
    const formatted = view === "daily"
      ? new Date(label).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : (() => { const [y, m] = label.split("-"); return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }); })();
    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-2xl">
        <p className="text-xs font-bold text-foreground mb-1">{formatted}</p>
        <p className="text-sm text-muted-foreground"><span className="font-bold text-primary">{payload[0].value}</span> leads</p>
      </div>
    );
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          {view === "daily" ? "Leads par jour" : "Leads par mois"}
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
        ) : data.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">Aucune donnée disponible.</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            {view === "daily" ? (
              <AreaChart data={data}>
                <defs><linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tickFormatter={formatX} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" name="Leads" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#grad-total)" dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: "hsl(var(--background))" }} />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tickFormatter={formatX} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Leads" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
