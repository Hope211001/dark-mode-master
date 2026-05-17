import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Save,
    Loader2,
    ArrowLeft,
    Search,
    Euro,
    Maximize,
    Zap,
    Settings2,
    Layers,
    MapPin,
    MessageSquare,
    XCircle,
    Clock,
    Globe
} from "lucide-react";

const SOURCES_OPTIONS = [
    { value: "leboncoin.fr",    label: "Leboncoin",     hint: "Particuliers + pros" },
] as const;
import { subscriptionService, Subscription } from '@/services/subscription';
import ErrorAlert from "@/components/alert/error";
import SuccessAlert from "@/components/alert/success";

const ZoneSetting = () => {
    const { zoneId } = useParams<{ zoneId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [config, setConfig] = useState<Subscription | null>(null);
    const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
    const [successAlert, setSuccessAlert] = useState({ visible: false, message: "" });

    const handleCancelSubscription = async () => {
        if (!zoneId) return;

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Annuler l\'abonnement ?',
            html: `
                <p>L'abonnement sera <strong>annulé à la fin du cycle en cours</strong>.</p>
                <p class="mt-2 text-sm opacity-80">Vous gardez l'accès à la zone et à ses leads jusqu'à la prochaine date de renouvellement, puis la zone sera libérée.</p>
            `,
            showCancelButton: true,
            confirmButtonText: 'Oui, annuler',
            cancelButtonText: 'Non, garder',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#475569',
            background: '#0f172a',
            color: '#fff',
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;

        try {
            setCanceling(true);
            const res = await subscriptionService.cancelByZone(zoneId);
            const cancelDate = res.cancel_at ? new Date(res.cancel_at).toLocaleDateString('fr-FR') : 'fin du cycle';
            // Refresh local pour afficher le badge "Annulation programmée"
            await fetchConfig();
            await Swal.fire({
                icon: 'success',
                title: 'Annulation programmée',
                text: `Votre abonnement prendra fin le ${cancelDate}.`,
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#059669',
            });
        } catch (error: any) {
            const msg = error?.response?.data?.error || 'Impossible d\'annuler l\'abonnement.';
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: msg,
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#dc2626',
            });
        } finally {
            setCanceling(false);
        }
    };

    // 1. Chargement des données au montage du composant
    useEffect(() => {
        if (zoneId) fetchConfig();
    }, [zoneId]);


    const fetchConfig = async () => {
        try {
            setFetching(true);
            const data = await subscriptionService.getSubscriptionByZone(zoneId!);
            console.log("✅ Données reçues :", data);
            const sources = Array.isArray(data?.sources_allowed) ? data.sources_allowed : [];
            if (!sources.includes("leboncoin.fr")) {
                data.sources_allowed = ["leboncoin.fr"];
            }
            setConfig(data);
        } catch (error: any) {
            // Affiche l'erreur réelle dans la console pour débugger
            console.error("❌ Erreur API :", error.response?.data || error.message);
            setErrorAlert({ visible: true, message: "Erreur de chargement : " + (error.response?.data?.error || "Serveur injoignable") });
        } finally {
            setFetching(false);
        }
    };

    // 2. Gestion des changements numériques (Entiers POSITIFS uniquement)
    const handleIntChange = (field: keyof Subscription, value: string) => {
        if (!config) return;

        if (value === "") {
            setConfig({ ...config, [field]: null });
            return;
        }

        const parsed = parseInt(value, 10);

        // Sécurité : Ne prend que les nombres positifs
        if (!isNaN(parsed)) {
            const finalValue = Math.max(0, parsed);
            setConfig({ ...config, [field]: finalValue });
        }
    };

    // 3. Validation + Sauvegarde vers le backend
    const handleSave = async () => {
        if (!config || !zoneId) return;

        // Validation des champs obligatoires
        if (!config.searchQuery?.trim()) {
            setErrorAlert({ visible: true, message: "Le mot-clé de recherche est obligatoire." });
            return;
        }
        if (!config.category_id) {
            setErrorAlert({ visible: true, message: "Le type d'offre est obligatoire." });
            return;
        }

        // Validation prix min < prix max (seulement si les deux sont renseignés)
        if (
            config.price_min_filter != null &&
            config.price_max_filter != null &&
            config.price_min_filter > config.price_max_filter
        ) {
            setErrorAlert({ visible: true, message: "Le budget minimum doit être inférieur au budget maximum." });
            return;
        }

        setLoading(true);
        try {
            await subscriptionService.updateByZone(zoneId, {
                auto_contact_enabled: config.auto_contact_enabled,
                price_min_filter: config.price_min_filter,
                price_max_filter: config.price_max_filter,
                surface_min_filter: config.surface_min_filter,
                searchQuery: config.searchQuery,
                category_id: config.category_id,
                radius: config.radius,
                template_message: config.template_message,
                sources_allowed: Array.isArray(config.sources_allowed) ? config.sources_allowed : [],
            });
            setSuccessAlert({ visible: true, message: "Configuration mise à jour avec succès !" });
        } catch (error) {
            setErrorAlert({ visible: true, message: "Erreur lors de la sauvegarde." });
        } finally {
            setLoading(false);
        }
    };

    // Bloquer les caractères spéciaux non désirés
    const blockInvalidChar = (e: React.KeyboardEvent) => {
        if (['.', ',', '-', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
        }
    };

    // Toggle d'une source dans sources_allowed
    const toggleSource = (source: string, checked: boolean) => {
        if (!config) return;
        const current = Array.isArray(config.sources_allowed) ? config.sources_allowed : [];
        const next = checked
            ? Array.from(new Set([...current, source]))
            : current.filter(s => s !== source);
        setConfig({ ...config, sources_allowed: next });
    };

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

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
                <ClientHeader title="Configuration Zone" subtitle="Automatisation et filtres" />

                <div className="p-4 md:p-6 lg:p-8">
                    <div className="max-w-5xl">
                        <Link to="/client/zones" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Retour
                        </Link>

                        <Card className="border-border bg-card">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                        <Settings2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold">Paramètres de la Zone</CardTitle>
                                        <p className="text-xs text-muted-foreground mt-0.5">Automatisation, filtres et sources</p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-6">

                                {/* SWITCH AUTO CONTACT */}
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                                            <Zap className="h-4 w-4 text-primary" /> Auto-contact
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Automatisation des réponses SMS/Email.</p>
                                    </div>
                                    <Switch
                                        checked={config?.auto_contact_enabled || false}
                                        onCheckedChange={(val) => setConfig(prev => prev ? { ...prev, auto_contact_enabled: val } : null)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* CATÉGORIE - SELECT */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm"><Layers className="h-4 w-4 text-primary" /> Type d'offre <span className="text-destructive">*</span></Label>
                                        <Select
                                            value={config?.category_id?.toString() || ""}
                                            onValueChange={(val) => setConfig(prev => prev ? { ...prev, category_id: parseInt(val) } : null)}
                                        >
                                            <SelectTrigger className="bg-secondary/30">
                                                <SelectValue placeholder="Choisir un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">Locations</SelectItem>
                                                <SelectItem value="11">Locations Saisonnières</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* SEARCH QUERY */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm"><Search className="h-4 w-4 text-primary" /> Mot-clé de recherche <span className="text-destructive">*</span></Label>
                                        <Input
                                            value={config?.searchQuery || ""}
                                            onChange={(e) => setConfig(prev => prev ? { ...prev, searchQuery: e.target.value } : null)}
                                            className="bg-secondary/30"
                                            placeholder="Ex: Appartement, villa..."
                                        />
                                    </div>

                                    {/* SURFACE MIN */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm"><Maximize className="h-4 w-4 text-primary" /> Surface Minimum (m²)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={config?.surface_min_filter ?? ""}
                                            onChange={(e) => handleIntChange('surface_min_filter', e.target.value)}
                                            onKeyDown={blockInvalidChar}
                                            className="bg-secondary/30"
                                        />
                                    </div>

                                    {/* RADIUS (RAYON) */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" /> Rayon (km)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={config?.radius ?? ""}
                                            onChange={(e) => handleIntChange('radius', e.target.value)}
                                            onKeyDown={blockInvalidChar}
                                            className="bg-secondary/30"
                                        />
                                    </div>

                                    {/* PRIX MIN */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm"><Euro className="h-4 w-4 text-primary" /> Budget Minimum (€)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={config?.price_min_filter ?? ""}
                                            onChange={(e) => handleIntChange('price_min_filter', e.target.value)}
                                            onKeyDown={blockInvalidChar}
                                            className="bg-secondary/30"
                                        />
                                    </div>

                                    {/* PRIX MAX */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm"><Euro className="h-4 w-4 text-primary" /> Budget Maximum (€)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={config?.price_max_filter ?? ""}
                                            onChange={(e) => handleIntChange('price_max_filter', e.target.value)}
                                            onKeyDown={blockInvalidChar}
                                            className="bg-secondary/30"
                                        />
                                    </div>
                                </div>

                                {/* SECTION SOURCES (portails) */}
                                <div className="space-y-3 pt-4 border-t border-border/50">
                                    <Label className="flex items-center gap-2 font-semibold text-sm">
                                        <Globe className="h-4 w-4 text-primary" /> Sources d'annonces
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Cochez les portails sur lesquels vous voulez recevoir des leads.
                                        Aucune coche = <span className="text-primary font-medium">toutes les sources</span> sont autorisées.
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        {SOURCES_OPTIONS.map(({ value, label, hint }) => {
                                            const current = Array.isArray(config?.sources_allowed) ? config!.sources_allowed : [];
                                            const isChecked = current.includes(value);
                                            return (
                                                <label
                                                    key={value}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                        isChecked
                                                            ? "bg-primary/10 border-primary/40"
                                                            : "bg-secondary/30 border-border hover:border-border/80"
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(val) => toggleSource(value, val === true)}
                                                        className="mt-0.5"
                                                    />
                                                    <div className="space-y-0.5">
                                                        <div className="text-sm font-semibold text-foreground">{label}</div>
                                                        <div className="text-[11px] text-muted-foreground">{hint}</div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* SECTION MESSAGE */}
                                <div className="space-y-2 pt-4 border-t border-border/50">
                                    <Label className="flex items-center gap-2 font-semibold text-sm">
                                        <MessageSquare className="h-4 w-4 text-primary" /> Message automatique
                                    </Label>
                                    <Textarea
                                        value={config?.template_message || ""}
                                        onChange={(e) => setConfig(prev => prev ? { ...prev, template_message: e.target.value } : null)}
                                        className="bg-secondary/30 min-h-[120px]"
                                        placeholder="Bonjour, je suis très intéressé par votre annonce..."
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        onClick={handleSave}
                                        className="w-full gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Sauvegarder la configuration
                                    </Button>
                                </div>

                                {/* SECTION DANGER — Annulation d'abonnement (ou statut si déjà annulé) */}
                                <div className="pt-4 border-t border-border/50">
                                    {config?.cancel_at ? (
                                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
                                            <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                            <div>
                                                <h3 className="text-amber-500 font-semibold text-sm">Annulation programmée</h3>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Votre abonnement sera résilié le{" "}
                                                    <span className="text-amber-500 font-bold">
                                                        {new Date(config.cancel_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    . Vous gardez l'accès à la zone jusqu'à cette date.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                                <div>
                                                    <h3 className="text-destructive font-semibold text-sm">Annuler l'abonnement</h3>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        L'abonnement reste actif jusqu'à la fin du cycle en cours. Aucun nouveau prélèvement ne sera effectué.
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleCancelSubscription}
                                                disabled={canceling}
                                                variant="outline"
                                                className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                {canceling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                                Annuler mon abonnement
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ZoneSetting;