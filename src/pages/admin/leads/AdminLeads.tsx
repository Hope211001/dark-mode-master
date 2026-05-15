import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Filter, Phone, Loader2, ArrowUpDown, Eye, MapPin, RefreshCw, Tag,
  Maximize, Euro, Calendar as CalendarIcon, TrendingUp, ExternalLink,
} from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { leadsService, Lead, LeadsFilters } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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

const sourceConfig: Record<string, { label: string; className: string; dot: string }> = {
  "leboncoin": { label: "Leboncoin", className: "bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-500/30", dot: "bg-white" },
  "pap.fr":    { label: "PAP.fr",    className: "bg-sky-500 text-white border-sky-600 shadow-sm shadow-sky-500/30",       dot: "bg-white" },
  "seloger":   { label: "SeLoger",   className: "bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-500/30",     dot: "bg-white" },
};

const DEBOUNCE_MS = 400;

// ── Carte lead admin (meme layout que LeadCard, sans actions de contact) ──
function AdminLeadCard({ lead }: { lead: Lead }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isDescOverflow, setIsDescOverflow] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const { id, titre, ville, surface, prix = 0, statut, date_detection, phone, url, score, description, categorie_scraping } = lead;
  const currentStatus = statut || "new";
  const st = statusConfig[currentStatus] || statusConfig.new;
  const source = categorie_scraping ? sourceConfig[categorie_scraping] : null;

  const displayScore = score != null ? (score <= 10 ? score * 10 : score) : null;
  const scoreColor = displayScore != null
    ? displayScore >= 80 ? "text-emerald-700 border-emerald-200 bg-emerald-50"
    : displayScore >= 60 ? "text-amber-700 border-amber-200 bg-amber-50"
    : "text-gray-500 border-gray-200 bg-gray-50"
    : "";

  const formattedDate = date_detection
    ? new Date(date_detection).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const prixM2 = surface > 0 ? Math.round(prix / surface) : 0;
  const descText = description || "";

  useEffect(() => {
    const el = descRef.current;
    if (!el || expanded) return;
    setIsDescOverflow(el.scrollHeight > el.clientHeight + 1);
  }, [descText, expanded]);

  return (
    <Card className="bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Top row: badges + source */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className={cn("border text-[9px] uppercase font-bold", st.className)}>{st.label}</Badge>
              {displayScore != null && (
                <Badge variant="outline" className={cn("font-mono font-bold text-[10px]", scoreColor)}>{displayScore}%</Badge>
              )}
              {source && (
                <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", source.className)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", source.dot)} />
                  {source.label}
                </span>
              )}
            </div>

            {/* Titre */}
            <h3 className="font-bold text-gray-900 leading-snug text-base md:text-lg">{titre}</h3>

            {/* Info pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span title="Localisation" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold">
                <MapPin className="h-3 w-3 text-gray-500" />{ville}
              </span>
              <span title="Surface" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold">
                <Maximize className="h-3 w-3 text-gray-500" />{surface} m&sup2;
              </span>
              <span title="Prix" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                <Euro className="h-3 w-3" />{prix.toLocaleString()} &euro;
              </span>
              {prixM2 > 0 && (
                <span title="Prix par m&sup2;" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold">
                  <TrendingUp className="h-3 w-3 text-gray-500" />{prixM2.toLocaleString()} &euro;/m&sup2;
                </span>
              )}
              {formattedDate && (
                <span title="Detecte le" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                  <CalendarIcon className="h-3 w-3 text-gray-500" />{formattedDate}
                </span>
              )}
              {phone && (
                <span title="Telephone" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                  <Phone className="h-3 w-3" />{phone}
                </span>
              )}
            </div>

            {/* Description */}
            {descText ? (
              <div>
                <p
                  ref={descRef}
                  className={cn("text-sm text-gray-800 leading-relaxed", !expanded && "line-clamp-3")}
                >
                  {descText}
                </p>
                {(isDescOverflow || expanded) && (
                  <button
                    type="button"
                    className="mt-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-semibold"
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? "lire moins" : "lire plus"}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Aucune description</p>
            )}

            {/* Voir l'annonce (bas gauche) */}
            {url && (
              <div className="pt-1">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-emerald-700 border border-gray-300 hover:border-emerald-400 shadow-sm transition-all"
                >
                  Voir sur {source?.label || "l'annonce"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Actions column (right) - admin = Voir detail */}
          <div className="flex flex-col gap-2 w-44 shrink-0">
            <button
              type="button"
              className="group/btn flex items-center gap-2.5 h-12 px-3 rounded-xl bg-white border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              onClick={() => navigate(`/admin/leads/${id}`)}
            >
              <span className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/40">
                <Eye className="h-4 w-4 text-white" />
              </span>
              <span className="flex flex-col items-start min-w-0 leading-tight">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Ouvrir</span>
                <span className="text-sm font-bold text-gray-800 group-hover/btn:text-emerald-700 transition-colors">Voir d&eacute;tail</span>
              </span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const AdminLeads = () => {
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
            <SelectTrigger className="w-[200px]">
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
            <SelectTrigger className="w-[200px]">
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

          <Select value={categorieFilter} onValueChange={setCategorieFilter}>
            <SelectTrigger className="w-[200px]">
              <Tag className="h-4 w-4 mr-2 shrink-0" />
              <SelectValue placeholder="Toutes les sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sources</SelectItem>
              <SelectItem value="leboncoin">LeBonCoin</SelectItem>
              <SelectItem value="pap.fr">PAP.fr</SelectItem>
              <SelectItem value="seloger">SeLoger</SelectItem>
              {categories
                .filter((c) => !["leboncoin", "pap.fr", "seloger"].includes(c))
                .map((c) => (
                  <SelectItem key={c} value={c}>
                    {sourceConfig[c]?.label || c}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={phoneFilter} onValueChange={setPhoneFilter}>
            <SelectTrigger className="w-[200px]">
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
            <SelectTrigger className="w-[200px]">
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

        {/* Stats */}
        {!loading && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="text-foreground font-bold">{totalCount}</span> lead{totalCount > 1 ? "s" : ""} au total
            </span>
            <Badge className="bg-primary/10 text-primary border-none">
              Page {currentPage} / {totalPages}
            </Badge>
          </div>
        )}

        {/* Leads cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement des leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground">Aucun lead trouvé.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <AdminLeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          loading={loading}
          label="lead"
        />
      </main>
    </div>
  );
};

export default AdminLeads;
