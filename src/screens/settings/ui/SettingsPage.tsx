import {Input} from "@shared/ui/input";

import {PageHeader} from "@/widgets";

export function SettingsPage() {
    return (
        <div className="flex flex-col">
            <div className="text-center lg:mb-8">
                <PageHeader title="Settings"/>
            </div>
            <div className="flex-1 flex items-center justify-center lg:pt-32">
                <div className="grid grid-rows-2 lg:pb-10 gap-6 w-full max-w-xl lg:max-w-2xl">
                    <div>
                        <h1 className="text-base font-semibold mb-3 lg:text-xl">Profile</h1>
                        <form action="" className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Input placeholder="Email" type="email"/>
                            <Input placeholder="Password" type="password"/>
                            <Input placeholder="Name"/></form>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold mb-3 lg:text-xl">Pomodoro</h1>
                        <form action="" className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <Input placeholder="Work Interval"/>
                            <Input placeholder="Interval Count"/>
                            <Input placeholder="Break Interval"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
