import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Phone, Loader2, ArrowUpDown, ExternalLink, Clock, MapPin, RefreshCw, Rows3 } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { leadsService, Lead, LeadsFilters } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";

const statusFilters = [
  { value: "all", label: "Tous les statuts" },
  { value: "new", label: "Nouveaux" },
  { value: "contacted", label: "Contactés" },
  { value: "unreachable", label: "Injoignables" },
];

const phoneFilters = [
  { value: "all", label: "Tous" },
  { value: "with_phone", label: "Avec tel" },
  { value: "without_phone", label: "Sans tel" },
];

const sortOptions = [
  { value: "desc", label: "Plus récents" },
  { value: "asc", label: "Plus anciens" },
];

const limitOptions = [
  { value: "10", label: "10 / page" },
  { value: "25", label: "25 / page" },
  { value: "50", label: "50 / page" },
  { value: "100", label: "100 / page" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "Nouveau", className: "bg-blue-500/15 text-blue-500 border-blue-500/20" },
  contacted: { label: "Contacté", className: "bg-amber-500/15 text-amber-500 border-amber-500/20" },
  replied: { label: "Répondu", className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" },
  rejected: { label: "Refusé", className: "bg-red-500/15 text-red-500 border-red-500/20" },
  unreachable: { label: "Injoignable", className: "bg-gray-500/15 text-gray-400 border-gray-500/20" },
};

const DEBOUNCE_MS = 400;

const AdminLeads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [phoneFilter, setPhoneFilter] = useState("all");
  const [villeFilter, setVilleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setLimit] = useState("25");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [villes, setVilles] = useState<string[]>([]);

  // Charger les villes distinctes au montage
  useEffect(() => {
    leadsService.getDistinctVilles().then(setVilles).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, phoneFilter, villeFilter, sortOrder, limit]);

  useEffect(() => {
    fetchLeads();
  }, [currentPage, debouncedSearch, statusFilter, phoneFilter, villeFilter, sortOrder, limit]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const filters: LeadsFilters = {
        page: currentPage,
        limit: parseInt(limit),
        search: debouncedSearch || undefined,
        statut: statusFilter,
        phone: phoneFilter,
        ville: villeFilter,
        sort: sortOrder,
      };
      const res = await leadsService.getAll(filters);
      setLeads(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les leads", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPhoneFilter("all");
    setVilleFilter("all");
    setSortOrder("desc");
    setLimit("25");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 transition-[margin] duration-300 p-4 md:p-6 space-y-6">
        <Header />

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Tous les Leads</h1>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {totalCount} leads
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher ville, titre..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={villeFilter} onValueChange={setVilleFilter}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {villes.map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={phoneFilter} onValueChange={setPhoneFilter}>
            <SelectTrigger className="w-[150px]">
              <Phone className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {phoneFilters.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[170px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="w-[140px]">
              <Rows3 className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleReset}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg border-border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground font-bold">Titre</TableHead>
                <TableHead className="text-muted-foreground font-bold">Ville</TableHead>
                <TableHead className="text-muted-foreground font-bold">Prix</TableHead>
                <TableHead className="text-muted-foreground font-bold">Surface</TableHead>
                <TableHead className="text-muted-foreground font-bold">Score</TableHead>
                <TableHead className="text-muted-foreground font-bold">Statut</TableHead>
                <TableHead className="text-muted-foreground font-bold">Date</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold">Lien</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto text-primary h-8 w-8" />
                    <p className="text-sm text-muted-foreground mt-2">Chargement...</p>
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-20 text-muted-foreground">
                    Aucun lead trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/40 transition-colors border-border">
                    <TableCell>
                      <span className="font-semibold text-foreground line-clamp-1 max-w-[250px]">
                        {lead.titre}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        {lead.ville}
                        {lead.phone && lead.phone.trim() !== "" && (
                          <Phone className="h-3.5 w-3.5 text-emerald-500" title={lead.phone} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-foreground">{lead.prix?.toLocaleString()}€</TableCell>
                    <TableCell className="text-muted-foreground">{lead.surface}m²</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono font-semibold border-primary/20 bg-primary/5 text-primary">
                        {lead.score?.toFixed(1) || "0.0"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={(statusConfig[lead.statut || "new"] || statusConfig.new).className}>
                        {(statusConfig[lead.statut || "new"] || statusConfig.new).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(lead.date_detection)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {lead.url && (
                        <a href={lead.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="bg-muted/30 p-4 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setCurrentPage}
              loading={loading}
              label="lead"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLeads;
