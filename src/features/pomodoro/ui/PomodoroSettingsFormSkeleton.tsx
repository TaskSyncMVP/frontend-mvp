import { Skeleton } from "@shared/ui";

export function PomodoroSettingsFormSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="col-span-2">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
}