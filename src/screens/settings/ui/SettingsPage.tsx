'use client';

import {PageHeader} from "@/widgets";
import {SettingsForm} from "@/features/settings";
import {PomodoroSettingsForm} from "@/features/pomodoro";
import {useAuth} from "@features/auth";
import {SettingsPageSkeleton} from "@/screens/settings/ui/SettingsPageSkeleton";

export function SettingsPage() {
    const {isLoading: authLoading} = useAuth();

    if (authLoading) {
        return <>
            <PageHeader title="Settings"/>
            <SettingsPageSkeleton/>
        </>;
    }

    return (
        <div className="flex flex-col">
            <div className="text-center mb-8">
                <PageHeader title="Settings"/>
            </div>
            <div className="flex justify-center lg:pt-24">
                <div className="grid grid-rows-2 gap-6 w-full max-w-xl lg:max-w-2xl">
                    <div>
                        <h1 className="text-base font-semibold mb-3 lg:text-xl">Profile</h1>
                        <SettingsForm/>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold mb-3 lg:text-xl">Pomodoro</h1>
                        <PomodoroSettingsForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}