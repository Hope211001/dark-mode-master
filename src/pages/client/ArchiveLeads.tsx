import { useEffect, useRef, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, MapPin, Euro, Maximize, Calendar as CalendarIcon,
  Loader2, RefreshCw, ArrowUpDown, TrendingUp,
  Archive, Phone, RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

const sourceConfig: Record<string, { label: string; className: string; dot: string }> = {
  "leboncoin": { label: "Leboncoin", className: "bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-500/30", dot: "bg-white" },
};
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

// ── Card archive (meme layout que LeadCard, accent rouge) ──
function ArchivedLeadCard({ lead, onRestore, onAlert }: {
  lead: Lead;
  onRestore: () => void;
  onAlert: (type: "success" | "error", message: string) => void;
}) {
  const [restoring, setRestoring] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isDescOverflow, setIsDescOverflow] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const { id, titre, ville, surface, prix = 0, date_detection, phone, description, categorie_scraping } = lead;
  const source = categorie_scraping ? sourceConfig[categorie_scraping] : null;

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

  const handleRestore = async () => {
    try {
      setRestoring(true);
      await leadsService.updateStatus(id, 'new');
      onAlert("success", "Lead desarchive avec succes !");
      onRestore();
    } catch {
      onAlert("error", "Erreur lors du desarchivage.");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Card className="bg-white border-l-4 border-l-red-500 border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Top row: archived badge + source */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="border text-[9px] uppercase font-bold bg-red-50 text-red-700 border-red-200 gap-1">
                <Archive className="h-2.5 w-2.5" /> Archive
              </Badge>
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
              <span title="Prix" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 font-bold border border-red-100">
                <Euro className="h-3 w-3" />{prix.toLocaleString()} &euro;
              </span>
              {prixM2 > 0 && (
                <span title="Prix par m&sup2;" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 font-semibold">
                  <TrendingUp className="h-3 w-3 text-gray-500" />{prixM2.toLocaleString()} &euro;/m&sup2;
                </span>
              )}
              {formattedDate && (
                <span title="Date de detection" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                  <CalendarIcon className="h-3 w-3 text-gray-500" />{formattedDate}
                </span>
              )}
              {phone && (
                <span title="Telephone" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 font-bold border border-red-100">
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
                    className="mt-1.5 text-sm text-clay-600 hover:text-clay-700 hover:underline font-semibold"
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? "lire moins" : "lire plus"}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Aucune description</p>
            )}

          </div>

          {/* Actions column (right) - Desarchiver */}
          <div className="flex flex-col gap-2 w-44 shrink-0">
            <Button
              size="sm"
              className="bg-clay-600 hover:bg-clay-700 active:bg-clay-800 text-white font-semibold text-[11px] h-9 rounded-lg shadow-sm shadow-clay-600/30 hover:shadow-clay-600/50 transition-all"
              onClick={handleRestore}
              disabled={restoring}
            >
              {restoring ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5 mr-1.5" />}
              D&eacute;sarchiver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──
const ArchiveLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
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
        statut: 'rejected',
        sort: sortOrder,
        zone_id: zoneFilter,
      };
      const res = await leadsService.getMyLeads(filters);
      setLeads(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch {
      setErrorAlert({ visible: true, message: "Impossible de charger les leads archivés" });
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
          title="Leads Archivés"
          subtitle="Leads rejetés que vous pouvez restaurer à tout moment"
        />

        <div className="p-6 space-y-6">
          {/* Filters Bar */}
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

          {/* Stats */}
          {!loading && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                <span className="text-foreground font-bold">{totalCount}</span> lead{totalCount > 1 ? "s" : ""} archivé{totalCount > 1 ? "s" : ""}
              </span>
              <Badge className="bg-destructive/10 text-destructive border-none">
                Page {currentPage} / {totalPages}
              </Badge>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chargement des leads archivés...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-2xl">
              <Archive className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Aucun lead archivé</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Les leads que vous rejetez apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <ArchivedLeadCard
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
            label="lead archivé"
          />
        </div>
      </main>

      <div className="fixed top-0 right-0 w-96 h-96 bg-destructive/3 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
};

export default ArchiveLeads;
