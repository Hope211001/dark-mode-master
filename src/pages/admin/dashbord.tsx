import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, CalendarRange } from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const CATEGORIES = [
  { key: "leboncoin", label: "Leboncoin", color: "#f97316" },
  { key: "pap.fr", label: "PAP.fr", color: "#38bdf8" },
  { key: "seloger", label: "SeLoger", color: "#fb7185" },
];

type View = "daily" | "monthly";

const Dashbord = () => {
  const { toast } = useToast();
  const [daily, setDaily] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("daily");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await leadsService.getStats();
      setDaily(res.daily);
      setMonthly(res.monthly);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les statistiques", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const chartData = view === "daily" ? daily.slice(-30) : monthly;

  const totals = CATEGORIES.map((cat) => {
    const total = monthly.reduce((sum, m) => sum + (m[cat.key] || 0), 0);
    return { ...cat, total };
  });
  const grandTotal = totals.reduce((s, t) => s + t.total, 0);

  const formatXAxis = (val: string) => {
    if (view === "daily") {
      const d = new Date(val);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }
    const [y, m] = val.split("-");
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    const formattedLabel = view === "daily"
      ? new Date(label).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : (() => {
          const [y, m] = label.split("-");
          return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        })();

    const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);

    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-2xl">
        <p className="text-xs font-bold text-foreground mb-2">{formattedLabel}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-6 text-sm py-0.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-muted-foreground">{p.name}</span>
            </div>
            <span className="font-bold text-foreground">{p.value || 0}</span>
          </div>
        ))}
        <div className="border-t border-border mt-2 pt-2 flex justify-between text-sm">
          <span className="text-muted-foreground font-semibold">Total</span>
          <span className="font-black text-foreground">{total}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 transition-[margin] duration-300">
        <Header title="Tableau de bord" subtitle="Vue d'ensemble de votre plateforme" />

        <div className="p-4 md:p-6 space-y-6">

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border bg-card">
              <CardContent className="p-5 text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Total global</p>
                <p className="text-3xl font-black text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /> : grandTotal}
                </p>
                <p className="text-xs text-muted-foreground mt-1">leads détectés</p>
              </CardContent>
            </Card>
            {totals.map((t) => (
              <Card key={t.key} className="border-border bg-card">
                <CardContent className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.label}</p>
                  </div>
                  <p className="text-3xl font-black" style={{ color: t.color }}>
                    {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /> : t.total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {grandTotal > 0 ? Math.round((t.total / grandTotal) * 100) : 0}% du total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Toggle + Chart */}
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {view === "daily" ? "Leads par jour" : "Leads par mois"}
                <span className="text-sm text-muted-foreground font-normal ml-2">
                  {view === "daily" ? "(30 derniers jours)" : "(tout l'historique)"}
                </span>
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={view === "daily" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setView("daily")}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Jour
                </Button>
                <Button
                  variant={view === "monthly" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setView("monthly")}
                >
                  <CalendarRange className="h-3.5 w-3.5" />
                  Mois
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  {view === "daily" ? (
                    <AreaChart data={chartData}>
                      <defs>
                        {CATEGORIES.map((cat) => (
                          <linearGradient key={cat.key} id={`grad-${cat.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={cat.color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={cat.color} stopOpacity={0.02} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: 16 }}
                        formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                      {CATEGORIES.map((cat) => (
                        <Area
                          key={cat.key}
                          type="monotone"
                          dataKey={cat.key}
                          name={cat.label}
                          stroke={cat.color}
                          strokeWidth={2}
                          fill={`url(#grad-${cat.key})`}
                          dot={false}
                          activeDot={{ r: 5, strokeWidth: 2, fill: "hsl(var(--background))" }}
                        />
                      ))}
                    </AreaChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatXAxis}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ paddingTop: 16 }}
                        formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                      {CATEGORIES.map((cat) => (
                        <Bar
                          key={cat.key}
                          dataKey={cat.key}
                          name={cat.label}
                          fill={cat.color}
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Monthly table */}
          {!loading && monthly.length > 0 && (
            <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-lg font-semibold">Détail mensuel</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Mois</th>
                        {CATEGORIES.map((cat) => (
                          <th key={cat.key} className="text-right text-xs font-medium uppercase tracking-wider px-6 py-3" style={{ color: cat.color }}>
                            {cat.label}
                          </th>
                        ))}
                        <th className="text-right text-xs font-medium text-foreground uppercase tracking-wider px-6 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[...monthly].reverse().map((row) => {
                        const [y, m] = row.month.split("-");
                        const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
                        const rowTotal = CATEGORIES.reduce((s, c) => s + (row[c.key] || 0), 0);
                        return (
                          <tr key={row.month} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-3 text-sm font-medium text-foreground capitalize">{label}</td>
                            {CATEGORIES.map((cat) => (
                              <td key={cat.key} className="px-6 py-3 text-sm font-mono text-right" style={{ color: cat.color }}>
                                {row[cat.key] || 0}
                              </td>
                            ))}
                            <td className="px-6 py-3 text-sm font-mono font-bold text-right text-foreground">{rowTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border bg-muted/30">
                        <td className="px-6 py-3 text-sm font-bold text-foreground">Total</td>
                        {totals.map((t) => (
                          <td key={t.key} className="px-6 py-3 text-sm font-mono font-bold text-right" style={{ color: t.color }}>
                            {t.total}
                          </td>
                        ))}
                        <td className="px-6 py-3 text-sm font-mono font-black text-right text-foreground">{grandTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashbord;
