'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { DesktopNavbar } from './DesktopNavbar';
import { CreateTaskModal } from '@features/tasks';

export function ResponsiveNavbar() {
    const [isDesktop, setIsDesktop] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (isDesktop) {
        return <DesktopNavbar />;
    }

    return (
        <>
            <Navbar onModalToggle={() => setIsModalOpen(prev => !prev)} />
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}