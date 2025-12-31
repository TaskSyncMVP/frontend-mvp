export type StatisticCardVariant = 'primary' | 'secondary';

export interface StatisticCardProps {
    className?: string;
    children?: React.ReactNode;
    variant?: StatisticCardVariant;
    title?: string;
    value?: string | number;
}
