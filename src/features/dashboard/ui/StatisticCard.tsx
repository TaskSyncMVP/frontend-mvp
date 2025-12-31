import { cn } from "@/lib/utils";
import {StatisticCardProps, StatisticCardVariant} from "@features/dashboard/lib/statisticsCard-props";

const variantStyles: Record<StatisticCardVariant, string> = {
    primary: "bg-primary-100 text-white",
    secondary: "bg-white text-text-main"
};

export function StatisticCard({
    className,
    children,
    variant = "secondary",
    title,
    value
}: StatisticCardProps) {
    const textColor = variant === 'primary' ? 'text-white' : 'text-text-main';

    return (
        <div className={cn("p-3 rounded-lg 2xl:p-6 xl:p-4 shadow", variantStyles[variant], className)}>
            {children ? (
                children
            ) : (
                <>
                    {title && (
                        <h3 className={cn("text-sm 2xl:text-lg xl:text-base font-regular", textColor)}>
                            {title}
                        </h3>
                    )}
                    {value !== undefined && (
                        <p className={cn("text-xl 2xl:text-6xl xl:text-5xl font-semibold", textColor)}>
                            {value}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
