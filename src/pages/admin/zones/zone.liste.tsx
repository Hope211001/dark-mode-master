import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, MapPin, Euro, Trash2, Edit, 
  ShoppingBag, Loader2, Search, Globe, ChevronLeft, ChevronRight
} from "lucide-react";
import { zoneService, Zone, CreateZoneDTO } from "@/services/zones.services";
import { stripeService } from "@/services/stripe.service";
import { useToast } from "@/components/ui/use-toast";

const ZonesManagement = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  // --- ÉTATS POUR LA RECHERCHE & PAGINATION ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // --- ÉTATS POUR LA CRÉATION ---
  const [newZone, setNewZone] = useState({ 
    nom: "", 
    price: 0, 
    lat_center: "", 
    lng_center: "", 
    codes_postaux_raw: "" 
  });

  // --- ÉTATS POUR LA MODIFICATION ---
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [editFormData, setEditFormData] = useState({
    nom: "",
    price: 0,
    lat_center: "",
    lng_center: "",
    codes_postaux_raw: ""
  });

  useEffect(() => {
    fetchZones();
  }, [currentPage]); // Re-charge quand la page change

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await zoneService.getAll(currentPage, limit);
      // On s'attend à recevoir { data, totalCount, totalPages }
      setZones(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les zones", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE DE RECHERCHE (FILTRE VISUEL) ---
  const filteredZones = zones.filter((zone) =>
    zone.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (zone.codes_postaux && zone.codes_postaux.join(" ").includes(searchTerm))
  );

  // --- LOGIQUE DE CRÉATION ---
  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const codesArray = newZone.codes_postaux_raw.split(",").map(c => c.trim()).filter(c => c !== "");
      const zoneToCreate: CreateZoneDTO = {
        nom: newZone.nom,
        price: newZone.price,
        lat_center: newZone.lat_center,
        lng_center: newZone.lng_center,
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

  // --- LOGIQUE DE MODIFICATION ---
  const openEditModal = (zone: Zone) => {
    setEditingZone(zone);
    setEditFormData({
      nom: zone.nom,
      price: zone.price,
      lat_center: zone.lat_center || "",
      lng_center: zone.lng_center || "",
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
        lat_center: editFormData.lat_center,
        lng_center: editFormData.lng_center,
        codes_postaux: codesArray
      };
      await zoneService.update(editingZone.id, payload);
      toast({ title: "Mis à jour", description: "La ville a été modifiée" });
      setIsEditModalOpen(false);
      fetchZones();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la modification", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette zone ?")) return;
    try {
      await zoneService.delete(id);
      fetchZones();
      toast({ title: "Supprimé", description: "Zone supprimée" });
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    }
  };

  const handleBuy = async (id: number) => {
    try {
      const { url } = await stripeService.buyZone(id);
      if (url) window.location.href = url;
    } catch (error) {
      toast({ title: "Erreur Stripe", description: "Échec du paiement", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Zones</h1>
              <p className="text-muted-foreground">Administrez les villes et les tarifs (10 par page).</p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg"><Plus className="h-4 w-4" /> Ajouter une Ville</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-card">
                <form onSubmit={handleCreateZone}>
                  <DialogHeader><DialogTitle>Créer une nouvelle zone</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2"><Label>Nom de la ville</Label><Input required value={newZone.nom} onChange={(e) => setNewZone({...newZone, nom: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Latitude (centre)</Label><Input value={newZone.lat_center} onChange={(e) => setNewZone({...newZone, lat_center: e.target.value})} /></div>
                      <div className="space-y-2"><Label>Longtitude (centre)</Label><Input value={newZone.lng_center} onChange={(e) => setNewZone({...newZone, lng_center: e.target.value})} /></div>
                    </div>
                    <div className="space-y-2"><Label>Prix (€)</Label><Input type="number" required value={newZone.price || ""} onChange={(e) => setNewZone({...newZone, price: Number(e.target.value)})} /></div>
                    <div className="space-y-2"><Label>Codes postaux (séparez les codes par une virgule).</Label><Input placeholder="75001, 75002" value={newZone.codes_postaux_raw} onChange={(e) => setNewZone({...newZone, codes_postaux_raw: e.target.value})} /></div>
                  </div>
                  <DialogFooter><Button type="submit" className="w-full">Enregistrer</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[500px] glass-card">
              <form onSubmit={handleUpdateZone}>
                <DialogHeader><DialogTitle>Modifier : {editingZone?.nom}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2"><Label>Nom de la ville</Label><Input required value={editFormData.nom} onChange={(e) => setEditFormData({...editFormData, nom: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Latitude (centre)</Label><Input value={editFormData.lat_center} onChange={(e) => setEditFormData({...editFormData, lat_center: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Longitude (centre)</Label><Input value={editFormData.lng_center} onChange={(e) => setEditFormData({...editFormData, lng_center: e.target.value})} /></div>
                  </div>
                  <div className="space-y-2"><Label>Prix (€)</Label><Input type="number" required value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: Number(e.target.value)})} /></div>
                  <div className="space-y-2"><Label>Codes postaux (séparez les codes par une virgule).</Label><Input value={editFormData.codes_postaux_raw} onChange={(e) => setEditFormData({...editFormData, codes_postaux_raw: e.target.value})} /></div>
                </div>
                <DialogFooter><Button type="submit" className="w-full">Mettre à jour</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard title="Villes chargées" value={zones.length} icon={MapPin} changeType="positive" />
            <StatsCard title="Total Base" value={totalCount} icon={Globe} changeType="neutral" />
            <StatsCard title="Villes Vendues" value={zones.filter(z => z.statut_market === 'VENDU').length} icon={ShoppingBag} changeType="neutral" />
          </div>

          <div className="glass-card rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4 bg-secondary/5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher dans cette page..." 
                  className="pl-10 max-w-sm bg-background" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                ) : filteredZones.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20">Aucun résultat.</TableCell></TableRow>
                ) : (
                  filteredZones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-semibold">{zone.nom}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {zone.codes_postaux?.slice(0, 2).map((cp, i) => <Badge key={i} variant="secondary" className="text-[10px]">{cp}</Badge>)}
                          {zone.codes_postaux && zone.codes_postaux.length > 2 && <span className="text-[10px]">+{zone.codes_postaux.length - 2}</span>}
                        </div>
                      </TableCell>
                      <TableCell>{zone.price} €</TableCell>
                      <TableCell>
                        <Badge variant={zone.statut_market === 'VENDU' ? "secondary" : "outline"}>
                          {zone.statut_market || 'LIBRE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {zone.statut_market !== 'VENDU' && <Button size="sm" onClick={() => handleBuy(zone.id)}>Acheter</Button>}
                        <Button size="icon" variant="ghost" onClick={() => openEditModal(zone)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(zone.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* BARRE DE PAGINATION */}
            <div className="p-4 border-t flex items-center justify-between bg-secondary/5">
              <div className="text-sm text-muted-foreground">
                Affichage de <b>{zones.length}</b> sur <b>{totalCount}</b> zones
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                </Button>
                <div className="text-sm font-medium">Page {currentPage} / {totalPages}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                >
                  Suivant <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ZonesManagement;