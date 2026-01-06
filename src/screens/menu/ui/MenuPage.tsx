'use client';

import { PageHeader } from "@/widgets";
import { MenuButton } from "./MenuButton";
import { Button } from "@shared/ui";
import { useAuth } from "@features/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function MenuPage() {
    const { logout, isLoading, user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-6rem)]">
            <PageHeader title="Menu"/>
            <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                    <MenuButton
                        icon="/icon/actions/setting-2.svg"
                        alt="Settings"
                        href="/settings"
                    >
                        Settings
                    </MenuButton>
                    <MenuButton
                        icon="/icon/actions/calendar.svg"
                        alt="Tasks"
                        href="/tasks"
                    >
                        Tasks
                    </MenuButton>
                    <MenuButton
                        icon="/icon/actions/timer-start.svg"
                        alt="Pomodoro"
                        href="/pomodoro"
                    >
                        Pomodoro
                    </MenuButton>
                    <MenuButton
                        icon="/icon/actions/save-add.svg"
                        alt="Time Blocking"
                        href="/time-blocking"
                    >
                        Time Blocking
                    </MenuButton>
                </div>
            </div>
            <div className="mt-8 px-4">
                {user && (
                    <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">Logged in as</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                )}
                <Button
                    onClick={handleLogout}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoading ? 'Logging out...' : 'Logout'}
                </Button>
            </div>
        </div>
    );
}
