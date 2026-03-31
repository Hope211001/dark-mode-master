import { Fragment, useEffect, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Receipt,
  Euro,
  BarChart2,
  Package,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { invoicesService, MonthSummary, DaySummary } from "@/services/invoices.service";

function fmt(n: number) {
  return n.toFixed(4);
}

function formatMonth(m: string) {
  if (!m || m === 'Non défini') return m;
  // billing_month format: "2024-03"
  const [year, month] = m.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function formatDay(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUCCEEDED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    FAILED: 'bg-destructive/10 text-destructive border-destructive/30',
    RUNNING: 'bg-primary/10 text-primary border-primary/30',
  };
  return (
    <Badge variant="outline" className={`text-[10px] uppercase font-bold ${map[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status}
    </Badge>
  );
}

// ── Groupe journalier ─────────────────────────────────────────────────────
function DayGroup({ day }: { day: DaySummary }) {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      {/* Ligne résumé du jour */}
      <TableRow
        className="bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <TableCell className="w-10 text-center">
          {open
            ? <ChevronDown className="h-3 w-3 text-muted-foreground mx-auto" />
            : <ChevronRight className="h-3 w-3 text-muted-foreground mx-auto" />}
        </TableCell>
        <TableCell className="pl-8 text-sm font-medium text-muted-foreground">
          {formatDay(day.day)}
        </TableCell>
        <TableCell className="w-32 font-mono text-sm">{fmt(day.total_eur)} €</TableCell>
        <TableCell className="w-32 font-mono text-xs text-muted-foreground">{fmt(day.total_usd)} $</TableCell>
        <TableCell className="w-32">
          <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground border-border">
            {day.run_count} run{day.run_count > 1 ? 's' : ''}
          </Badge>
        </TableCell>
        <TableCell className="w-36 text-xs text-muted-foreground">{day.total_items.toLocaleString()} items</TableCell>
      </TableRow>

      {/* Détail des runs */}
      {open && day.runs.map((run) => (
        <TableRow key={run.run_id} className="bg-background/50 text-xs border-border/40">
          <TableCell className="w-10" />
          <TableCell className="pl-14 font-mono text-muted-foreground">
            <span className="block truncate max-w-[240px]" title={run.workflow_name || run.actor_id}>
              {run.workflow_name || run.actor_id || run.run_id}
            </span>
          </TableCell>
          <TableCell className="w-32 font-mono">{fmt(run.cost_eur)} €</TableCell>
          <TableCell className="w-32 font-mono text-muted-foreground">{fmt(run.cost_usd)} $</TableCell>
          <TableCell className="w-32"><StatusBadge status={run.status} /></TableCell>
          <TableCell className="w-36 text-muted-foreground">
            {run.items_scraped?.toLocaleString() ?? '—'} items
            {run.duration_sec ? ` · ${run.duration_sec}s` : ''}
          </TableCell>
        </TableRow>
      ))}
    </Fragment>
  );
}

// ── Ligne mois expandable ──────────────────────────────────────────────────
function MonthRow({ month }: { month: MonthSummary }) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<DaySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggle = async () => {
    if (days.length > 0) { setOpen(o => !o); return; }
    try {
      setLoading(true);
      setOpen(true);
      const data = await invoicesService.getMonthDetail(month.billing_month);
      setDays(data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger le détail", variant: "destructive" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {/* Ligne résumé du mois */}
      <TableRow
        className="cursor-pointer hover:bg-secondary/30 transition-colors font-medium"
        onClick={toggle}
      >
        <TableCell className="w-10 text-center">
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin text-primary mx-auto" />
            : open
              ? <ChevronDown className="h-4 w-4 text-primary mx-auto" />
              : <ChevronRight className="h-4 w-4 text-muted-foreground mx-auto" />}
        </TableCell>
        <TableCell className="font-semibold capitalize">{formatMonth(month.billing_month)}</TableCell>
        <TableCell className="w-32 font-mono font-bold text-foreground">{fmt(month.total_eur)} €</TableCell>
        <TableCell className="w-32 font-mono text-sm text-muted-foreground">{fmt(month.total_usd)} $</TableCell>
        <TableCell className="w-32">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {month.run_count} run{month.run_count > 1 ? 's' : ''}
          </Badge>
        </TableCell>
        <TableCell className="w-36 text-sm text-muted-foreground">{month.total_items.toLocaleString()} items</TableCell>
      </TableRow>

      {/* Lignes journalières */}
      {open && days.map((day) => (
        <DayGroup key={day.day} day={day} />
      ))}
    </Fragment>
  );
}

// ── Page principale ────────────────────────────────────────────────────────
const ClientInvoices = () => {
  const [months, setMonths] = useState<MonthSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    invoicesService.getMonthly()
      .then(setMonths)
      .catch(() => toast({ title: "Erreur", description: "Impossible de charger les factures", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const totalEur = months.reduce((s, m) => s + m.total_eur, 0);
  const totalRuns = months.reduce((s, m) => s + m.run_count, 0);
  const totalItems = months.reduce((s, m) => s + m.total_items, 0);

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />

      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader
          title="Factures & Coûts"
          subtitle="Historique des coûts Apify par mois, avec détail journalier"
        />

        <div className="p-6 space-y-6">

          {/* ── KPI cards ── */}
          {!loading && months.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Euro className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total cumulé</p>
                    <p className="text-xl font-bold font-mono">{fmt(totalEur)} €</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Runs au total</p>
                    <p className="text-xl font-bold">{totalRuns.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Items scrapés</p>
                    <p className="text-xl font-bold">{totalItems.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Table ── */}
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Chargement des factures...</p>
                </div>
              ) : months.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Receipt className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Aucune facture disponible.</p>
                </div>
              ) : (
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-10" />
                      <TableHead>Mois / Détail</TableHead>
                      <TableHead className="w-32">Coût (€)</TableHead>
                      <TableHead className="w-32">Coût ($)</TableHead>
                      <TableHead className="w-32">Runs</TableHead>
                      <TableHead className="w-36">Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {months.map((m) => (
                      <MonthRow key={m.billing_month} month={m} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default ClientInvoices;
