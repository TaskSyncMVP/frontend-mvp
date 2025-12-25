import {TaskCheckbox} from "@shared/ui";
import {Badge} from "@shared/ui";

type TaskLevel = "low" | "medium" | "high";

interface TaskCardProps {
    title: string;
    status: string;
    level?: TaskLevel;
    isCompleted?: boolean;
    onToggle?: (checked: boolean) => void;
}

export function TaskCard({
                             title,
                             level = "medium",
                             isCompleted = false,
                             onToggle
                         }: TaskCardProps) {
    return (
        <div className="w-full bg-white rounded-large grid grid-cols-2 px-4 pt-4 pb-4
        shadow-drop border-border">
            <div className="flex flex-col gap-8">
                <div className="">
                    <h3 className={`text-sm font-regular ${isCompleted ? 'line-through text-muted' : 'text-foreground'}`}>
                        {title}
                    </h3>
                </div>
                <div>
                    <h4 className="text-xs text-primary-100">12:00 AM</h4>
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex justify-end">
                    <TaskCheckbox
                        level={level}
                        checked={isCompleted}
                        onCheckedChange={onToggle}
                    />
                </div>
                <div className="flex justify-end">
                    <Badge variant={level} size="mini">
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Badge>
                </div>
            </div>
        </div>
    );
}
