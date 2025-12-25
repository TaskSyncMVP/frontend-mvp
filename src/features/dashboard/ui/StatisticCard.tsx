import { cn } from "@/lib/utils";

interface StatisticCardProps {
    className?: string;
    children: React.ReactNode;
}

export function StatisticCard({ className, children }: StatisticCardProps) {
    return (
        <div className={cn("px-3 py-3 rounded-lg shadow", className)}>
            {children}
        </div>
    );
}
