import Image from 'next/image';


export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center">
            <div className="w-full max-w-md relative lg:mt-32">
                <div className="absolute left-[35%] top-[18.5%]">
                    <Image
                        src="/female-with-notebook.svg"
                        width={159}
                        height={184}
                        alt="Female with notebook"
                    />
                </div>

                <div className="absolute top-[9%] left-[20%]">
                    <Image
                        src="/clock.svg"
                        width={40}
                        height={50}
                        alt="Clock icon"
                    />
                </div>

                <div className="absolute top-[24%] left-[19%]">
                    <Image
                        src="/pie-chart.svg"
                        width={26}
                        height={26}
                        alt="Pie chart icon"
                    />
                </div>

                <div className="absolute top-[17%] right-[10%]">
                    <Image
                        src="/calendar.svg"
                        width={32}
                        height={27}
                        alt="Calendar icon"
                    />
                </div>

                <div className="absolute top-[28%] right-[12%]">
                    <Image
                        src="/notifications.svg"
                        width={62}
                        height={42}
                        alt="Notifications icon"
                    />
                </div>

                <div className="absolute top-[35%] left-[25%]">
                    <Image
                        src="/vase.svg"
                        width={36}
                        height={52}
                        alt="Vase icon"
                    />
                </div>

                <div className="absolute top-[39%] left-[21%]">
                    <Image
                        src="/coffee.svg"
                        width={16}
                        height={22}
                        alt="Coffee icon"
                    />
                </div>

                {/* Контент формы */}
                <div className="relative z-10 flex flex-col justify-center  mt-[32rem] mb-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
