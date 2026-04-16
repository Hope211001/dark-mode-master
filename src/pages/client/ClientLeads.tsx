import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { LeadCard } from "@/components/client/LeadCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Phone, Grid3X3, List, Download, Loader2, RefreshCw, ArrowUpDown, MapPin, Tag } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { leadsService, Lead, LeadsFilters } from "@/services/leads.service";
import { zoneService, Zone } from "@/services/zones.services";
import ErrorAlert from "@/components/alert/error";
import SuccessAlert from "@/components/alert/success";

const statusFilters = [
  { value: "all", label: "Tous les statuts" },
  { value: "new", label: "Nouveaux" },
  { value: "contacted", label: "Contactés" },
];

const phoneFilters = [
  { value: "all", label: "Tous les leads" },
  { value: "with_phone", label: "Avec téléphone" },
  { value: "without_phone", label: "Sans téléphone" },
];

const categorieFilters = [
  { value: "all", label: "Toutes les catégories" },
  { value: "leboncoin", label: "Leboncoin" },
  { value: "pap.fr", label: "PAP.fr" },
  { value: "seloger", label: "SeLoger" },
];

const sortOptions = [
  { value: "desc", label: "Plus récents d'abord" },
  { value: "asc", label: "Plus anciens d'abord" },
];

const DEBOUNCE_MS = 400;

const ClientLeads = () => {
  const [searchParams] = useSearchParams();
  const zoneFromUrl = searchParams.get("zone") || "all";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [phoneFilter, setPhoneFilter] = useState("all");
  const [categorieFilter, setCategorieFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState(zoneFromUrl);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [myZones, setMyZones] = useState<Zone[]>([]);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ visible: false, message: "" });

  // Charger les zones pour connaître auto_contact_enabled + liste des zones
  useEffect(() => {
    zoneService.getMyZones().then(setMyZones).catch(() => {});
  }, []);

  // Debounce la recherche texte
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Retour à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, phoneFilter, zoneFilter, sortOrder, categorieFilter]);

  useEffect(() => {
    fetchLeads();
  }, [currentPage, debouncedSearch, statusFilter, phoneFilter, zoneFilter, sortOrder, categorieFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const filters: LeadsFilters = {
        page: currentPage,
        limit: 12,
        search: debouncedSearch || undefined,
        statut: statusFilter,
        phone: phoneFilter,
        sort: sortOrder,
        zone_id: zoneFilter,
        categorie: categorieFilter,
        exclude_statut: 'rejected,unreachable',
      };
      const res = await leadsService.getMyLeads(filters);
      setLeads(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch (error) {
      setErrorAlert({ visible: true, message: "Impossible de charger vos leads" });
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads;

  const handleExport = async () => {
    try {
      setExporting(true);
      await leadsService.exportCSV({
        search: debouncedSearch || undefined,
        statut: statusFilter,
        phone: phoneFilter,
        sort: sortOrder,
        zone_id: zoneFilter,
        categorie: categorieFilter,
        exclude_statut: 'rejected,unreachable',
      });
      setSuccessAlert({ visible: true, message: "Export CSV téléchargé !" });
    } catch {
      setErrorAlert({ visible: true, message: "Erreur lors de l'export." });
    } finally {
      setExporting(false);
    }
  };

  const showAlert = (type: "success" | "error", message: string) => {
    if (type === "success") setSuccessAlert({ visible: true, message });
    else setErrorAlert({ visible: true, message });
  };

  return (
    <div className="min-h-screen bg-background">
      <ErrorAlert
        message={errorAlert.message}
        visible={errorAlert.visible}
        onClose={() => setErrorAlert({ visible: false, message: "" })}
      />
      <SuccessAlert
        message={successAlert.message}
        visible={successAlert.visible}
        onClose={() => setSuccessAlert({ visible: false, message: "" })}
      />
      <ClientSidebar />

      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader
          title="Mes Leads"
          subtitle="Gérez et suivez tous vos leads immobiliers issus de n8n"
        />

        <div className="p-6 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une ville, un titre..."
                className="pl-10 bg-secondary/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-secondary/30">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-48 bg-secondary/30">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                {myZones.map((z) => (
                  <SelectItem key={z.id} value={z.id}>{z.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={phoneFilter} onValueChange={setPhoneFilter}>
              <SelectTrigger className="w-48 bg-secondary/30">
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
              <SelectTrigger className="w-52 bg-secondary/30">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categorieFilter} onValueChange={setCategorieFilter}>
              <SelectTrigger className="w-60 bg-secondary/30">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categorieFilters.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8 w-10 p-0">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8 w-10 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Exporter
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearch("");
                setStatusFilter("all");
                setZoneFilter("all");
                setPhoneFilter("all");
                setCategorieFilter("all");
                setSortOrder("desc");
                setCurrentPage(1);
              }}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>

          </div>

          {/* Stats Summary */}
          {!loading && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                <span className="text-foreground font-bold">{totalCount}</span> leads au total
              </span>
              <Badge className="bg-primary/10 text-primary border-none">
                Page {currentPage} / {totalPages}
              </Badge>
            </div>
          )}

          {/* Leads Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Chargement de vos opportunités n8n...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground">Aucun lead trouvé.</p>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={fetchLeads}
                  onAlert={showAlert}
                />
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
        </div>
      </main>

      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
};

export default ClientLeads;