'use client';

import { Skeleton } from '@/shared/ui';

export function SettingsPageSkeleton() {
    return (
        <div className="flex flex-col animate-pulse">

            <div className="flex justify-center lg:pt-24">
                <div className="grid grid-rows-2 gap-6 w-full max-w-xl lg:max-w-2xl">
                    <div>
                        <div className="rounded-xl border p-6 flex flex-col gap-4">
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-2/3 rounded-md" />
                            <Skeleton className="h-10 w-32 rounded-md mt-2" />
                        </div>
                    </div>

                    <div>
                        <div className="rounded-xl border p-6 flex flex-col gap-4">
                            <div className="grid grid-cols-3 gap-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-10 rounded-md"
                                    />
                                ))}
                            </div>

                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-32 rounded-md mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
