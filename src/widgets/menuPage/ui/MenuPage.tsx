import {PageHeader} from "@/widgets";
import {Button} from "@shared/ui";

export function MenuPage() {
    return (
        <div>
            <PageHeader title="Menu"/>
            <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary">Settings</Button>
                <Button variant="secondary">Tasks</Button>
                <Button variant="secondary">Pomodoro</Button>
                <Button variant="secondary">Time Blocking</Button>
            </div>
        </div>
    )
}