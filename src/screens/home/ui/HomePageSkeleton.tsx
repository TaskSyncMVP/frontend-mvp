'use client';

import { Skeleton } from '@shared/ui';

export function HomePageSkeleton() {
    return (
        <div className="min-h-screen flex flex-col gap-4 sm:gap-5 md:gap animate-pulse">
            <div className="flex flex-row gap-4 lg:absolute lg:left-15 lg:top-12 items-center">
                <Skeleton className="h-[46px] w-[46px] rounded-full" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-6 2xl:gap-8 lg:mt-12">
                <div className="lg:self-start">
                    <Skeleton className="h-5 w-28 mb-4" />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl border p-4 flex flex-col gap-2"
                            >
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-6 w-10" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:max-w-sm lg:w-full lg:justify-self-center">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>

                    <div className="flex flex-col gap-4 md:columns-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="break-inside-avoid rounded-xl border p-4 flex flex-col gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-4 rounded-sm" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>

                                <Skeleton className="h-3 w-1/2" />

                                <div className="flex justify-between items-center mt-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-6 w-6 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
