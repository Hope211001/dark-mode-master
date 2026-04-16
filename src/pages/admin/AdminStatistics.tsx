import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { zoneService } from "@/services/zones.services";
import { leadsService } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";

import { StatsOverview } from "./statistics/StatsOverview";
import { StatsBySource } from "./statistics/StatsBySource";
import { StatsGeneral } from "./statistics/StatsGeneral";
import { StatsPhone } from "./statistics/StatsPhone";
import { StatsByUser } from "./statistics/StatsByUser";
import { StatsByVille } from "./statistics/StatsByVille";

const AdminStatistics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Overview
  const [overview, setOverview] = useState({ totalLeads: 0, newLeads: 0, contactedLeads: 0, totalZones: 0, zonesLibres: 0, zonesVendues: 0 });

  // Source
  const [sourceCounts, setSourceCounts] = useState({ leboncoin: 0, pap: 0, seloger: 0 });

  // General (jour/mois)
  const [generalDaily, setGeneralDaily] = useState<any[]>([]);
  const [generalMonthly, setGeneralMonthly] = useState<any[]>([]);

  // Phone
  const [withPhone, setWithPhone] = useState(0);
  const [withoutPhone, setWithoutPhone] = useState(0);
  const [phoneDaily, setPhoneDaily] = useState<any[]>([]);
  const [phoneMonthly, setPhoneMonthly] = useState<any[]>([]);

  // User
  const [userStats, setUserStats] = useState<{ id: string; name: string; email: string; count: number }[]>([]);

  // Ville
  const [villeStats, setVilleStats] = useState<{ ville: string; count: number }[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [
        allLeads, newLeads, contactedLeads,
        countAll, countLibre, countVendu,
        lbc, pap, seloger,
        villes, users, timeStats,
        phoneYes, phoneNo, phoneTimeStats,
      ] = await Promise.all([
        leadsService.getAll({ page: 1, limit: 1 }),
        leadsService.getAll({ page: 1, limit: 1, statut: "new" }),
        leadsService.getAll({ page: 1, limit: 1, statut: "contacted" }),
        zoneService.getCountAllZone(),
        zoneService.getCountZoneLibre(),
        zoneService.getCountZoneVendu(),
        leadsService.getAll({ page: 1, limit: 1, categorie: "leboncoin" }),
        leadsService.getAll({ page: 1, limit: 1, categorie: "pap.fr" }),
        leadsService.getAll({ page: 1, limit: 1, categorie: "seloger" }),
        leadsService.getStatsByVille(),
        leadsService.getStatsByUser(),
        leadsService.getStats(),
        leadsService.getAll({ page: 1, limit: 1, phone: "with_phone" }),
        leadsService.getAll({ page: 1, limit: 1, phone: "without_phone" }),
        leadsService.getStatsByPhone(),
      ]);

      setOverview({
        totalLeads: allLeads.totalCount,
        newLeads: newLeads.totalCount,
        contactedLeads: contactedLeads.totalCount,
        totalZones: countAll,
        zonesLibres: countLibre,
        zonesVendues: countVendu,
      });

      setSourceCounts({
        leboncoin: lbc.totalCount,
        pap: pap.totalCount,
        seloger: seloger.totalCount,
      });

      const dailyTotals = timeStats.daily.map((d: any) => ({
        date: d.date,
        total: (d["leboncoin"] || 0) + (d["pap.fr"] || 0) + (d["seloger"] || 0),
      }));
      const monthlyTotals = timeStats.monthly.map((m: any) => ({
        month: m.month,
        total: (m["leboncoin"] || 0) + (m["pap.fr"] || 0) + (m["seloger"] || 0),
      }));
      setGeneralDaily(dailyTotals);
      setGeneralMonthly(monthlyTotals);

      setWithPhone(phoneYes.totalCount);
      setWithoutPhone(phoneNo.totalCount);
      setPhoneDaily(phoneTimeStats.daily);
      setPhoneMonthly(phoneTimeStats.monthly);

      setUserStats(users);
      setVilleStats(villes);
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de charger les statistiques", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 transition-[margin] duration-300">
        <Header title="Statistiques" subtitle="Vue d'ensemble des leads et zones" />

        <div className="p-4 md:p-6 space-y-6">
          <StatsOverview stats={overview} loading={loading} />
          <StatsBySource counts={sourceCounts} loading={loading} />
          <StatsGeneral daily={generalDaily} monthly={generalMonthly} loading={loading} />
          <StatsPhone withPhone={withPhone} withoutPhone={withoutPhone} daily={phoneDaily} monthly={phoneMonthly} loading={loading} />
          <StatsByUser data={userStats} loading={loading} />
          <StatsByVille data={villeStats} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default AdminStatistics;
