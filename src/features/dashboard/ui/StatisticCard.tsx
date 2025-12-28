import { cn } from "@/lib/utils";
import {StatisticCardProps} from "@features/dashboard/lib/statisticsCard-props";

export function StatisticCard({ className, children }: StatisticCardProps) {
    return (
        <div className={cn("px-3 py-3 rounded-lg shadow", className)}>
            {children}
        </div>
    );
}
