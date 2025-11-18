import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "neutral" | "negative";
  iconColor?: string;
}

export function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  changeType = "neutral",
  iconColor = "text-primary"
}: MetricCardProps) {
  return (
    <Card className="p-6 border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={cn("h-4 w-4", iconColor)} />
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          {change && (
            <p className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-metric-positive",
              changeType === "neutral" && "text-metric-neutral",
              changeType === "negative" && "text-destructive"
            )}>
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
