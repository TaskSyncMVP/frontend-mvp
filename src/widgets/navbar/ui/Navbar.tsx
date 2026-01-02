import { Plus } from "lucide-react";
import { BarBackground } from "./BarBackground";
import { NavItem } from "./NavItem";
import { Button } from "@shared/ui";
import { NavbarProps } from "../props/navbar-props";

export function Navbar({ onModalToggle }: NavbarProps = {}) {
    return (
        <>
            <div className="fixed inset-x-0 bottom-0 z-50 h-16 pb-[env(safe-area-inset-bottom)] sm:h-14">
                <BarBackground/>

                <div className="relative h-full flex items-center justify-between px-4 sm:px-8">
                    <div className="flex-1 flex justify-around max-w-[40%] sm:gap-6 md:gap-8">
                        <NavItem iconType="home" href="/home" />
                        <NavItem iconType="calendar" href="/time-blocking" />
                    </div>

                    <Button
                        size="icon"
                        onClick={onModalToggle}
                        className="absolute left-1/2 -translate-x-1/2 -top-6
                        w-12 h-12 rounded-full
                        bg-primary-100 text-white
                        flex items-center justify-center
                        active:scale-95
                        shadow-extraLargeDrop
                        sm:-top-11 sm:w-16 sm:h-16
                        md:-top-16 md:w-20 md:h-20
                        z-10"
                    >
                        <Plus className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                    </Button>

                    <div className="flex-1 flex justify-around max-w-[40%]  sm:gap-6 md:gap-8">
                        <NavItem iconType="document" href="/tasks" />
                        <NavItem iconType="profile-2user" href="/menu" />
                    </div>
                </div>
            </div>
        </>
    );
}