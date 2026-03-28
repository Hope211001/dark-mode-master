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
    Camera,
    Hash,
    CheckCircle2,
    User,
    Phone,
    Map as MapIcon,
    UserCheck,
    FileText,
    Info
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
    const [lead, setLead] = useState<any | null>(null); // Utilisation de any pour accepter les nouveaux champs Supabase
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

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'nouveau': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'en_cours': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            'qualifié': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'non_qualifié': 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return colors[status?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <ClientSidebar />

            <main className="ml-64 p-8 min-h-screen max-w-[1400px]">

                {/* --- HEADER --- */}
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
                                    <Hash className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-3xl font-bold text-white tracking-tight">{lead.titre}</h1>
                                        <Badge variant="outline" className="border-slate-700 text-slate-500">ID: {lead.lbc_id}</Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 text-sm">
                                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                            {lead.ville}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 text-sm">
                                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                            {new Date(lead.date_detection).toLocaleDateString('fr-FR')}
                                        </span>
                                        <Badge className={`${getStatusColor(lead.status)} font-medium px-3 py-1 uppercase text-[10px]`}>
                                            {lead.status || 'Indéfini'}
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
                                Voir l'annonce originale
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLONNE GAUCHE : INFOS PRINCIPALES */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* CARD DESCRIPTION */}
                        <Card className="bg-slate-900 border-slate-800 shadow-xl">
                            <CardHeader className="border-b border-slate-800/50">
                                <CardTitle className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-400" />
                                    Description de l'annonce
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {lead.description || "Aucune description fournie."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* GRILLE INFOS TECHNIQUES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* PROPRIÉTAIRE & CONTACT */}
                            <Card className="bg-slate-900 border-slate-800 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2">
                                        <User className="h-4 w-4 text-violet-400" />
                                        Contact Propriétaire
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                                        <span className="text-sm text-slate-400">Nom</span>
                                        <span className="font-semibold text-slate-100">{lead.ownr_name || "Non renseigné"}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                                        <span className="text-sm text-slate-400">Téléphone</span>
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                            <Phone className="h-4 w-4" />
                                            {lead.phone || "Indisponible"}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* MÉTADONNÉES SYSTÈME */}
                            <Card className="bg-slate-900 border-slate-800 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold uppercase text-slate-400 flex items-center gap-2">
                                        <Info className="h-4 w-4 text-amber-400" />
                                        Assignation & Zone
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* AFFICHAGE DU NOM DE LA ZONE */}
                                    <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <MapIcon className="h-4 w-4" /> Zone
                                        </div>
                                        <span className="font-semibold text-sm text-blue-400">
                                            {lead.zones?.nom || "Non définie"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* COLONNE DROITE : CHIFFRES CLÉS & SCORE */}
                    <div className="space-y-6">

                        {/* CARD PRIX / SURFACE */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                            <CardContent className="pt-6 space-y-6">
                                <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Prix du bien</p>
                                    <p className="text-4xl font-black text-white">
                                        {lead.prix?.toLocaleString('fr-FR')} €
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                                            <Maximize className="h-3 w-3" /> Surface
                                        </p>
                                        <p className="text-xl font-bold text-slate-100">{lead.surface} m²</p>
                                    </div>
                                    <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Prix m²</p>
                                        <p className="text-xl font-bold text-slate-100">
                                            {lead.surface > 0 ? Math.round(lead.prix / lead.surface) : 0} €
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARD SCORE IA */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Analyse de Rentabilité
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col items-center justify-center py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                    <span className="text-5xl font-black text-emerald-400">{lead.score || 0}</span>
                                    <span className="text-emerald-500/50 text-xs font-bold uppercase mt-2">Score Global / 100</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Potentiel LCD</span>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-bold">Excellent</Badge>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${lead.score}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShowLead;