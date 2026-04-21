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
    Clock
} from "lucide-react";
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

    if (fetching) return (
        <div className="flex h-screen items-center justify-center bg-[#020617]">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
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

                <div className="max-w-4xl mx-auto mt-8 p-4 md:p-8">
                    <Link to="/client/zones" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 mb-8 transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Retour
                    </Link>

                    <Card className="bg-[#0f172a]/50 border-white/5 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="border-b border-white/5 pb-8">
                            <div className="flex items-center gap-3">
                                <Settings2 className="h-6 w-6 text-indigo-500" />
                                <CardTitle className="text-white text-xl font-bold">Paramètres de la Zone</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-8 space-y-8">

                            {/* SWITCH AUTO CONTACT */}
                            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between transition-colors hover:bg-indigo-500/10">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-indigo-400" /> Auto-contact
                                    </h3>
                                    <p className="text-sm text-slate-400">Automatisation des réponses SMS/Email.</p>
                                </div>
                                <Switch
                                    checked={config?.auto_contact_enabled || false}
                                    onCheckedChange={(val) => setConfig(prev => prev ? { ...prev, auto_contact_enabled: val } : null)}
                                    className="data-[state=checked]:bg-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* CATÉGORIE - SELECT */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-400" /> Type d'offre <span className="text-red-400">*</span></Label>
                                    <Select
                                        // On force le passage en string pour le composant Select
                                        value={config?.category_id?.toString() || ""}
                                        onValueChange={(val) => setConfig(prev => prev ? { ...prev, category_id: parseInt(val) } : null)}
                                    >
                                        <SelectTrigger className="bg-[#1e293b]/50 border-white/10 text-white h-12 rounded-xl focus:ring-indigo-500">
                                            <SelectValue placeholder="Choisir un type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                                            <SelectItem value="10">Locations</SelectItem>
                                            <SelectItem value="11">Locations Saisonnières</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* SEARCH QUERY */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2"><Search className="h-4 w-4 text-indigo-400" /> Mot-clé de recherche <span className="text-red-400">*</span></Label>
                                    <Input
                                        value={config?.searchQuery || ""}
                                        onChange={(e) => setConfig(prev => prev ? { ...prev, searchQuery: e.target.value } : null)}
                                        className="bg-[#1e293b]/50 border-white/10 text-white h-12 rounded-xl focus:border-indigo-500"
                                        placeholder="Ex: Appartement, villa..."
                                    />
                                </div>

                                {/* SURFACE MIN */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2"><Maximize className="h-4 w-4 text-indigo-400" /> Surface Minimum (m²)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={config?.surface_min_filter ?? ""}
                                        onChange={(e) => handleIntChange('surface_min_filter', e.target.value)}
                                        onKeyDown={blockInvalidChar}
                                        className="bg-[#1e293b]/50 border-white/10 text-white h-12 rounded-xl"
                                    />
                                </div>

                                {/* RADIUS (RAYON) */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-400" /> Rayon (km)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={config?.radius ?? ""}
                                        onChange={(e) => handleIntChange('radius', e.target.value)}
                                        onKeyDown={blockInvalidChar}
                                        className="bg-[#1e293b]/50 border-white/10 text-white h-12 rounded-xl"
                                    />
                                </div>

                                {/* PRIX MIN */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2"><Euro className="h-4 w-4 text-indigo-400" /> Budget Minimum (€)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={config?.price_min_filter ?? ""}
                                        onChange={(e) => handleIntChange('price_min_filter', e.target.value)}
                                        onKeyDown={blockInvalidChar}
                                        className="bg-[#1e293b]/50 border-white/10 text-white h-12 rounded-xl"
                                    />
                                </div>

                                {/* PRIX MAX */}
                                <div className="space-y-2">
                                    <Label className="text-slate-300 flex items-center gap-2"><Euro className="h-4 w-4 text-indigo-400" /> Budget Maximum (€)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={config?.price_max_filter ?? ""}
                                        onChange={(e) => handleIntChange('price_max_filter', e.target.value)}
                                        onKeyDown={blockInvalidChar}
                                        className="bg-[#1e293b]/50 border-white/10 text-white h-12 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* SECTION MESSAGE */}
                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <Label className="text-slate-300 flex items-center gap-2 font-semibold text-base">
                                    <MessageSquare className="h-4 w-4 text-indigo-400" /> Message automatique
                                </Label>
                                <Textarea
                                    value={config?.template_message || ""}
                                    onChange={(e) => setConfig(prev => prev ? { ...prev, template_message: e.target.value } : null)}
                                    className="bg-[#1e293b]/50 border-white/10 text-white min-h-[140px] rounded-xl focus:ring-indigo-500 placeholder:text-slate-600"
                                    placeholder="Bonjour, je suis très intéressé par votre annonce..."
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSave}
                                    className="w-full h-14 gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/10 transition-all active:scale-95"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    Sauvegarder la configuration
                                </Button>
                            </div>

                            {/* SECTION DANGER — Annulation d'abonnement (ou statut si déjà annulé) */}
                            <div className="mt-8 pt-6 border-t border-white/5">
                                {config?.cancel_at ? (
                                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                                        <div>
                                            <h3 className="text-amber-200 font-semibold">Annulation programmée</h3>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Votre abonnement sera résilié le{" "}
                                                <span className="text-amber-200 font-bold">
                                                    {new Date(config.cancel_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                                . Vous gardez l'accès à la zone jusqu'à cette date.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                                            <div>
                                                <h3 className="text-red-200 font-semibold">Annuler l'abonnement</h3>
                                                <p className="text-sm text-slate-400 mt-1">
                                                    L'abonnement reste actif jusqu'à la fin du cycle en cours. Aucun nouveau prélèvement ne sera effectué.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleCancelSubscription}
                                            disabled={canceling}
                                            variant="outline"
                                            className="w-full border-red-500/40 bg-transparent text-red-300 hover:bg-red-500/10 hover:text-red-200 hover:border-red-500/60"
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
            </main>
        </div>
    );
};

export default ZoneSetting;