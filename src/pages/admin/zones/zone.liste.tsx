import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import {
  Plus, MapPin, Trash2, Edit,
  Loader2, Search, Building2, Building, Map, AlertTriangle
} from "lucide-react";
import { zoneService, Zone, CreateZoneDTO } from "@/services/zones.services";
import { stripeService } from "@/services/stripe.service";
import { geocodingService, FrenchDepartment, GeocodeResult } from "@/services/geocoding.service";
import { useToast } from "@/components/ui/use-toast";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { useQuery } from "@tanstack/react-query";

type ZoneFormData = {
  type: "ville" | "departement" | "arrondissement";
  nom: string;
  price: number;
  lat_center: string;
  lng_center: string;
  codes_postaux_raw: string;
  departement_code: string;
  arrondissement_city: "" | "Paris" | "Lyon" | "Marseille";
  arrondissement_number: string;
};

const ARRONDISSEMENT_CITIES = [
  { name: "Paris", deptCode: "75", count: 20, basePostcode: 75000 },
  { name: "Lyon", deptCode: "69", count: 9, basePostcode: 69000 },
  { name: "Marseille", deptCode: "13", count: 16, basePostcode: 13000 },
] as const;

const ordinalLabel = (n: number) => n === 1 ? "1er" : `${n}e`;

const emptyForm = (): ZoneFormData => ({
  type: "ville",
  nom: "",
  price: 0,
  lat_center: "",
  lng_center: "",
  codes_postaux_raw: "",
  departement_code: "",
  arrondissement_city: "",
  arrondissement_number: "",
});

interface ZoneFormFieldsProps {
  data: ZoneFormData;
  onChange: (next: ZoneFormData) => void;
  geocoding: boolean;
  onAutoGeocode: (cp: string) => void;
  departments: FrenchDepartment[];
  departmentsLoading: boolean;
  allZones: Zone[];
  editingZoneId?: string;
}

