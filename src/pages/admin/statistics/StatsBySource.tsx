import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const categorieCards = [
  { key: "leboncoin", label: "Leboncoin", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10", dot: "bg-orange-400", barBg: "bg-orange-500" },
];

interface Props {
  counts: { leboncoin: number };
  loading: boolean;
}

export function StatsBySource({ counts, loading }: Props) {
  const total = counts.leboncoin;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Leads par source</h2>
            <p className="text-sm text-muted-foreground">Répartition par plateforme de scraping</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-foreground">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : total}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Total sources</p>
          </div>
        </div>

        {!loading && total > 0 && (
          <div className="h-3 rounded-full overflow-hidden flex bg-muted/50 mb-6">
            {categorieCards.map((c) => {
              const val = counts[c.key as keyof typeof counts];
              const pct = (val / total) * 100;
              if (pct === 0) return null;
              return <div key={c.key} className={`${c.barBg} transition-all duration-1000 first:rounded-l-full last:rounded-r-full`} style={{ width: `${pct}%` }} />;
            })}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {categorieCards.map((c) => {
            const val = counts[c.key as keyof typeof counts];
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return (
              <div key={c.key} className={`relative flex items-center gap-4 p-4 rounded-xl border ${c.border} ${c.bg} transition-all duration-300 hover:scale-[1.02]`}>
                <div className={`h-10 w-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                  <span className={`h-3 w-3 rounded-full ${c.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${c.color}`}>{c.label}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{pct}% du total</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${c.color}`}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : val}
                  </p>
                  <p className="text-[10px] text-muted-foreground">leads</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
