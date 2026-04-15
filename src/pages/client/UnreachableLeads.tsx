import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, MapPin, Euro, Maximize, Calendar, Grid3X3, List,
  Loader2, RefreshCw, ArrowUpDown,
  PhoneOff, Phone, ExternalLink, RotateCcw
} from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { leadsService, Lead, LeadsFilters } from "@/services/leads.service";
import { zoneService, Zone } from "@/services/zones.services";
import ErrorAlert from "@/components/alert/error";
import SuccessAlert from "@/components/alert/success";

const sortOptions = [
  { value: "desc", label: "Plus récents d'abord" },
  { value: "asc", label: "Plus anciens d'abord" },
];

const DEBOUNCE_MS = 400;

function UnreachableLeadCard({ lead, onRestore, onAlert }: {
  lead: Lead;
  onRestore: () => void;
  onAlert: (type: "success" | "error", message: string) => void;
}) {
  const navigate = useNavigate();
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setRestoring(true);
      await leadsService.updateStatus(lead.id, 'new');
      onAlert("success", "Lead restauré avec succès !");
      onRestore();
    } catch {
      onAlert("error", "Erreur lors de la restauration.");
    } finally {
      setRestoring(false);
    }
  };

  const formattedDate = new Date(lead.date_detection).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg group border-border/50 cursor-pointer opacity-80 hover:opacity-100"
      onClick={() => navigate(`/client/showLead/${lead.id}`)}
    >
      <div className="relative h-24 bg-amber-500/5 overflow-hidden flex items-center justify-center">
        <div className="text-amber-500/15 group-hover:scale-110 transition-transform duration-500">
          <PhoneOff size={48} />
        </div>
        <div className="absolute top-3 left-3">
          <Badge className="border text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border-amber-500/30">
            Injoignable
          </Badge>
        </div>
        {lead.phone && (
          <Badge variant="outline" className="absolute top-3 right-3 border-slate-500/40 bg-slate-500/10 text-slate-400 text-[10px] font-bold gap-1">
            <Phone className="h-2.5 w-2.5" />
            {lead.phone}
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="min-h-[40px]">
          <h3 className="font-bold text-foreground leading-tight line-clamp-2 text-sm group-hover:text-amber-400 transition-colors">
            {lead.titre}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{lead.ville}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-y border-border/30 py-2.5">
          <div className="flex items-center gap-1.5 text-xs">
            <Maximize className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground font-semibold">{lead.surface} m²</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Euro className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground font-semibold">{lead.prix?.toLocaleString()} €</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 font-bold text-xs h-9 gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            onClick={handleRestore}
            disabled={restoring}
          >
            {restoring ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
            Restaurer
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={(e) => {
              e.stopPropagation();
              window.open(lead.url, '_blank');
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const UnreachableLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [myZones, setMyZones] = useState<Zone[]>([]);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ visible: false, message: "" });

  useEffect(() => {
    zoneService.getMyZones().then(setMyZones).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, zoneFilter, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [currentPage, debouncedSearch, zoneFilter, sortOrder]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const filters: LeadsFilters = {
        page: currentPage,
        limit: 12,
        search: debouncedSearch || undefined,
        statut: 'unreachable',
        sort: sortOrder,
        zone_id: zoneFilter,
      };
      const res = await leadsService.getMyLeads(filters);
      setLeads(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch {
      setErrorAlert({ visible: true, message: "Impossible de charger les leads injoignables" });
    } finally {
      setLoading(false);
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
          title="Leads Injoignables"
          subtitle="Leads dont le propriétaire n'a pas pu être joint"
        />

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une ville, un titre..."
                className="pl-10 bg-secondary/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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

            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8 w-10 p-0">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8 w-10 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearch("");
                setZoneFilter("all");
                setSortOrder("desc");
                setCurrentPage(1);
              }}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chargement des leads injoignables...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-2xl">
              <PhoneOff className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Aucun lead injoignable</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Les leads marqués injoignables apparaîtront ici</p>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              {leads.map((lead) => (
                <UnreachableLeadCard
                  key={lead.id}
                  lead={lead}
                  onRestore={fetchLeads}
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
            label="lead injoignable"
          />
        </div>
      </main>
    </div>
  );
};

export default UnreachableLeads;
