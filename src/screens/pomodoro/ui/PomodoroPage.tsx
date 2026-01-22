import {PageHeader} from "@/widgets";
import {PomodoroTimer} from "@/features/pomodoro";
import {PomodoroPageSkeleton} from "./PomodoroPageSkeleton";
import {useAuth} from "@features/auth";

export function PomodoroPage() {
    const { isLoading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <>
                <PageHeader title="Pomodoro"/>
                <PomodoroPageSkeleton />
            </>
        );
    }

    return (
        <>
            <PageHeader title="Pomodoro"/>
            <PomodoroTimer />
        </>
    );
}