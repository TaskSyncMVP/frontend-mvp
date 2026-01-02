import { Plus } from "lucide-react";

import { BarBackground } from "./BarBackground";
import { NavItem } from "./NavItem";
import { Button } from "@shared/ui";
import { NavbarProps } from "../props/navbar-props";

export function Navbar({ onModalToggle }: NavbarProps = {}) {

    return (
        <>
            <div className="fixed inset-x-0 bottom-0 z-50 h-14">
                <BarBackground/>

                <div className="relative h-full flex items-center justify-between px-8">
                    <div className="flex gap-8">
                        <NavItem iconType="home" href="/home" />
                        <NavItem iconType="calendar" href="/time-blocking" />
                    </div>
                    <div className="flex gap-8">
                        <NavItem iconType="document" href="/daily" />
                        <NavItem iconType="profile-2user" href="/menu" />
                    </div>
                </div>

                <Button
                    size="icon"
                    onClick={onModalToggle}
                    className="absolute left-1/2 -translate-x-1/2 -top-6 w-11 h-11 rounded-full
                    bg-primary-100 text-white
                    flex items-center justify-center
                    active:scale-95
                    shadow-largeDrop
                "
                >
                    <Plus size='24px'/>
                </Button>
            </div>
        </>
    )
}