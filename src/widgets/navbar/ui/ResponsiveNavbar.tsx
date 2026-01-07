'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { DesktopNavbar } from './DesktopNavbar';
import { CreateTaskModal } from '@features/tasks';

export function ResponsiveNavbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();

    const handleSettingsSubmit = () => {
        window.dispatchEvent(new CustomEvent('navbar:settings-submit'));
    };

    return (
        <>
            <div className="lg:hidden">
                <Navbar
                    onModalToggle={() => setIsModalOpen(prev => !prev)}
                    onSubmit={pathname === '/settings' ? handleSettingsSubmit : undefined}
                />
                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    variant="default"
                />
            </div>

            <div className="hidden lg:block">
                <DesktopNavbar />
            </div>
        </>
    );
}