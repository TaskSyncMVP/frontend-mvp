'use client';

import { useRouter } from "next/navigation";

export function useMenuNavigation() {
    const router = useRouter();

    const navigateToSettings = () => router.push('/menu/settings');
    const navigateToTasks = () => router.push('/daily');
    const navigateToPomodoro = () => router.push('/pomodoro');
    const navigateToTimeBlocking = () => router.push('/time-blocking');

    return {
        navigateToSettings,
        navigateToTasks,
        navigateToPomodoro,
        navigateToTimeBlocking,
    };
}
