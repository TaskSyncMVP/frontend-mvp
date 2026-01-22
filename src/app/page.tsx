'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookies } from '@/shared/lib/cookies';

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        const token = cookies.get('accessToken');

        if (token) {
            router.replace('/home');
        } else {
            router.replace('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
        </div>
    );
}
