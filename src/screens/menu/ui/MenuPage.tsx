import { PageHeader } from "@/widgets";
import { MenuButton } from "./MenuButton";

export function MenuPage() {

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
        </div>
    );
}
