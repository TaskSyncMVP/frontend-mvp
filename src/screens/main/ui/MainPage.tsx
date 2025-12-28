'use client';

import {Button} from "@shared/ui";
import { useRouter } from 'next/navigation';

export function MainPage() {
    const router = useRouter();

    const handleStart = () => {
        router.push('/login');
    };

    return (
        <div>
            <h1 className="text-lg font-semibold text-center mb-1">Task Sync</h1>
            <h3 className="text-sm text-muted text-center font-regular max-w-md mx-auto mb-8">
                This productive tool is designed to help
                <br/> you better manage your task
                <br/> project-wise conveniently!
            </h3>
            <Button className="w-full" size="xl" onClick={handleStart}>
                Let's Start
            </Button>
        </div>
    );
}