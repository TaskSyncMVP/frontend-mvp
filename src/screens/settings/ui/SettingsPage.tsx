import {Input} from "@shared/ui/input";

import {PageHeader} from "@/widgets";

export function SettingsPage() {
    return (
        <div className="lg:flex lg:flex-col lg:justify-center lg:px-4">
            <div>
                <div className="text-center mb-8">
                    <PageHeader title="Settings"/>
                </div>
                <div className="flex justify-center">
                    <div className="grid grid-rows-2 gap-6 w-full max-w-xl lg:max-w-2xl">
                        <div>
                            <h1 className="text-base font-semibold mb-3 lg:text-xl">Profile</h1>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <Input placeholder="Email" type="email" />
                                <Input placeholder="Password" type="password" />
                                <Input placeholder="Name" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-base font-semibold mb-3 lg:text-xl">Pomodoro</h1>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <Input placeholder="Work Interval"/>
                                <Input placeholder="Interval Count"/>
                                <Input placeholder="Break Interval"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
