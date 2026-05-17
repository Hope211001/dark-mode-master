import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Clock, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { leadsService, Lead } from "@/services/leads.service";
import { useToast } from "@/components/ui/use-toast";

const categorieConfig: Record<string, { label: string; className: string }> = {
  "leboncoin": { label: "Leboncoin", className: "bg-orange-500/20 text-orange-400" },
};

const defaultCategorieStyle = "bg-violet-500/20 text-violet-400";

function ScoreBadge({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-success bg-success/20 border-success/30";
    if (score >= 8) return "text-primary bg-primary/20 border-primary/30";
    if (score >= 7) return "text-warning bg-warning/20 border-warning/30";
    return "text-muted-foreground bg-muted border-border";
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold",
      getScoreColor(score)
    )}>
      <TrendingUp className="w-3.5 h-3.5" />
      {score?.toFixed(1) || "0.0"}
    </div>
  );
}

export function LeadsTable() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestLeads();
  }, []);

  const fetchLatestLeads = async () => {
    try {
      setLoading(true);
      const response = await leadsService.getAll({ page: 1, limit: 3, sort: 'desc' });
      setLeads(response.data);
    } catch (error) {
      console.error("Erreur fetchLeads:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les derniers leads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Derniers Leads</h2>
            <p className="text-sm text-muted-foreground">Les opportunités les plus récentes</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/leads')}>
            Voir tout
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Annonce</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Catégorie</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Score</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Loyer</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Date de détéction</th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Détail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Chargement des leads...</p>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                  Aucun lead trouvé.
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className="hover:bg-muted/20 transition-colors animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground line-clamp-1">{lead.titre}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{lead.ville}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{lead.surface}m²</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.categorie_scraping ? (
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                        categorieConfig[lead.categorie_scraping]?.className || defaultCategorieStyle
                      )}>
                        {categorieConfig[lead.categorie_scraping]?.label || lead.categorie_scraping}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={lead.score} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-foreground">{lead.prix?.toLocaleString()}€</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(lead.date_detection)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/leads/${lead.id}`); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
