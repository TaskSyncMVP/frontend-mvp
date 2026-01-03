import {TaskCheckbox} from "@shared/ui";
import {Badge} from "@shared/ui";
import {TaskCardProps} from "@features/tasks/lib/taskCard-props";
import Image from "next/image";

export function TaskCard({
                             title,
                             level = "medium",
                             isCompleted = false,
                             onToggle
                         }: TaskCardProps) {
    return (
        <div className="w-full bg-white rounded-large grid grid-cols-[1fr_auto] items-center px-4 py-3 shadow-drop
        border-border gap-4">
            <div className="grid gap-6">
                <h3 className={`text-sm font-regular truncate ${isCompleted ? 'line-through text-muted' : 'text-foreground'}`}>
                    {title}
                </h3>
                <div className="flex items-center gap-1">
                    <Image
                        src="/icon/common/clock.svg"
                        alt="Clock"
                        width={12}
                        height={12}
                        className="primary-45"
                    />
                    <h4 className="text-xs text-primary-45">12:00 AM</h4>
                </div>
            </div>
            <div className="grid gap-6 justify-items-end">
                <TaskCheckbox
                    level={level}
                    checked={isCompleted}
                    onCheckedChange={onToggle}
                />
                <Badge variant={level} size="mini">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                </Badge>
            </div>
        </div>
    );
}
