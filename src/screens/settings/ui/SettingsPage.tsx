'use client';

import {Input} from "@shared/ui";
import {PageHeader} from "@/widgets";
import {SettingsForm} from "@/features/settings";

export function SettingsPage() {
    return (
        <div className="flex flex-col">
            <div className="text-center mb-8">
                <PageHeader title="Settings"/>
            </div>
            <div className="flex justify-center lg:pt-24">
                <div className="grid grid-rows-2 gap-6 w-full max-w-xl lg:max-w-2xl">
                    <div>
                        <h1 className="text-base font-semibold mb-3 lg:text-xl">Profile</h1>
                        <SettingsForm />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold mb-3 lg:text-xl">Pomodoro</h1> {/*Потом сделать компонент помодоро*/}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Input
                                placeholder="Work Interval"
                                disabled={true}
                                className="opacity-50"
                                title="Coming soon"
                            />
                            <Input
                                placeholder="Interval Count"
                                disabled={true}
                                className="opacity-50"
                                title="Coming soon"
                            />
                            <Input
                                placeholder="Break Interval"
                                disabled={true}
                                className="opacity-50"
                                title="Coming soon"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}