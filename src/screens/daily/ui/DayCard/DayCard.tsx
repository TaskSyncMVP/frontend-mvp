import {DayCardProps} from "@/screens/daily/lib";

export function DayCard({ date, isActive = false, onClick }: DayCardProps) {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <div
            className={`rounded-lg flex flex-col gap-1.5 py-2 text-center min-w-0 cursor-pointer transition-colors ${
                isActive ? 'shadow-lg' : 'hover:bg-gray-50'
            }`}
            style={{
                width: 'calc(100vw / 5)',
                backgroundColor: isActive ? 'var(--primary)' : 'white',
                color: isActive ? 'white' : 'inherit',
            }}
            onClick={onClick}
        >
            <h3 className="text-xs font-normal">{month}</h3>
            <h3 className="text-base font-semibold">{day}</h3>
            <h3 className="text-xs font-normal">{weekday}</h3>
        </div>
    );
}
