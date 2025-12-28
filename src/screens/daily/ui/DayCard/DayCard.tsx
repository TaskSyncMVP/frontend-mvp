import {DayCardProps} from "@/screens/daily/lib";

export function DayCard({ month, day, weekday, isActive = false }: DayCardProps) {
    return (
        <div className="rounded-lg flex flex-col gap-1.5 py-2 text-center min-w-0"
             style={{
                 width: 'calc(100vw / 5)',
                 backgroundColor: isActive ? 'var(--primary)' : 'white',
                 color: isActive ? 'white' : 'inherit',
             }}
        >
            <h3 className="text-xs font-normal">{month}</h3>
            <h3 className="text-base font-semibold">{day}</h3>
            <h3 className="text-xs font-normal">{weekday}</h3>
        </div>
    );
}
