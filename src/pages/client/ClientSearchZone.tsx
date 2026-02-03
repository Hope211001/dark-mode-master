import { useState, useEffect, useRef } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    MapPin,
    CreditCard,
    Loader2,
    Info,
    CheckCircle2,
    AlertCircle,
    Navigation,
    RefreshCw
} from "lucide-react";

// Import des services
import { zoneService, Zone } from "@/services/zones.services";
import { stripeService } from "@/services/stripe.service";
import { useToast } from "@/components/ui/use-toast";
import MapExplorer from "@/components/Map/MapExplorer";

const ClientSearchZone = () => {
    const [allZones, setAllZones] = useState<Zone[]>([]);
    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [searchPos, setSearchPos] = useState<{ lat: number; lon: number } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    // NOUVEAUX STATES pour l'autocomplete
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { toast } = useToast();


    // 1. Charger toutes les zones au démarrage
    useEffect(() => {
        fetchZones();
    }, []);


    const fetchZones = async () => {
        try {
            const data = await zoneService.getMapStatus();
            console.log("Zones chargées pour la carte :", data);
            setAllZones(data);
        } catch (error) {
            console.error("Erreur zones:", error);
        }
    };

    // NOUVEAU : Fonction d'actualisation
    const handleRefresh = () => {
        window.location.reload();
    };

    // NOUVEAU : Fermer les suggestions si on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // AMÉLIORÉ : Autocomplete filtré par les zones de la base de données
    useEffect(() => {
        if (searchTerm.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api-adresse.data.gouv.fr/search/?q=${searchTerm}&type=municipality&limit=20`
                );
                const data = await res.json();

                // FILTRER uniquement les villes qui correspondent aux codes postaux de nos zones
                const filteredFeatures = (data.features || []).filter((feature: any) => {
                    const cp = feature.properties.postcode;
                    return allZones.some(zone => zone.codes_postaux?.includes(cp));
                });

                setSuggestions(filteredFeatures);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Erreur autocomplete:", error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, allZones]);

    // AMÉLIORÉ : Sélection d'une suggestion avec vérification et recentrage de la carte
    const handleSelectSuggestion = (feature: any) => {
        const [lon, lat] = feature.geometry.coordinates;
        const cp = feature.properties.postcode;
        const cityName = feature.properties.label;

        setSearchTerm(cityName);
        setShowSuggestions(false);

        // Chercher la zone correspondante
        const match = allZones.find(z => z.codes_postaux?.includes(cp));
        if (match) {
            // Mettre à jour la position de recherche pour recentrer la carte
            setSearchPos({ lat: match.lat_center, lon: match.lng_center });

            // Sélectionner la zone
            setSelectedZone(match);

            toast({
                title: "✅ Zone trouvée",
                description: `${cityName} - ${match.statut_market}`,
            });
        } else {
            // Même si pas de zone, on centre sur les coordonnées de la ville
            setSearchPos({ lat, lon });
            setSelectedZone(null);

            toast({
                title: "⚠️ Zone non disponible",
                description: "Ce secteur n'est pas encore ouvert à l'exclusivité.",
            });
        }
    };

    // 2. Logique de recherche classique (formulaire)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) return;

        setIsSearching(true);
        setShowSuggestions(false);

        try {
            const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${searchTerm}&type=municipality&limit=1`);
            const data = await res.json();

            if (data.features.length > 0) {
                const [lon, lat] = data.features[0].geometry.coordinates;
                const cp = data.features[0].properties.postcode;

                setSearchPos({ lat, lon });

                const match = allZones.find(z => z.codes_postaux?.includes(cp));
                if (match) {
                    setSelectedZone(match);
                    toast({
                        title: "✅ Zone trouvée",
                        description: `${match.nom} - ${match.statut_market}`,
                    });
                } else {
                    setSelectedZone(null);
                    toast({
                        title: "⚠️ Zone non disponible",
                        description: "Ce secteur n'est pas disponible dans notre base.",
                        variant: "destructive"
                    });
                }
            }
        } catch (error) {
            toast({ title: "Erreur", description: "Recherche impossible", variant: "destructive" });
        } finally {
            setIsSearching(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedZone || selectedZone.statut_market === 'VENDU') return;
        setLoading(true);
        try {
            const data = await stripeService.buyZone(selectedZone.id.toString());
            if (data.url) window.location.href = data.url;
        } catch (error) {
            toast({ title: "Erreur Stripe", description: "Lien de paiement invalide", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <ClientSidebar />

            <main className="ml-64 flex flex-col h-screen">
                <ClientHeader
                    title="Marketplace d'Exclusivité"
                    subtitle="Trouvez votre futur secteur et bloquez la concurrence."
                />

                <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

                    {/* COLONNE GAUCHE : Recherche et Actions */}
                    <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2">

                        {/* Boutons d'action */}
                        <div className="flex justify-between items-center">

                            {/* Bouton gauche (nouveau) */}
                            {/* <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                <Search className="h-4 w-4" />
                               Toutes les villes
                            </Button> */}

                            {/* Bouton actualisation */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Actualisation...' : 'Actualiser les zones'}
                            </Button>

                        </div>


                        {/* Carte Recherche AMÉLIORÉE avec Autocomplete */}
                        <Card className="glass-card border-white/5 shadow-xl relative">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Search className="h-4 w-4 text-primary" />
                                    Rechercher une ville disponible
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div ref={searchRef} className="relative">
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                placeholder="Ex: Bordeaux, Nice, Paris..."
                                                className="bg-secondary/20 border-white/10 pr-8"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                            />
                                            {searchTerm && (
                                                <button
                                                    type="button"
                                                    onClick={handleRefresh}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        <Button type="submit" size="icon" disabled={isSearching}>
                                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                                        </Button>
                                    </form>

                                    {/* Liste de suggestions - UNIQUEMENT zones disponibles - Z-INDEX CORRIGÉ */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute z-[100] w-full mt-2 bg-background/98 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto">
                                            {suggestions.map((feature, index) => {
                                                const cp = feature.properties.postcode;
                                                const zone = allZones.find(z => z.codes_postaux?.includes(cp));

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSelectSuggestion(feature)}
                                                        className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors border-b border-white/5 last:border-0 flex items-center gap-3 group"
                                                    >
                                                        <MapPin className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm truncate">
                                                                {feature.properties.label}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                                <span>CP: {feature.properties.postcode}</span>
                                                                {zone && (
                                                                    <Badge
                                                                        variant={zone.statut_market === 'LIBRE' ? 'default' : 'destructive'}
                                                                        className="text-[9px] px-1.5 py-0"
                                                                    >
                                                                        {zone.statut_market === 'LIBRE' ? '🟢 LIBRE' : '🔴 VENDU'}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Message "Aucun résultat" - Z-INDEX CORRIGÉ */}
                                    {showSuggestions && searchTerm.length >= 2 && suggestions.length === 0 && (
                                        <div className="absolute z-[100] w-full mt-2 bg-background/98 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-4 text-center text-sm text-muted-foreground">
                                            Aucune zone disponible pour cette recherche
                                        </div>
                                    )}
                                </div>

                                <p className="text-[10px] text-muted-foreground mt-2 italic">
                                    💡 Seules les villes avec des zones disponibles apparaissent
                                </p>
                            </CardContent>
                        </Card>

                        {/* Carte Détails Zone */}
                        {selectedZone ? (
                            <Card className="glass-card border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-2xl font-black">{selectedZone.nom}</CardTitle>
                                        <Badge
                                            variant={selectedZone.statut_market === 'VENDU' ? "destructive" : "default"}
                                            className={`font-bold text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-lg ${selectedZone.statut_market === 'LIBRE'
                                                ? "bg-green-500 hover:bg-green-600 text-white border-2 border-green-400"
                                                : "bg-red-500 hover:bg-red-600 text-white border-2 border-red-400"
                                                }`}
                                        >
                                            <div
                                                className="w-2 h-2 rounded-full bg-white animate-pulse"
                                                style={{
                                                    boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
                                                }}
                                            />
                                            {selectedZone.statut_market === 'VENDU' ? '🔴 VENDU' : '🟢 LIBRE'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Prix d'acquisition</p>
                                            <div className="text-4xl font-black text-primary">{selectedZone.price}€</div>
                                        </div>
                                        <div className="flex flex-col items-end text-[10px] text-muted-foreground font-medium italic">
                                            <span>Exclusivité totale</span>
                                            <span>Zéro commission</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-secondary/30 rounded-lg border border-white/5 space-y-1">
                                        <div className="flex items-center gap-2 text-xs">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            <span className="font-bold">Codes postaux couverts :</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground pl-5">
                                            {selectedZone.codes_postaux?.join(", ")}
                                        </p>
                                    </div>

                                    {selectedZone.statut_market === 'LIBRE' ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-2 p-3 bg-success/10 border border-success/20 rounded-lg text-[11px] text-success-foreground">
                                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                                <p>Cette zone est disponible immédiatement. Devenez le seul à recevoir les alertes Leboncoin sur ce secteur.</p>
                                            </div>
                                            <Button onClick={handlePurchase} className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
                                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CreditCard className="mr-2 h-5 w-5" /> Acheter via Stripe</>}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-[11px] text-destructive">
                                            <AlertCircle className="h-4 w-4 shrink-0" />
                                            <p>Ce secteur est déjà sous concession. Un autre chasseur possède l'exclusivité ici.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl opacity-40">
                                <MapPin className="h-10 w-10 mb-2" />
                                <p className="text-xs font-medium text-center px-10">Sélectionnez un point vert sur la carte ou recherchez une ville pour voir les détails d'acquisition.</p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3 items-start">
                            <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                <strong>Comment ça marche ?</strong> Une fois la zone achetée, notre système n8n commence à scanner Leboncoin toutes les 15 minutes. Vous êtes le seul à recevoir les alertes pour cette ville.
                            </p>
                        </div>
                    </div>

                    {/* COLONNE DROITE : La Carte */}
                    <div className="lg:col-span-2 relative rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                        <MapExplorer
                            zonesData={allZones}
                            searchPos={searchPos}
                            onSelectZone={(id) => {
                                const zone = allZones.find(z => z.id.toString() === id);
                                if (zone) {
                                    setSelectedZone(zone);
                                    setSearchPos({ lat: zone.lat_center, lon: zone.lng_center });
                                }
                            }}
                        />
                    </div>

                </div>
            </main>

            {/* Glow Effects */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        </div>
    );
};

export default ClientSearchZone;