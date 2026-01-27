import { useEffect, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { LeadCard } from "@/components/client/LeadCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, Grid3X3, List, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { leadsService, Lead } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";

const statusFilters = [
  { value: "all", label: "Tous les statuts" },
  { value: "NOUVEAU", label: "Nouveaux" },
  { value: "CONTACTE", label: "Contactés" },
  { value: "REPONDU", label: "Répondus" },
  { value: "NEGOCIATION", label: "En négociation" },
];

const ClientLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, [currentPage]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadsService.getMyLeads(currentPage, 12);
      setLeads(res.data);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger vos leads", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Filtrage local (pour la recherche et le statut)
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.ville?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.statut_prospection === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />

      <main className="ml-64">
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

            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8 w-10 p-0">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8 w-10 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Exporter
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
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
            }>
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  id={lead.id}
                  titre={lead.titre}                  // Changé: title -> titre
                  ville={lead.ville}                  // Changé: location -> ville
                  surface={lead.surface}
                  prix={lead.prix}                    // Changé: loyer -> prix
                  score={lead.score}                  // Le composant gère déjà le x10 en interne
                  statut_prospection={lead.statut_prospection} // Changé: status -> statut_prospection
                  date_detection={lead.date_detection} // Changé: createdAt -> date_detection
                  url={lead.url}                      // Ajouté: Indispensable pour le bouton LBC
                  // potentiel_revenu={lead.potentiel_revenu} // Optionnel: Si n8n a déjà calculé le score
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 pt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Précédent
            </Button>
            <span className="text-sm font-medium">Page {currentPage}</span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Suivant <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
};

export default ClientLeads;