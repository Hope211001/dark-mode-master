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
    XCircle,
    Building2
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

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'nouveau': 'bg-blue-500/5 text-blue-400 border-blue-500/20',
            'en_cours': 'bg-amber-500/5 text-amber-400 border-amber-500/20',
            'qualifié': 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20',
            'non_qualifié': 'bg-red-500/5 text-red-400 border-red-500/20',
        };
        return colors[status] || 'bg-slate-500/5 text-slate-400 border-slate-500/20';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <ClientSidebar />
            
            <main className="ml-64 p-8 min-h-screen max-w-[1400px]">
                
                {/* --- HEADER : Navigation & Titre --- */}
                <div className="mb-10">
                    <Button 
                        variant="ghost" 
                        className="pl-0 text-slate-400 hover:text-slate-200 hover:bg-transparent mb-4 h-auto py-1.5 -ml-2"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> 
                        <span className="text-sm font-medium">Retour à la liste</span>
                    </Button>
                    
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                                    <Building2 className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">{lead.titre}</h1>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 text-sm">
                                            <MapPin className="h-3.5 w-3.5 text-slate-500" /> 
                                            {lead.ville}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 text-sm">
                                            <Calendar className="h-3.5 w-3.5 text-slate-500" /> 
                                            {new Date(lead.date_detection).toLocaleDateString('fr-FR', { 
                                                day: 'numeric', 
                                                month: 'long', 
                                                year: 'numeric' 
                                            })}
                                        </span>
                                        <Badge className={`${getStatusColor(lead.statut_prospection)} font-medium px-3 py-1`}>
                                            {lead.statut_prospection.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Button 
                            className="bg-white text-slate-950 hover:bg-slate-100 font-semibold shadow-lg shadow-white/5 px-6 h-11" 
                            asChild
                        >
                            <a href={lead.url} target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> 
                                Voir l'annonce
                            </a>
                        </Button>
                    </div>
                </div>

                {/* --- CONTENU PRINCIPAL --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* 1. L'IMMOBILIER (Données brutes) */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800 shadow-2xl overflow-hidden relative backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500/5 rounded">
                                    <Euro className="h-3.5 w-3.5 text-blue-400" />
                                </div>
                                Données du Bien
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            
                            <div className="bg-slate-950/40 rounded-xl p-5 border border-slate-800/50">
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Loyer Mensuel</p>
                                <p className="text-4xl font-bold text-white tracking-tight">
                                    {lead.prix.toLocaleString('fr-FR')} <span className="text-2xl text-slate-400">€</span>
                                </p>
                            </div>

                            <Separator className="bg-slate-800/50" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/50">
                                    <p className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1.5">
                                        <Maximize className="h-3.5 w-3.5" /> 
                                        Surface
                                    </p>
                                    <p className="text-2xl font-bold text-slate-100">
                                        {lead.surface} <span className="text-sm text-slate-400">m²</span>
                                    </p>
                                </div>
                                <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/50">
                                    <p className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1.5">
                                        <Target className="h-3.5 w-3.5" /> 
                                        Prix au m²
                                    </p>
                                    <p className="text-2xl font-bold text-slate-100">
                                        {Math.round(lead.prix / lead.surface)} <span className="text-sm text-slate-400">€</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. LE FINANCIER (Analyse IA) */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800 shadow-2xl overflow-hidden relative backdrop-blur-sm group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-500" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-bold uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-500/5 rounded">
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                                </div>
                                Performance Estimée
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            
                            <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
                                <p className="text-emerald-300/70 text-xs font-medium uppercase tracking-wide mb-2">Revenu LCD Potentiel</p>
                                <p className="text-4xl font-bold text-emerald-400 tracking-tight">
                                    {details ? Number(details.revenu_estime).toLocaleString('fr-FR') : '--'} <span className="text-2xl text-emerald-400/60">€</span>
                                </p>
                            </div>

                            <Separator className="bg-slate-800/50" />

                            <div className="space-y-4">
                                <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/50">
                                    <p className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1.5">
                                        <Hash className="h-3.5 w-3.5" /> 
                                        Ratio Rentabilité
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        x {details ? Number(details.ratio).toFixed(2) : '--'}
                                    </p>
                                </div>
                                
                                <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/50">
                                    <p className="text-slate-400 text-xs font-medium mb-3 flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> 
                                        Scores IA
                                    </p>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400 font-medium">Rentabilité</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-white">{details?.score_rentabilite ?? '--'}</span>
                                                <span className="text-xs text-slate-500">/5</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400 font-medium">Localisation</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-white">{details?.score_localisation ?? '--'}</span>
                                                <span className="text-xs text-slate-500">/5</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400 font-medium">Vérification</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-white">{details?.score_verification ?? '--'}</span>
                                                <span className="text-xs text-slate-500">/5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. LA QUALITÉ (Technique) */}
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800 shadow-2xl overflow-hidden relative backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <div className="p-1.5 bg-violet-500/5 rounded">
                                    <Camera className="h-3.5 w-3.5 text-violet-400" />
                                </div>
                                Qualité & Localisation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            
                            {/* Distance */}
                            <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-lg border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                <span className="text-sm text-slate-400 font-medium">Distance Centre</span>
                                <span className="font-bold text-white text-lg">
                                    {details?.distance_km ?? '--'} <span className="text-sm text-slate-400">km</span>
                                </span>
                            </div>

                            {/* Photos */}
                            <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-lg border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                <span className="text-sm text-slate-400 font-medium">Photos disponibles</span>
                                <div className="flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-slate-500" />
                                    <span className="font-bold text-white text-lg">{details?.nb_photos ?? 0}</span>
                                </div>
                            </div>

                            {/* Mots clés */}
                            <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-lg border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                <span className="text-sm text-slate-400 font-medium">Mots-clés LCD</span>
                                {details?.has_keywords ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30 font-semibold px-3 py-1">
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                        Présents
                                    </Badge>
                                ) : (
                                    <Badge className="bg-slate-800 text-slate-400 hover:bg-slate-800 border-slate-700 font-semibold px-3 py-1">
                                        <XCircle className="h-3.5 w-3.5 mr-1" />
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