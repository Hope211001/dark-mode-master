import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { subscriptionService, Subscription } from '@/services/subscription';
import { Link } from 'react-router-dom';

const ZoneSetting = () => {
    const { zoneId } = useParams<{ zoneId: string }>();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        if (zoneId) {
            fetchSubscription();
        }
    }, [zoneId]);

    const fetchSubscription = async () => {
        try {
            setFetching(true);
            const data = await subscriptionService.getSubscriptionByZone(zoneId!);

            // Sécurité : Vérifie si la donnée reçue contient bien le champ attendu
            setSubscription(data);
        } catch (error: any) {
            console.error(error);
            // Si c'est une 404, c'est que l'utilisateur n'a pas encore de droit sur cette zone
            if (error.response?.status === 404) {
                toast.error("Vous n'avez pas d'abonnement actif pour cette zone.");
            } else {
                toast.error("Erreur lors du chargement des paramètres");
            }
        } finally {
            setFetching(false);
        }
    };

    const handleToggle = (checked: boolean) => {
        if (subscription) {
            setSubscription({ ...subscription, auto_contact_enabled: checked });
        }
    };

    const handleSave = async () => {
        if (!subscription || !zoneId) return;

        setLoading(true);
        try {
            await subscriptionService.updateByZone(zoneId, subscription.auto_contact_enabled);
            toast.success("Configuration mise à jour avec succès !");
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <ClientSidebar />
            <main className="ml-64">
                <ClientHeader
                    title="Paramètres de Zone"
                    subtitle={`Configuration pour la zone `}
                />

                <div className="p-6 max-w-3xl mx-auto">
                    {/* Bouton retour élégant */}
                    <Link
                        to="/client/zones"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Retour à la liste des zones
                    </Link>

                    <Card className="glass-card border-white/10 shadow-xl">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl">Automatisation</CardTitle>
                            <CardDescription className="text-base">
                                Gérez l'envoi automatique de vos messages pour cette zone spécifique.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            {/* Carte de paramètre avec meilleur design */}
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-secondary/20 to-secondary/5 p-6 backdrop-blur-sm">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">Auto-contact</h3>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-all ${subscription?.auto_contact_enabled
                                                    ? 'bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/20'
                                                    : 'bg-slate-500/15 text-slate-500 ring-1 ring-slate-500/20'
                                                }`}>
                                                {subscription?.auto_contact_enabled ? (
                                                    <>
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        ACTIF
                                                    </>
                                                ) : (
                                                    "INACTIF"
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Envoyer automatiquement un SMS dès qu'un nouveau lead correspond à vos filtres configurés.
                                        </p>
                                    </div>

                                    <Switch
                                        checked={subscription?.auto_contact_enabled || false}
                                        onCheckedChange={handleToggle}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                            </div>

                            {/* Bouton de sauvegarde amélioré */}
                            <div className="space-y-4">
                                <Button
                                    onClick={handleSave}
                                    className="w-full h-12 gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={loading || !subscription}
                                    size="lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Enregistrement en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            Enregistrer la configuration
                                        </>
                                    )}
                                </Button>

                                {/* Info supplémentaire */}
                                <p className="text-xs text-center text-muted-foreground">
                                    Les modifications seront appliquées immédiatement après la sauvegarde
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default ZoneSetting;