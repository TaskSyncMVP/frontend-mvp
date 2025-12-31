import {PageHeader} from "@/widgets";
import {MenuButton} from "./MenuButton";
import {useMenuNavigation} from "./useMenuNavigation";

export function MenuPage() {
    const {
        navigateToSettings,
        navigateToTasks,
        navigateToPomodoro,
        navigateToTimeBlocking,
    } = useMenuNavigation();

    return (
        <div className="h-screen flex flex-col overflow-hidden relative">
            <PageHeader title="Menu"/>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-3 lg:gap-6">
                    <MenuButton
                        icon="/icon/actions/setting-2.svg"
                        alt="Settings"
                        onClick={navigateToSettings}>
                        Settings
                    </MenuButton>
                    <MenuButton
                        icon="/icon/actions/calendar.svg"
                        alt="Tasks"
                        onClick={navigateToTasks}
                    >
                        Tasks
                    </MenuButton>
                    <MenuButton
                        icon="/icon/actions/timer-start.svg"
                        alt="Pomodoro"
                        onClick={navigateToPomodoro}
                    >
                        Pomodoro
                    </MenuButton>
                    <MenuButton
                        icon="/icon/actions/save-add.svg"
                        alt="Time Blocking"
                        onClick={navigateToTimeBlocking}
                    >
                        Time Blocking
                    </MenuButton>
                </div>
            </div>
        </div>
    );
}