import {ResponsiveNavbar} from "@widgets/navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="">
         <ResponsiveNavbar/>
         <main className="pt-10 lg:pt-24 lg:px-[50px]">
             {children}
         </main>
     </div>
  );
}
