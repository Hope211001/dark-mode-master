import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#6366f1","#f97316","#38bdf8","#fb7185","#a78bfa","#34d399","#fbbf24","#f472b6","#22d3ee","#818cf8","#fb923c","#4ade80","#c084fc","#2dd4bf","#e879f9"];

interface VilleStat { ville: string; count: number }
interface Props { data: VilleStat[]; loading: boolean }

export function StatsByVille({ data, loading }: Props) {
  const total = data.reduce((s, v) => s + v.count, 0);
  const top15 = data.slice(0, 15);

  const VilleTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    const pct = total > 0 ? ((d.count / total) * 100).toFixed(1) : "0";
    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-2xl">
        <p className="text-sm font-bold text-foreground">{d.ville}</p>
        <p className="text-xs text-muted-foreground mt-1"><span className="font-bold text-foreground">{d.count}</span> leads ({pct}%)</p>
      </div>
    );
  };

  return (
    <>
      <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg font-semibold">Leads par ville</CardTitle><p className="text-sm text-muted-foreground mt-1">Top 15 des villes avec le plus de leads</p></div>
            <div className="text-right"><p className="text-2xl font-black text-foreground">{loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : data.length}</p><p className="text-[10px] text-muted-foreground uppercase font-bold">villes</p></div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="h-[500px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : top15.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Aucune donnée disponible.</div>
          ) : (
            <ResponsiveContainer width="100%" height={top15.length * 44 + 30}>
              <BarChart data={top15} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="ville" width={120} tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<VilleTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>{top15.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {!loading && data.length > 0 && (
        <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50"><CardTitle className="text-lg font-semibold">Détail par ville</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-muted/80 backdrop-blur-sm">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">#</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Ville</th>
                    <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Leads</th>
                    <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">%</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 w-[200px]">Répartition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((v, i) => { const pct = total > 0 ? (v.count / total) * 100 : 0; return (
                    <tr key={v.ville} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-2.5 text-xs text-muted-foreground font-mono">{i + 1}</td>
                      <td className="px-6 py-2.5 text-sm font-medium text-foreground">{v.ville}</td>
                      <td className="px-6 py-2.5 text-sm font-mono font-bold text-right text-foreground">{v.count}</td>
                      <td className="px-6 py-2.5 text-sm font-mono text-right text-muted-foreground">{pct.toFixed(1)}%</td>
                      <td className="px-6 py-2.5"><div className="h-2 rounded-full bg-muted/50 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} /></div></td>
                    </tr>); })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
