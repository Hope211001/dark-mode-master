import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus, MapPin, Trash2, Edit,
  ShoppingBag, Loader2, Search, Globe, ChevronLeft, ChevronRight
} from "lucide-react";
import { zoneService, Zone, CreateZoneDTO } from "@/services/zones.services";
import { stripeService } from "@/services/stripe.service";
import { useToast } from "@/components/ui/use-toast";
import { DataTablePagination } from "@/components/shared/DataTablePagination"

const ZonesManagement = () => {
  const { toast } = useToast();

  // --- ÉTATS DES DONNÉES ---
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS RECHERCHE & PAGINATION ---
  const [searchTerm, setSearchTerm] = useState(""); // Recherche backend
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // --- ÉTATS DES MODALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- ÉTATS DES FORMULAIRES ---
  const [newZone, setNewZone] = useState({
    nom: "", price: 0, lat_center: "", lng_center: "", codes_postaux_raw: ""
  });
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [editFormData, setEditFormData] = useState({
    nom: "", price: 0, lat_center: "", lng_center: "", codes_postaux_raw: ""
  });

  // --- LOGIQUE DE CHARGEMENT (AVEC DEBOUNCE RECHERCHE) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchZones();
    }, 400); // On attend 400ms après la frappe avant d'appeler le backend

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]); // Re-déclenche si la recherche ou la page change

  const fetchZones = async () => {
    try {
      setLoading(true);
      // ICI : Vérifie bien que tu as mis les 3 arguments !
      const response = await zoneService.getAll(currentPage, limit, searchTerm);
      setZones(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les zones depuis le serveur",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset de la page à 1 lors d'une nouvelle recherche
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // --- ACTIONS CRUD ---
  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const codesArray = newZone.codes_postaux_raw.split(",").map(c => c.trim()).filter(c => c !== "");
      const zoneToCreate: CreateZoneDTO = {
        nom: newZone.nom,
        price: newZone.price,
        lat_center: Number(newZone.lat_center),
        lng_center: Number(newZone.lng_center),
        codes_postaux: codesArray
      };
      await zoneService.create(zoneToCreate);
      toast({ title: "Succès", description: "La ville a été ajoutée" });
      setIsModalOpen(false);
      setNewZone({ nom: "", price: 0, lat_center: "", lng_center: "", codes_postaux_raw: "" });
      fetchZones();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la création", variant: "destructive" });
    }
  };

  const openEditModal = (zone: Zone) => {
    setEditingZone(zone);
    setEditFormData({
      nom: zone.nom,
      price: zone.price,
      lat_center: zone.lat_center.toString(),
      lng_center: zone.lng_center.toString(),
      codes_postaux_raw: zone.codes_postaux ? zone.codes_postaux.join(", ") : ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    try {
      const codesArray = editFormData.codes_postaux_raw.split(",").map(c => c.trim()).filter(c => c !== "");
      const payload = {
        nom: editFormData.nom,
        price: editFormData.price,
        lat_center: Number(editFormData.lat_center),
        lng_center: Number(editFormData.lng_center),
        codes_postaux: codesArray
      };
      await zoneService.update(editingZone.id.toString(), payload);
      toast({ title: "Mis à jour", description: "La ville a été modifiée" });
      setIsEditModalOpen(false);
      fetchZones();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la modification", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette zone ?")) return;
    try {
      await zoneService.delete(String(id));
      toast({ title: "Supprimé", description: "Zone supprimée avec succès" });
      fetchZones();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    }
  };

  const handleBuy = async (id: number | string) => {
    try {
      const { url } = await stripeService.buyZone(id.toString());
      if (url) window.location.href = url;
    } catch (error) {
      toast({ title: "Erreur Stripe", description: "Impossible d'initier le paiement", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 transition-[margin] duration-300 overflow-y-auto">
        <Header />

        <div className="p-6 space-y-6">
          {/* HEADER DE LA PAGE */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Zones</h1>
              <p className="text-muted-foreground">Recherchez et administrez les zones de la base de données.</p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg"><Plus className="h-4 w-4" /> Ajouter une Ville</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateZone}>
                  <DialogHeader><DialogTitle>Créer une nouvelle zone</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2"><Label>Nom de la ville</Label><Input required value={newZone.nom} onChange={(e) => setNewZone({ ...newZone, nom: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Latitude (Centre)</Label><Input type="number" step="any" required value={newZone.lat_center} onChange={(e) => setNewZone({ ...newZone, lat_center: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Longitude (Centre)</Label><Input type="number" step="any" required value={newZone.lng_center} onChange={(e) => setNewZone({ ...newZone, lng_center: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label>Prix (€)</Label><Input type="number" required value={newZone.price || ""} onChange={(e) => setNewZone({ ...newZone, price: Number(e.target.value) })} /></div>
                    <div className="space-y-2"><Label>Codes postaux (Ex: 75001, 75002)</Label><Input placeholder="75001, 75002" value={newZone.codes_postaux_raw} onChange={(e) => setNewZone({ ...newZone, codes_postaux_raw: e.target.value })} /></div>
                  </div>
                  <DialogFooter><Button type="submit" className="w-full">Enregistrer en base</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* STATISTIQUES */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard title="Zones dans la page" value={zones.length} icon={MapPin} changeType="neutral" />
            <StatsCard title="Total en Base" value={totalCount} icon={Globe} changeType="neutral" />
            <StatsCard title="Statut Vendu" value={zones.filter(z => z.statut_market === 'VENDU').length} icon={ShoppingBag} changeType="neutral" />
          </div> */}

          {/* TABLEAU ET RECHERCHE */}
          <div className="glass-card rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4 bg-secondary/5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Recherche globale (Nom de ville ou Code Postal)..."
                  className="pl-10 max-w-sm bg-background"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ville</TableHead>
                  <TableHead>Codes Postaux</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : zones.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">Aucune zone trouvée pour "{searchTerm}"</TableCell></TableRow>
                ) : (
                  zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-bold">{zone.nom}</TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {zone.codes_postaux?.join(", ")}
                      </TableCell>
                      <TableCell>{zone.price} €</TableCell>
                      <TableCell>
                        <Badge variant={zone.statut_market === 'VENDU' ? "secondary" : "outline"}>
                          {zone.statut_market || 'LIBRE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {zone.statut_market !== 'VENDU' && <Button size="sm" variant="default" onClick={() => handleBuy(zone.id)}>Acheter</Button>}
                        <Button size="icon" variant="ghost" onClick={() => openEditModal(zone)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(zone.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* BARRE DE PAGINATION */}
            {/* UTILISATION DU COMPOSANT RÉUTILISABLE */}
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={(page) => setCurrentPage(page)}
              loading={loading}
            />

          </div>
        </div>
      </main>

      {/* MODAL DE MODIFICATION */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateZone}>
            <DialogHeader><DialogTitle>Modifier la zone : {editingZone?.nom}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Nom de la ville</Label><Input required value={editFormData.nom} onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Latitude</Label><Input type="number" step="any" value={editFormData.lat_center} onChange={(e) => setEditFormData({ ...editFormData, lat_center: e.target.value })} /></div>
                <div className="space-y-2"><Label>Longitude</Label><Input type="number" step="any" value={editFormData.lng_center} onChange={(e) => setEditFormData({ ...editFormData, lng_center: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Prix (€)</Label><Input type="number" required value={editFormData.price} onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Codes postaux</Label><Input value={editFormData.codes_postaux_raw} onChange={(e) => setEditFormData({ ...editFormData, codes_postaux_raw: e.target.value })} /></div>
            </div>
            <DialogFooter><Button type="submit" className="w-full">Mettre à jour les informations</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZonesManagement;