import { useEffect, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { LeadCard } from "@/components/client/LeadCard";
import {
  Mail, MapPin, Loader2, Sparkles, ChevronRight,
  Target, BarChart3, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { zoneService } from "@/services/zones.services";
import { leadsService, Lead } from "@/services/leads.service";
import ErrorAlert from "@/components/alert/error";
import SuccessAlert from "@/components/alert/success";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  zonesCount: number;
}

const ClientDashboard = () => {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    zonesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [allRes, newRes, contactedRes, zonesRes] = await Promise.all([
        leadsService.getMyLeads({ page: 1, limit: 4, sort: 'desc', exclude_statut: 'rejected' }),
        leadsService.getMyLeads({ page: 1, limit: 1, statut: 'new' }),
        leadsService.getMyLeads({ page: 1, limit: 1, statut: 'contacted' }),
        zoneService.getMyZones(),
      ]);

      setRecentLeads(allRes.data || []);
      setStats({
        totalLeads: allRes.totalCount || 0,
        newLeads: newRes.totalCount || 0,
        contactedLeads: contactedRes.totalCount || 0,
        zonesCount: Array.isArray(zonesRes) ? zonesRes.length : 0,
      });
    } catch {
      setErrorAlert({ visible: true, message: "Erreur lors du chargement du tableau de bord." });
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: "success" | "error", message: string) => {
    if (type === "success") setSuccessAlert({ visible: true, message });
    else setErrorAlert({ visible: true, message });
  };

  const statCards = [
    {
      label: "Total Leads",
      value: stats.totalLeads,
      subtitle: "tous statuts confondus",
      icon: BarChart3,
      gradient: "from-primary/20 via-slate-900/90 to-slate-900/90",
      border: "border-primary/30",
      shadow: "shadow-primary/10 hover:shadow-primary/20",
      iconBg: "bg-primary/10 border-primary/30",
      iconColor: "text-primary",
      glow: "bg-primary/30",
      badgeColor: "text-primary bg-primary/10",
    },
    {
      label: "Nouveaux",
      value: stats.newLeads,
      subtitle: "en attente de contact",
      icon: Sparkles,
      gradient: "from-amber-500/20 via-slate-900/90 to-slate-900/90",
      border: "border-amber-500/30",
      shadow: "shadow-amber-500/10 hover:shadow-amber-500/20",
      iconBg: "bg-amber-500/10 border-amber-500/30",
      iconColor: "text-amber-400",
      glow: "bg-amber-500/30",
      badgeColor: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Contactés",
      value: stats.contactedLeads,
      subtitle: "messages envoyés",
      icon: Mail,
      gradient: "from-violet-500/20 via-slate-900/90 to-slate-900/90",
      border: "border-violet-500/30",
      shadow: "shadow-violet-500/10 hover:shadow-violet-500/20",
      iconBg: "bg-violet-500/10 border-violet-500/30",
      iconColor: "text-violet-400",
      glow: "bg-violet-500/30",
      badgeColor: "text-violet-400 bg-violet-500/10",
    },
    {
      label: "Mes Zones",
      value: stats.zonesCount,
      subtitle: "zones actives",
      icon: MapPin,
      gradient: "from-emerald-500/20 via-slate-900/90 to-slate-900/90",
      border: "border-emerald-500/30",
      shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/20",
      iconBg: "bg-emerald-500/10 border-emerald-500/30",
      iconColor: "text-emerald-400",
      glow: "bg-emerald-500/30",
      badgeColor: "text-emerald-400 bg-emerald-500/10",
    },
  ];

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
        <ClientHeader
          title="Tableau de bord"
          subtitle="Aperçu de vos leads et zones"
        />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {statCards.map((s) => (
              <Card
                key={s.label}
                className={`relative overflow-hidden bg-gradient-to-br ${s.gradient} backdrop-blur-xl border ${s.border} shadow-2xl ${s.shadow} transition-all duration-300 group`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 md:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] md:text-xs font-medium text-slate-400 uppercase tracking-wide">{s.label}</p>
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                        {loading ? ".." : s.value}
                      </h3>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1 truncate">{s.subtitle}</p>
                    </div>
                    <div className="relative shrink-0 ml-2">
                      <div className={`absolute inset-0 ${s.glow} rounded-xl blur-xl animate-pulse`} />
                      <div className={`relative p-2.5 md:p-3 ${s.iconBg} rounded-xl border`}>
                        <s.icon className={`h-4 w-4 md:h-5 md:w-5 ${s.iconColor}`} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Leads */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-foreground">
                    Leads récents
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Les 4 dernières opportunités détectées
                  </p>
                </div>
              </div>
              <Link to="/client/leads">
                <Button size="sm" className="gap-2 font-semibold">
                  Voir plus
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="animate-spin text-primary h-10 w-10 mb-3" />
                <p className="text-sm text-muted-foreground">Chargement...</p>
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
                <div className="mx-auto w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-foreground font-semibold mb-1">Aucun lead pour le moment</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Nos algorithmes scannent vos zones en continu. Vous serez notifié dès qu'une opportunité apparaît.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Détection active
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onStatusChange={fetchDashboard}
                    onAlert={showAlert}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
