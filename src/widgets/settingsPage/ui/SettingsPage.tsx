import {Input} from "@shared/ui/input";

import {PageHeader} from "@/widgets";

export function SettingsPage() {
    return (
        <div>
            <PageHeader title="Settings"/>
            <div className="grid grid-rows-2 gap-6 mt-4 ">
                <div>
                    <h1 className="text-base font-semibold mb-3">Profile</h1>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <Input placeholder="Email" type="email" />
                        <Input placeholder="Password" type="password" />
                        <Input placeholder="Name" />
                    </div>
                </div>
                <div>
                    <h1 className="text-base font-semibold mb-3">Pomodoro</h1>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <Input placeholder="Work Interval"/>
                        <Input placeholder="Interval Count"/>
                        <Input placeholder="Break Interval"/>
                    </div>
                </div>
            </div>
        </div>
    )
}