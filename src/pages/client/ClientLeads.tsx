import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Grid3X3, List, Search, Filter } from "lucide-react";
import { leadsService } from "@/services/leads.service";


/* 🔹 Statuts autorisés */
const statusFilters = [
  { value: "all", label: "Tous les statuts" },
  { value: "new", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "responded", label: "Répondu" },
  { value: "negotiating", label: "Négociation" },
  { value: "converted", label: "Converti" },
  { value: "lost", label: "Perdu" },
];

const ClientLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  /* 🔹 Fetch Supabase */
  useEffect(() => {
  leadsService.getAll()
    .then((data) => {
      const normalized = data.map((l) => ({
        ...l,
        status: l.status?.toLowerCase() ?? "unknown",
      }));
      setLeads(normalized);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Erreur chargement leads :", err);
      setLoading(false);
    });
}, []);


  /* 🔹 Filtres */
  const filteredLeads = leads.filter((l) => {
    const matchStatus =
      statusFilter === "all" || l.status === statusFilter;

    const matchSearch =
      !search ||
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.location?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64">
        <Header />

        <div className="p-6 space-y-6">
          {/* 🔍 Filtres */}
          <div className="flex flex-wrap gap-4 p-4 bg-card rounded-xl border">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher (titre, lieu...)"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 🔳 Vue */}
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 📊 Stats */}
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">
              {filteredLeads.length}
            </strong>{" "}
            leads trouvés
          </div>

          {/* 📦 Contenu */}
          {loading ? (
            <p>Chargement...</p>
          ) : filteredLeads.length === 0 ? (
            <p>Aucun lead</p>
          ) : viewMode === "list" ? (
            /* 🧾 LISTE */
            <div className="space-y-2">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex justify-between items-center p-4 border rounded-lg bg-card"
                >
                  <div>
                    <p className="font-semibold mb-3">{lead.titre}</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Ville : {lead.ville}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Date détection :{" "}
                      {new Date(lead.date_detection).toLocaleString("fr-FR")}
                    </p>

                  </div>

                  <div className="text-right">
                    <p className="font-bold">{lead.prix} €</p>
                    <p className="text-xs text-muted-foreground">
                      Statut : {lead.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 🔲 GRID */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 border rounded-xl bg-card space-y-2"
                >
                  <p className="font-semibold">{lead.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.location}
                  </p>
                  <p className="text-sm">
                    {lead.surface} m² • {lead.prix} €
                  </p>
                  <p className="text-xs text-muted-foreground">
                    date detection : {lead.date_detection}
                    Statut : {lead.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientLeads;
