'use client';

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "@/features/auth";
import {Toaster} from "@/shared/ui";
import {useMemo} from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                retry: 1,
            },
        },
    }), []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
            <Toaster />
        </QueryClientProvider>
    );
}