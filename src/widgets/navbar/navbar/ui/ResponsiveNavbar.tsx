'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { DesktopNavbar } from './DesktopNavbar';

export function ResponsiveNavbar() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return isDesktop ? <DesktopNavbar /> : <Navbar />;
}
