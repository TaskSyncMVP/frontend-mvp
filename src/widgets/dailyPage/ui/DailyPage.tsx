import {PageHeader} from "@/widgets";
import {Button} from "@/shared/ui";

export function DailyPage () {
    return (
        <div>
            <PageHeader title="Today’s Tasks"/>
            <div>
                <div>

                </div>
                <div className="grid grid-cols-2 gap-10">
                    <Button variant="primary" size="sm">All</Button>
                    <Button variant="primary" size="sm">High</Button>
                    <Button variant="primary" size="sm">Medium</Button>
                    <Button variant="primary" size="sm">Low</Button>
                </div>
            </div>
        </div>
    )
}