function ZoneFormFields({ data, onChange, geocoding, onAutoGeocode, departments, departmentsLoading, allZones, editingZoneId }: ZoneFormFieldsProps) {
  const [cpSuggestions, setCpSuggestions] = useState<GeocodeResult[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<GeocodeResult[]>([]);
  const [cpFocused, setCpFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [deptQuery, setDeptQuery] = useState("");
  const [deptFocused, setDeptFocused] = useState(false);

  const filteredDepartments = departments.filter(d => {
    const q = deptQuery.trim().toLowerCase();
    if (!q) return true;
    return d.code.toLowerCase().startsWith(q) || d.name.toLowerCase().includes(q);
  });

  useEffect(() => {
    if (!cpFocused) return;
    const q = data.codes_postaux_raw.trim();
    if (q.length < 1) { setCpSuggestions([]); return; }

    if (/^\d{1,2}$/.test(q)) {
      const localMatches: GeocodeResult[] = departments
        .filter(d => d.code.startsWith(q))
        .slice(0, 10)
        .map(d => ({
          lat: d.lat,
          lng: d.lng,
          city: `${d.name} (département)`,
          postcode: d.code,
        }));
      setCpSuggestions(localMatches);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await geocodingService.searchPostalCode(q);
        setCpSuggestions(res);
      } catch {
        setCpSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [data.codes_postaux_raw, cpFocused, departments]);

  useEffect(() => {
    if (!nameFocused) return;
    const q = data.nom.trim();
    if (q.length < 1) { setNameSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await geocodingService.searchCity(q);
        setNameSuggestions(res);
      } catch {
        setNameSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [data.nom, nameFocused]);

  const applySuggestion = (s: GeocodeResult) => {
    onChange({
      ...data,
      codes_postaux_raw: s.postcode,
      nom: s.city,
      lat_center: s.lat.toString(),
      lng_center: s.lng.toString(),
    });
    setCpSuggestions([]);
    setNameSuggestions([]);
    setCpFocused(false);
    setNameFocused(false);
  };

  const handlePostalCodeChange = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      onChange({ ...data, codes_postaux_raw: "", nom: "", lat_center: "", lng_center: "" });
      return;
    }
    onChange({ ...data, codes_postaux_raw: raw });
    if (/^\d{5}$/.test(trimmed)) {
      onAutoGeocode(trimmed);
    }
  };
  const applyDepartment = (dept: FrenchDepartment) => {
    onChange({
      ...data,
      departement_code: dept.code,
      nom: `Département ${dept.code} - ${dept.name}`,
      lat_center: dept.lat.toString(),
      lng_center: dept.lng.toString(),
      codes_postaux_raw: dept.code,
    });
    setDeptQuery("");
    setDeptFocused(false);
  };

  const arrondissementCity = ARRONDISSEMENT_CITIES.find(c => c.name === data.arrondissement_city);

  const applyArrondissement = (cityName: "Paris" | "Lyon" | "Marseille", n: number) => {
    const city = ARRONDISSEMENT_CITIES.find(c => c.name === cityName);
    if (!city) return;
    const postcode = String(city.basePostcode + n).padStart(5, "0");
    onChange({
      ...data,
      arrondissement_city: cityName,
      arrondissement_number: n.toString(),
      nom: `${cityName} ${ordinalLabel(n)} Arrondissement`,
      codes_postaux_raw: postcode,
    });
    onAutoGeocode(postcode);
  };

  const overlappingZones: Zone[] = (() => {
    const others = allZones.filter(z => z.id !== editingZoneId);

    if (data.type === "departement" && data.departement_code) {
      return others.filter(z =>
        (z.type === "ville" || z.type === "arrondissement") &&
        z.codes_postaux?.some(cp => cp.startsWith(data.departement_code))
      );
    }

    if (data.type === "ville" && data.codes_postaux_raw) {
      const cps = data.codes_postaux_raw.split(",").map(c => c.trim()).filter(Boolean);
      if (cps.length === 0) return [];
      const cityPrefix = cps[0].substring(0, 2);
      const isArrondCity = ARRONDISSEMENT_CITIES.some(c => c.deptCode === cityPrefix);
      if (!isArrondCity) return [];
      return others.filter(z =>
        z.type === "arrondissement" &&
        z.codes_postaux?.some(c => c.startsWith(cityPrefix))
      );
    }

    return [];
  })();

  return (
    <div className="grid gap-4 py-4">
      <Tabs
        value={data.type}
        onValueChange={(v) => onChange({ ...emptyForm(), type: v as ZoneFormData["type"], price: data.price })}
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="ville" className="gap-2">
            <Building2 className="h-4 w-4" /> Ville
          </TabsTrigger>
          <TabsTrigger value="arrondissement" className="gap-2">
            <Building className="h-4 w-4" /> Arrond.
          </TabsTrigger>
          <TabsTrigger value="departement" className="gap-2">
            <Map className="h-4 w-4" /> Département
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {data.type === "arrondissement" ? (
        <>
          <div className="space-y-2">
            <Label>Ville</Label>
            <Select
              value={data.arrondissement_city}
              onValueChange={(v) => onChange({
                ...data,
                arrondissement_city: v as "Paris" | "Lyon" | "Marseille",
                arrondissement_number: "",
                nom: "",
                codes_postaux_raw: "",
                lat_center: "",
                lng_center: "",
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir Paris, Lyon ou Marseille..." />
              </SelectTrigger>
              <SelectContent>
                {ARRONDISSEMENT_CITIES.map(c => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name} <span className="text-xs text-muted-foreground ml-2">({c.count} arrondissements)</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {arrondissementCity && (
            <div className="space-y-2">
              <Label>Arrondissement</Label>
              <Select
                value={data.arrondissement_number}
                onValueChange={(v) => applyArrondissement(arrondissementCity.name, parseInt(v, 10))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir l'arrondissement..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Array.from({ length: arrondissementCity.count }, (_, i) => i + 1).map(n => (
                    <SelectItem key={n} value={n.toString()}>
                      {arrondissementCity.name} {ordinalLabel(n)} ({String(arrondissementCity.basePostcode + n).padStart(5, "0")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {data.codes_postaux_raw && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Sélectionné : {data.nom} (CP {data.codes_postaux_raw})
            </p>
          )}
        </>
      ) : data.type === "departement" ? (
        <div className="space-y-2">
          <Label>Rechercher un département</Label>
          <div className="relative">
            <Input
              placeholder={departmentsLoading ? "Chargement..." : "Tapez 75 ou Paris..."}
              value={deptQuery}
              onChange={(e) => setDeptQuery(e.target.value)}
              onFocus={() => setDeptFocused(true)}
              onBlur={() => setTimeout(() => setDeptFocused(false), 150)}
              disabled={departmentsLoading}
              autoComplete="off"
            />
            {deptFocused && filteredDepartments.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredDepartments.map(d => (
                  <button
                    key={d.code}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyDepartment(d)}
                    className="w-full text-left px-3 py-2 hover:bg-accent text-sm border-b last:border-b-0"
                  >
                    <span className="font-mono font-bold text-primary">{d.code}</span>
                    <span className="ml-2">{d.name}</span>
                  </button>
                ))}
              </div>
            )}
            {deptFocused && deptQuery && filteredDepartments.length === 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg p-3 text-sm text-muted-foreground">
                Aucun département trouvé
              </div>
            )}
          </div>
          {data.departement_code && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Sélectionné : {data.nom}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label>Code postal</Label>
            <div className="relative">
              <Input
                placeholder="75001"
                inputMode="numeric"
                maxLength={5}
                value={data.codes_postaux_raw}
                onChange={(e) => handlePostalCodeChange(e.target.value)}
                onFocus={() => setCpFocused(true)}
                onBlur={() => setTimeout(() => setCpFocused(false), 150)}
                autoComplete="off"
              />
              {geocoding && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {cpFocused && cpSuggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                  {cpSuggestions.map((s, i) => (
                    <button
                      key={`${s.postcode}-${i}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySuggestion(s)}
                      className="w-full text-left px-3 py-2 hover:bg-accent text-sm border-b last:border-b-0"
                    >
                      <span className="font-mono font-bold text-primary">{s.postcode}</span>
                      <span className="ml-2 text-muted-foreground">{s.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tapez le code postal ou choisissez une suggestion dans la liste.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Nom de la ville</Label>
            <div className="relative">
              <Input
                required
                value={data.nom}
                onChange={(e) => onChange({ ...data, nom: e.target.value })}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setTimeout(() => setNameFocused(false), 150)}
                autoComplete="off"
                placeholder="Ex: Paris, Marseille..."
              />
              {nameFocused && nameSuggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                  {nameSuggestions.map((s, i) => (
                    <button
                      key={`${s.postcode}-${i}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySuggestion(s)}
                      className="w-full text-left px-3 py-2 hover:bg-accent text-sm border-b last:border-b-0"
                    >
                      <span className="font-medium">{s.city}</span>
                      <span className="ml-2 text-xs font-mono text-muted-foreground">({s.postcode})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Latitude</Label>
          <Input
            type="number"
            step="any"
            required
            value={data.lat_center}
            onChange={(e) => onChange({ ...data, lat_center: e.target.value })}
            className="bg-secondary/30"
          />
        </div>
        <div className="space-y-2">
          <Label>Longitude</Label>
          <Input
            type="number"
            step="any"
            required
            value={data.lng_center}
            onChange={(e) => onChange({ ...data, lng_center: e.target.value })}
            className="bg-secondary/30"
          />
        </div>
      </div>

      {overlappingZones.length > 0 && (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 flex-1">
              <p className="font-semibold text-amber-900">
                {overlappingZones.length} zone{overlappingZones.length > 1 ? "s" : ""} plus précise{overlappingZones.length > 1 ? "s" : ""} {overlappingZones.length > 1 ? "existent" : "existe"} déjà
              </p>
              <p className="text-amber-800">
                Les leads de ces zones n'iront PAS à cette zone (priorité aux zones plus spécifiques) :
              </p>
              <ul className="list-disc list-inside text-amber-800 mt-1 space-y-0.5">
                {overlappingZones.slice(0, 8).map(z => (
                  <li key={z.id}>
                    {z.nom} <span className="opacity-70">({z.type})</span>
                  </li>
                ))}
                {overlappingZones.length > 8 && (
                  <li className="opacity-70">… et {overlappingZones.length - 8} autre{overlappingZones.length - 8 > 1 ? "s" : ""}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Prix (€)</Label>
        <Input
          type="number"
          required
          value={data.price || ""}
          onChange={(e) => onChange({ ...data, price: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}

const ZonesManagement = () => {
  const { toast } = useToast();

  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newZone, setNewZone] = useState<ZoneFormData>(emptyForm());
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [editFormData, setEditFormData] = useState<ZoneFormData>(emptyForm());

  const [geocodingNew, setGeocodingNew] = useState(false);
  const [geocodingEdit, setGeocodingEdit] = useState(false);

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ["french-departments"],
    queryFn: () => geocodingService.getDepartments(),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const { data: allZones = [], refetch: refetchAllZones } = useQuery({
    queryKey: ["all-zones-overlap"],
    queryFn: () => zoneService.getMapStatus(),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchZones();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage, statutFilter]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await zoneService.getAll(currentPage, limit, searchTerm, statutFilter);
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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const autoGeocode = async (
    cp: string,
    setForm: (updater: (prev: ZoneFormData) => ZoneFormData) => void,
    setGeocoding: (v: boolean) => void
  ) => {
    if (!/^\d{5}$/.test(cp.trim())) return;
    try {
      setGeocoding(true);
      const result = await geocodingService.byPostalCode(cp.trim());
      if (result) {
        setForm(prev => ({
          ...prev,
          nom: result.city,
          lat_center: result.lat.toString(),
          lng_center: result.lng.toString(),
        }));
        toast({ title: "Coordonnées trouvées", description: `${result.city} (${result.postcode})` });
      } else {
        toast({ title: "Code postal introuvable", description: "Saisissez les coordonnées manuellement", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur de géocodage", description: "Impossible de joindre l'API Adresse", variant: "destructive" });
    } finally {
      setGeocoding(false);
    }
  };

  const buildPayload = async (form: ZoneFormData): Promise<CreateZoneDTO> => {
    const codesArray = form.codes_postaux_raw.split(",").map(c => c.trim()).filter(c => c !== "");

    let originaux: string[] = codesArray;

    if (form.type === "departement" && form.departement_code) {
      try {
        const allCps = await geocodingService.getPostalCodesForDepartment(form.departement_code);
        if (allCps.length > 0) originaux = allCps;
      } catch {
        toast({ title: "Avertissement", description: "Impossible de récupérer tous les CP du département, le préfixe sera utilisé." });
      }
    }

    return {
      nom: form.nom,
      price: form.price,
      lat_center: Number(form.lat_center),
      lng_center: Number(form.lng_center),
      codes_postaux: originaux,
      codes_postaux_originaux: originaux,
      type: form.type,
    };
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = await buildPayload(newZone);
      await zoneService.create(payload);
      const typeLabel =
        newZone.type === "departement" ? "Le département"
        : newZone.type === "arrondissement" ? "L'arrondissement"
        : "La ville";
      toast({ title: "Succès", description: `${typeLabel} a été ajouté(e)` });
      setIsModalOpen(false);
      setNewZone(emptyForm());
      fetchZones();
      refetchAllZones();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la création", variant: "destructive" });
    }
  };

  const openEditModal = (zone: Zone) => {
    setEditingZone(zone);

    const originaux = zone.codes_postaux_originaux || zone.codes_postaux || [];
    let codes_postaux_raw = originaux.join(", ");
    let departement_code = "";

    if (zone.type === "departement") {
      const firstCp = originaux[0] || "";
      if (firstCp.startsWith("97") || firstCp.startsWith("98")) {
        departement_code = firstCp.substring(0, 3);
      } else if (firstCp.length >= 2) {
        departement_code = firstCp.substring(0, 2);
      }
      codes_postaux_raw = departement_code;
    }

    setEditFormData({
      type: (zone.type as ZoneFormData["type"]) || "ville",
      nom: zone.nom,
      price: zone.price,
      lat_center: zone.lat_center.toString(),
      lng_center: zone.lng_center.toString(),
      codes_postaux_raw,
      departement_code,
      arrondissement_city: "",
      arrondissement_number: "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    try {
      const payload = await buildPayload(editFormData);
      await zoneService.update(editingZone.id.toString(), payload);
      toast({ title: "Mis à jour", description: "La zone a été modifiée" });
      setIsEditModalOpen(false);
      fetchZones();
      refetchAllZones();
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
      refetchAllZones();
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
        <Header title="Zones" subtitle="Gestion des zones géographiques" />

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Zones</h1>
              <p className="text-muted-foreground">Recherchez et administrez les zones (villes ou départements).</p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg"><Plus className="h-4 w-4" /> Ajouter une zone</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateZone}>
                  <DialogHeader><DialogTitle>Créer une nouvelle zone</DialogTitle></DialogHeader>
                  <ZoneFormFields
                    data={newZone}
                    onChange={setNewZone}
                    geocoding={geocodingNew}
                    onAutoGeocode={(cp) => autoGeocode(cp, setNewZone as never, setGeocodingNew)}
                    departments={departments}
                    departmentsLoading={departmentsLoading}
                    allZones={allZones}
                  />
                  <DialogFooter><Button type="submit" className="w-full">Enregistrer en base</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="glass-card rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b flex flex-wrap items-center gap-3 bg-secondary/5">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher ville ou code postal..."
                  className="pl-10 bg-background"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <Select value={statutFilter} onValueChange={(v) => { setStatutFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="LIBRE">Libre</SelectItem>
                  <SelectItem value="VENDU">Vendu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Codes Postaux</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : zones.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">Aucune zone trouvée pour "{searchTerm}"</TableCell></TableRow>
                ) : (
                  zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-bold">{zone.nom}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          zone.type === "departement"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : zone.type === "arrondissement"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }>
                          {zone.type === "departement" ? "Département"
                            : zone.type === "arrondissement" ? "Arrondissement"
                            : "Ville"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {zone.codes_postaux?.join(", ")}
                      </TableCell>
                      <TableCell>{zone.price} €</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          zone.statut_market === 'VENDU'
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }>
                          {zone.statut_market || 'LIBRE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {zone.statut_market !== 'VENDU' && (
                            <Button size="sm" variant="ghost" className="gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 h-7 text-xs" onClick={() => handleBuy(zone.id)}>
                              <MapPin className="h-3.5 w-3.5" />
                              Acheter
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 h-7 text-xs" onClick={() => openEditModal(zone)}>
                            <Edit className="h-3.5 w-3.5" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 h-7 text-xs" onClick={() => handleDelete(zone.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateZone}>
            <DialogHeader><DialogTitle>Modifier la zone : {editingZone?.nom}</DialogTitle></DialogHeader>
            <ZoneFormFields
              data={editFormData}
              onChange={setEditFormData}
              geocoding={geocodingEdit}
              onAutoGeocode={(cp) => autoGeocode(cp, setEditFormData as never, setGeocodingEdit)}
              departments={departments}
              departmentsLoading={departmentsLoading}
              allZones={allZones}
              editingZoneId={editingZone?.id?.toString()}
            />
            <DialogFooter><Button type="submit" className="w-full">Mettre à jour les informations</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZonesManagement;
