import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { 
    Loader2, 
    ArrowLeft, 
    MapPin, 
    Calendar, 
    Maximize, 
    Euro, 
    TrendingUp, 
    ExternalLink, 
    Target, 
    Camera, 
    Hash,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { leadsService, Lead } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const ShowLead = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLead = async () => {
            if (!id) return;
            try {
                const data = await leadsService.getById(id);
                setLead(data);
            } catch (err) {
                toast({ title: "Erreur", description: "Lead introuvable", variant: "destructive" });
                navigate('/leads/my');
            } finally {
                setLoading(false);
            }
        };
        loadLead();
    }, [id, navigate, toast]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-950">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
    );

    if (!lead) return null;

    // Gestion de la compatibilité des noms de colonnes (typo)
    // @ts-ignore
    const details = lead.score_details || lead.scrore_details;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <ClientSidebar />
            
            <main className="ml-64 p-8 min-h-screen">
                
                {/* --- HEADER : Navigation & Titre --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Button 
                            variant="ghost" 
                            className="pl-0 text-slate-400 hover:text-white hover:bg-transparent mb-1 h-auto py-1"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
                        </Button>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{lead.titre}</h1>
                        <div className="flex items-center gap-3 text-slate-400 text-sm mt-2">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                                <MapPin className="h-3.5 w-3.5 text-slate-500" /> {lead.ville}
                            </span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                                <Calendar className="h-3.5 w-3.5 text-slate-500" /> {new Date(lead.date_detection).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="border-slate-700 text-slate-300">
                                {lead.statut_prospection}
                            </Badge>
                        </div>
                    </div>
                    
                    <Button 
                        className="bg-white text-slate-950 hover:bg-slate-200 font-semibold shadow-lg shadow-white/5" 
                        asChild
                    >
                        <a href={lead.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Voir l'annonce
                        </a>
                    </Button>
                </div>

                {/* --- CONTENU PRINCIPAL --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 1. L'IMMOBILIER (Données brutes) */}
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                <Euro className="h-4 w-4" /> Données du Bien
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Loyer Mensuel</p>
                                <p className="text-3xl font-bold text-white tracking-tight">
                                    {lead.prix.toLocaleString()} €
                                </p>
                            </div>

                            <Separator className="bg-slate-800" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                                        <Maximize className="h-3 w-3" /> Surface
                                    </p>
                                    <p className="text-xl font-semibold text-slate-200">{lead.surface} m²</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                                        <Target className="h-3 w-3" /> Prix au m²
                                    </p>
                                    <p className="text-xl font-semibold text-slate-200">
                                        {Math.round(lead.prix / lead.surface)} €
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. LE FINANCIER (Analyse IA) */}
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-emerald-500 tracking-wider flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Performance Estimée
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Revenu LCD Potentiel</p>
                                <p className="text-3xl font-bold text-emerald-400 tracking-tight">
                                    {details ? Number(details.revenu_estime).toLocaleString() : '--'} €
                                </p>
                            </div>

                            <Separator className="bg-slate-800" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                                        <Hash className="h-3 w-3" /> Ratio Rentabilité
                                    </p>
                                    <p className="text-xl font-semibold text-white">
                                        x {details ? Number(details.ratio).toFixed(2) : '--'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> score IA
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-slate-500">score rentabilite</span>
                                        <span className="text-xl font-bold text-white">{details.score_rentabilite}</span>
                                        <span className="text-xs text-slate-500">/10</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-slate-500">score localisation</span>
                                        <span className="text-xl font-bold text-white">{details.score_localisation}</span>
                                        <span className="text-xs text-slate-500">/10</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-slate-500">score vérification</span>
                                        <span className="text-xl font-bold text-white">{details.score_verification}</span>
                                        <span className="text-xs text-slate-500">/10</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. LA QUALITÉ (Technique) */}
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden relative">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                <Camera className="h-4 w-4" /> Qualité & Localisation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-4">
                            
                            {/* Distance */}
                            <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                <span className="text-sm text-slate-400">Distance Centre</span>
                                <span className="font-bold text-white">{details?.distance_km ?? '--'} km</span>
                            </div>

                            {/* Photos */}
                            <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                <span className="text-sm text-slate-400">Photos disponibles</span>
                                <span className="font-bold text-white">{details?.nb_photos ?? 0}</span>
                            </div>

                            {/* Mots clés */}
                            <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                <span className="text-sm text-slate-400">Mots-clés LCD</span>
                                {details?.has_keywords ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-none">
                                        Présents
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-slate-800 text-slate-500">
                                        Absents
                                    </Badge>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
};

export default ShowLead;