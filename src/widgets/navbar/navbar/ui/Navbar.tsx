'use client';

import { useState } from 'react';
import { Plus } from "lucide-react";

import {BarBackground} from "@widgets/navbar/navbar/ui/BarBackground";
import {NavItem} from "@widgets/navbar/navbar/ui/NavItem";
import {Button} from "@shared/ui";
import {CreateTaskModal} from "@features/tasks";

export function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="fixed inset-x-0 bottom-0 z-50 h-14 pb-[env(safe-area-inset-bottom)]">
                <BarBackground/>

                <div className="relative h-full flex items-center justify-between px-8">
                    <div className="flex gap-8">
                        <NavItem iconType="home"/>
                        <NavItem iconType="calendar"/>
                    </div>
                    <div className="flex gap-8">
                        <NavItem iconType="document"/>
                        <NavItem iconType="profile-2user"/>
                    </div>
                </div>

                <Button
                    size="icon"
                    onClick={() => setIsModalOpen(true)}
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

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
