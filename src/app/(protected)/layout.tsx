import {ResponsiveNavbar} from "@widgets/navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="mt-6 lg:mt-32 lg:px-[50px] lg:pt-[50px]">
         {children}
         <ResponsiveNavbar/>
     </div>
  );
}
