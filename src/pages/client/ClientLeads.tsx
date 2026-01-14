import { useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { LeadCard } from "@/components/client/LeadCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, Grid3X3, List, Download } from "lucide-react";

const mockLeads = [
  {
    id: "1",
    title: "Appartement T3 Lumineux",
    location: "Lyon 6ème - Foch",
    surface: 75,
    loyer: 1200,
    potentielAirbnb: 2800,
    score: 94,
    status: "new" as const,
    createdAt: "il y a 2h",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Studio Moderne Centre",
    location: "Lyon 2ème - Bellecour",
    surface: 28,
    loyer: 650,
    potentielAirbnb: 1400,
    score: 87,
    status: "contacted" as const,
    createdAt: "il y a 1 jour",
  },
  {
    id: "3",
    title: "T2 Vue Parc",
    location: "Villeurbanne - Gratte-Ciel",
    surface: 45,
    loyer: 850,
    potentielAirbnb: 1650,
    score: 78,
    status: "responded" as const,
    createdAt: "il y a 3 jours",
  },
  {
    id: "4",
    title: "Loft Industriel",
    location: "Lyon 7ème - Jean Macé",
    surface: 95,
    loyer: 1500,
    potentielAirbnb: 3200,
    score: 91,
    status: "negotiating" as const,
    createdAt: "il y a 5 jours",
  },
  {
    id: "5",
    title: "T2 Rénové",
    location: "Lyon 3ème - Part-Dieu",
    surface: 42,
    loyer: 780,
    potentielAirbnb: 1550,
    score: 72,
    status: "new" as const,
    createdAt: "il y a 1 semaine",
  },
  {
    id: "6",
    title: "Appartement Familial",
    location: "Caluire - Centre",
    surface: 110,
    loyer: 1800,
    potentielAirbnb: 3800,
    score: 85,
    status: "contacted" as const,
    createdAt: "il y a 1 semaine",
    isFavorite: true,
  },
];

const statusFilters = [
  { value: "all", label: "Tous les statuts" },
  { value: "new", label: "Nouveaux" },
  { value: "contacted", label: "Contactés" },
  { value: "responded", label: "Répondus" },
  { value: "negotiating", label: "En négociation" },
  { value: "converted", label: "Convertis" },
];

const ClientLeads = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="ml-64">
        <ClientHeader 
          title="Mes Leads" 
          subtitle="Gérez et suivez tous vos leads immobiliers"
        />
        
        <div className="p-6 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par adresse, ville..."
                className="pl-10 bg-secondary/50 border-border"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-secondary/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filters */}
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres avancés
            </Button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Export */}
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">
              <span className="text-foreground font-semibold">{mockLeads.length}</span> leads trouvés
            </span>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              3 nouveaux aujourd'hui
            </Badge>
            <Badge variant="secondary" className="bg-success/20 text-success">
              2 réponses en attente
            </Badge>
          </div>

          {/* Leads Grid */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-4"
          }>
            {mockLeads.map((lead) => (
              <LeadCard key={lead.id} {...lead} />
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" className="px-8">
              Charger plus de leads
            </Button>
          </div>
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ClientLeads;
