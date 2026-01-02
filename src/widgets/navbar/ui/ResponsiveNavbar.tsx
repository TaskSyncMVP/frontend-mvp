'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { DesktopNavbar } from './DesktopNavbar';
import { CreateTaskModal } from '@features/tasks';

export function ResponsiveNavbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="lg:hidden">
                <Navbar onModalToggle={() => setIsModalOpen(prev => !prev)} />
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