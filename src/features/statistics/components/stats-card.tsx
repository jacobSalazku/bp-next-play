import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/foundation/card";
import { cn } from "@/utils/tw-merge";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
};

export function StatisticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-orange-200",
}: StatCardProps) {
  return (
    <Card className="border-gray-800 bg-gray-950 backdrop-blur-sm transition-all duration-300 hover:bg-gray-900/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        {Icon && <Icon className={cn(iconColor, "h-5 w-5")} />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
