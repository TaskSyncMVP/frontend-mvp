'use client'

import {Plus, X, Check, Play} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {BarBackground} from "./BarBackground";
import {NavItem} from "./NavItem";
import {Button} from "@shared/ui";
import {NavbarProps} from "../props/navbar-props";

export function Navbar({onModalToggle, onSubmit}: NavbarProps = {}) {
    const pathname = usePathname();
    const router = useRouter();

    const getButtonConfig = () => {
        switch (pathname) {
            case '/menu':
                return {
                    icon: <X size='24px'/>,
                    onClick: () => router.back(),
                };
            case '/settings':
                return {
                    icon: <Check size='24px'/>,
                    onClick: onSubmit || (() => alert('Settings saved!')),
                };

            case '/pomodoro':
                return {
                    icon: <Play size='24px'/>,
                    onClick: () => router.back(),
                }
            default:
                return {
                    icon: <Plus size='24px'/>,
                    onClick: onModalToggle,
                    className: "bg-primary-100 text-white"
                };
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <>
            <div
                className="fixed inset-x-0 bottom-0 z-50 h-14 pb-[env(safe-area-inset-bottom)]">
                <BarBackground/>

                <div className="relative h-full flex items-center justify-between px-2">
                    <div className="flex-1 flex justify-around max-w-[40%] sm:gap-6 md:gap-8">
                        <NavItem iconType="home" href="/home"/>
                        <NavItem iconType="calendar" href="/time-blocking"/>
                    </div>
                    <div className="flex-1 flex justify-around max-w-[40%]  sm:gap-6 md:gap-8">
                        <NavItem iconType="document" href="/tasks"/>
                        <NavItem iconType="profile-2user" href="/menu"/>
                    </div>
                </div>

                {buttonConfig && (
                    <Button
                        size="icon"
                        onClick={buttonConfig.onClick}
                        className={`absolute left-1/2 -translate-x-1/2 -top-6 w-11 h-11 rounded-full
                        ${buttonConfig.className}
                        flex items-center justify-center
                        active:scale-95
                         shadow-extraLargeDrop
                         sm:w-16 sm:h-16 sm:-top-12
                         md:w-20 md:h-20 md:-top-16
                    `}
                    >
                        {buttonConfig.icon}
                    </Button>
                )}
            </div>
        </>
    )
}