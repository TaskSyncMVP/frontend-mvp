import {ResponsiveNavbar} from "@widgets/navbar";
import {AuthGuard} from "@features/auth";

export default function SiteLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard>
            <div className="">
                <ResponsiveNavbar/>
                <main className="pt-8 lg:pt-24 lg:px-[50px]">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
