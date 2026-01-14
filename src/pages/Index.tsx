import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { ZoneMap } from "@/components/dashboard/ZoneMap";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TrendingUp, Mail, MapPin, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Leads ce mois"
              value={47}
              change="+12%"
              changeType="positive"
              description="vs mois dernier"
              icon={TrendingUp}
            />
            <StatsCard
              title="Emails envoyés"
              value={128}
              change="+23%"
              changeType="positive"
              description="vs mois dernier"
              icon={Mail}
            />
            <StatsCard
              title="Zones actives"
              value={4}
              change="Lyon"
              changeType="neutral"
              description="exclusives"
              icon={MapPin}
            />
            <StatsCard
              title="Taux de réponse"
              value="18%"
              change="+3%"
              changeType="positive"
              description="vs mois dernier"
              icon={Target}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads Table - Takes 2 columns */}
            <div className="lg:col-span-2">
              <LeadsTable />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <ZoneMap />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-96 h-96 bg-success/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default Index;
