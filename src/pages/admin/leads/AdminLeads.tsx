import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Phone, Loader2, ArrowUpDown, Eye, Clock, MapPin, RefreshCw, Tag } from "lucide-react";
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

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "Nouveau", className: "bg-blue-50 text-blue-700 border-blue-200" },
  contacted: { label: "Contacte", className: "bg-amber-50 text-amber-700 border-amber-200" },
  replied: { label: "Repondu", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Refuse", className: "bg-red-50 text-red-700 border-red-200" },
  unreachable: { label: "Injoignable", className: "bg-gray-50 text-gray-600 border-gray-200" },
};

const categorieConfig: Record<string, { label: string; className: string }> = {
  "leboncoin": { label: "Leboncoin", className: "bg-orange-50 text-orange-700 border-orange-200" },
  "pap.fr": { label: "PAP.fr", className: "bg-sky-50 text-sky-700 border-sky-200" },
  "seloger": { label: "SeLoger", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

const defaultCategorieStyle = "bg-violet-50 text-violet-700 border-violet-200";

const DEBOUNCE_MS = 400;

const AdminLeads = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [phoneFilter, setPhoneFilter] = useState("all");
  const [villeFilter, setVilleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [villes, setVilles] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorieFilter, setCategorieFilter] = useState("all");

  // Charger les villes et catégories distinctes au montage
  useEffect(() => {
    leadsService.getDistinctVilles().then(setVilles).catch(() => {});
    leadsService.getDistinctCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, phoneFilter, villeFilter, categorieFilter, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [currentPage, debouncedSearch, statusFilter, phoneFilter, villeFilter, categorieFilter, sortOrder]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const filters: LeadsFilters = {
        page: currentPage,
        limit: 25,
        search: debouncedSearch || undefined,
        statut: statusFilter,
        phone: phoneFilter,
        ville: villeFilter,
        categorie: categorieFilter,
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
    setCategorieFilter("all");
    setSortOrder("desc");
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
        <Header title="Tous les Leads" subtitle="Gestion de tous les leads de la plateforme" />

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
                <TableHead className="text-muted-foreground font-bold">Catégorie</TableHead>
                <TableHead className="text-muted-foreground font-bold">Ville</TableHead>
                <TableHead className="text-muted-foreground font-bold">Prix</TableHead>
                <TableHead className="text-muted-foreground font-bold">Surface</TableHead>
                <TableHead className="text-muted-foreground font-bold">Score</TableHead>
                <TableHead className="text-muted-foreground font-bold">Statut</TableHead>
                <TableHead className="text-muted-foreground font-bold">Date</TableHead>
                <TableHead className="text-right text-muted-foreground font-bold">Détail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto text-primary h-8 w-8" />
                    <p className="text-sm text-muted-foreground mt-2">Chargement...</p>
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-20 text-muted-foreground">
                    Aucun lead trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/40 transition-colors border-border cursor-pointer" onClick={() => navigate(`/admin/leads/${lead.id}`)}>
                    <TableCell>
                      <span className="font-semibold text-foreground line-clamp-1 max-w-[250px]">
                        {lead.titre}
                      </span>
                    </TableCell>
                    <TableCell>
                      {lead.categorie_scraping ? (
                        <Badge variant="outline" className={`text-xs ${categorieConfig[lead.categorie_scraping]?.className || defaultCategorieStyle}`}>
                          {categorieConfig[lead.categorie_scraping]?.label || lead.categorie_scraping}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
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
                      <Badge variant="outline" className="font-mono font-semibold border-emerald-200 bg-emerald-50 text-emerald-700">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/leads/${lead.id}`); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
