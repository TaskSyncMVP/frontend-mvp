'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import {NavItemProps} from "@widgets/navbar/navbar/navItem-props";

const iconMap = {
    'profile-2user': '/icon/actions/profile-2user.svg',
    'home': '/icon/actions/home.svg',
    'document': '/icon/actions/document.svg',
    'calendar': '/icon/actions/calendar.svg',
};


export function NavItem({ iconType }: NavItemProps) {
    const router = useRouter();

    const handleNavigation = () => {
        switch (iconType) {
            case 'home':
                router.push('/home');
                break;
            case 'calendar':
                router.push('/time-blocking');
                break;
            case 'document':
                router.push('/daily');
                break;
            case 'profile-2user':
                router.push('/menu');
                break;
        }
    };

    return (
        <button
            onClick={handleNavigation}
            className="w-10 h-10 flex items-center justify-center text-primary-100"
        >
            <Image
                src={iconMap[iconType]}
                alt={iconType}
                width={24}
                height={24}
                className="filter-primary"/>
        </button>
    )
}
