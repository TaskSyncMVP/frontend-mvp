import Image from "next/image";

import {Button} from "@shared/ui/button";

import {PageHeaderProps} from "@widgets/pageHeader";


export function PageHeader({ title }: PageHeaderProps) {
    return (
        <>
            <div className="lg:hidden">
                <div className="max-w-7xl mx-auto">
                    <div className='flex flex-row justify-between items-center'>
                        <Button size="icon" variant="icon" className="rotate-180">
                            <Image
                                src="/icon/actions/arrow.svg"
                                alt="arrow"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                        </Button>
                        <h1 className="text-base font-semibold text-center absolute left-1/2 transform -translate-x-1/2">{title}</h1>
                        <Button size="icon" variant="icon">
                            <Image
                                src="/icon/actions/notification.svg"
                                alt="notification"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                        </Button>
                    </div>
                </div>
            </div>

            <div className='hidden lg:flex lg:items-center lg:gap-4 lg:fixed lg:top-12 lg:left-[50px] lg:z-20'>
                <Button size="icon" variant="icon" className="rotate-180">
                    <Image
                        src="/icon/actions/arrow.svg"
                        alt="arrow"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                    />
                </Button>
            </div>

            <div className='hidden lg:block lg:h-16'></div>

            <div className='hidden lg:flex lg:items-center lg:fixed lg:top-12 lg:right-[50px] lg:z-20'>
                <Button size="icon" variant="icon">
                    <Image
                        src="/icon/actions/notification.svg"
                        alt="notification"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                    />
                </Button>
            </div>

            <div className='hidden lg:block lg:-mt-32 lg:-ml-4'>
                <h1 className="text-xl font-semibold">{title}</h1>
            </div>
        </>
    );
}
