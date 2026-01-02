'use client';

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { iconMap, NavItemProps } from "../props/navItem-props";

export function DesktopNavItem({iconType, href, isActive = false}: NavItemProps) {
    return (
        <Link
            href={href}
            className={`flex justify-center items-center gap-3 px-3 py-2 rounded-lg ${
                isActive ? 'shadow-largeDrop' : ''
            }`}
        >
            <Image
                src={iconMap[iconType]}
                width={40}
                height={40}
                alt={iconMap[iconType]}
                className="transition-transform hover:scale-110 text-primary-100"
                style={{filter: 'brightness(0) saturate(100%) invert(25%) sepia(84%) saturate(650%) ' +
                        'hue-rotate(220deg) brightness(95%) contrast(95%)'}}
            />
        </Link>
    );
}

export function DesktopNavbar() {
    const pathname = usePathname();

    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-10 bg-primary-30 border
        border-primary-100/20 shadow-sm rounded-full max-w-sm
        ">
            <div className="px-8 py-3">
                <div className="flex items-center justify-between gap-6">
                    <nav className="flex items-center gap-6">
                        <DesktopNavItem iconType="home" href="/home" isActive={pathname === '/home'}/>
                        <DesktopNavItem iconType="calendar" href="/time-blocking" isActive={pathname === '/time-blocking'}/>
                        <DesktopNavItem iconType="document" href="/tasks" isActive={pathname === '/tasks'}/>
                        <DesktopNavItem iconType="profile-2user" href="/menu" isActive={pathname === '/menu'}/>
                    </nav>
                </div>
            </div>
        </div>
    );
}
