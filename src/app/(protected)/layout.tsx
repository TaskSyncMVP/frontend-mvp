'use client';

import { ResponsiveNavbar } from '@widgets/navbar';
import { AuthGuard } from '@features/auth';

export default function SiteLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <LayoutShell>{children}</LayoutShell>
        </AuthGuard>
    );
}

function LayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <ResponsiveNavbar />
            <main className="pt-8 lg:pt-24 lg:px-[50px] flex-1">
                {children}
            </main>
        </div>
    );
}
