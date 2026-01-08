'use client';

import { Skeleton } from '@/shared/ui';

export function TasksPageSkeleton() {
    return (
        <>
            <div className="flex flex-col pt-16 gap-6 animate-pulse">
                <div className="overflow-x-auto pb-4 -mx-8">
                    <div className="flex gap-6 p-4 min-w-max -ml-2">
                        {[...Array(4)].map((_, dayIndex) => (
                            <div
                                key={dayIndex}
                                className="flex flex-col gap-4 w-80 shrink-0"
                            >
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-28" />
                                    {dayIndex === 0 && (
                                        <Skeleton className="h-6 w-6 rounded-md" />
                                    )}
                                </div>

                                <div className="flex flex-col gap-5">
                                    {[...Array(3)].map((_, taskIndex) => (
                                        <div
                                            key={taskIndex}
                                            className="rounded-xl border p-4 flex flex-col gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-4 w-4 rounded-sm" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>

                                            <Skeleton className="h-3 w-1/2" />

                                            <div className="flex justify-between items-center mt-2">
                                                <Skeleton className="h-3 w-20" />
                                                <Skeleton className="h-6 w-6 rounded-md" />
                                            </div>
                                        </div>
                                    ))}

                                    <Skeleton className="h-10 w-full rounded-md mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
