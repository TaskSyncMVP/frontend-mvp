import { Skeleton } from "@shared/ui";

export function PomodoroPageSkeleton() {
    return (
        <div className="flex flex-col items-center gap-6 justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
                <Skeleton className="h-6 w-32 mb-2" />
            </div>

            <div className="relative">
                <Skeleton className="h-56 w-56 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="h-10 w-20" />
                </div>
            </div>

            <div className="flex flex-row gap-2">
                {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="h-6 w-6 rounded-soft" />
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
            </div>

            <div className="text-center space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
            </div>
        </div>
    );
}