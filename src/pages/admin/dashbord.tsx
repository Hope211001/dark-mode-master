import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { ZoneMap } from "@/components/dashboard/ZoneMap";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TrendingUp, Mail, MapPin, Target } from "lucide-react";
import { zoneService, Zone } from "@/services/zones.services";
import { leadsService, Lead } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";

const dashbord = () => {
  const { toast } = useToast();

  // États pour les compteurs réels
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [totalZonesCount, setTotalZonesCount] = useState(0);
  const [zonesLibresCount, setZonesLibresCount] = useState(0);
  const [zonesVenduCount, setZonesVenduCount] = useState(0);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      
      // On lance tous les appels en parallèle pour la performance
      const [leadsRes, countAll, countLibre, countVendu] = await Promise.all([
        // Attention : j'utilise getMyLeads pour éviter la 404 si tu n'es pas admin
        leadsService.getAll({ page: 1, limit: 4 }),
        zoneService.getCountAllZone(),
        zoneService.getCountZoneLibre(),
        zoneService.getCountZoneVendu()
      ]);

      setTotalLeadsCount(leadsRes.totalCount);
      setTotalZonesCount(countAll);
      setZonesLibresCount(countLibre);
      setZonesVenduCount(countVendu);

    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 transition-[margin] duration-300">
        <Header />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Leads"
              value={totalLeadsCount}
              change="Total détectés"
              icon={TrendingUp}
            />
            <StatsCard
              title="Zones"
              value={totalZonesCount}
              change="Villes couvertes"
              changeType="positive"
              icon={Mail}
            />
            <StatsCard
              title="Zones libres"
              value={zonesLibresCount}
              change="Disponibles"
              changeType="neutral"
              icon={MapPin}
            />
            <StatsCard
              title="Zones vendues"
              value={zonesVenduCount}
              change="Sous contrat"
              changeType="positive"
              icon={Target}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="lg:col-span-2">
              {/* Le tableau gère sa propre pagination en interne */}
              <LeadsTable /> 
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default dashbord;
