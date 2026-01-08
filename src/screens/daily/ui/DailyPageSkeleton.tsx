'use client';

import { Skeleton } from '@/shared/ui';

export function DailyPageSkeleton() {
    return (
        <>
            <div className="flex flex-col gap-7 animate-pulse">
                <div className="-mx-4 flex justify-center">
                    <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[64px] h-[72px] rounded-xl border p-2 flex flex-col items-center justify-center gap-2"
                            >
                                <Skeleton className="h-3 w-6" />
                                <Skeleton className="h-5 w-8" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-9 rounded-md"
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
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
                </div>
            </div>
        </>
    );
}
