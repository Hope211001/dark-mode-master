import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ClientStatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export function ClientStatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  description,
  icon: Icon,
  highlight = false,
}: ClientStatsCardProps) {
  return (
    <Card className={cn(
      "glass-card transition-all duration-300 hover:border-primary/30",
      highlight && "border-primary/50 glow-effect"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground mono">{value}</span>
              {change && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    changeType === "positive" && "text-success",
                    changeType === "negative" && "text-destructive",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            highlight ? "bg-primary/20" : "bg-secondary"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              highlight ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
