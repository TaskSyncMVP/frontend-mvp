import {TaskCheckbox} from "@shared/ui";
import {Badge} from "@shared/ui";
import {TaskCardProps} from "@features/tasks/lib/taskCard-props";
import {useUpdateTask} from "@/entities/task";
import {formatTaskTime} from "@shared/lib/date-utils";
import Image from "next/image";

export function TaskCard({
                             id,
                             title,
                             level = "medium",
                             isCompleted = false,
                             createdAt,
                             onToggle
                         }: TaskCardProps) {
    const updateTaskMutation = useUpdateTask();

    const handleToggle = async (checked: boolean) => {
        if (onToggle) {
            onToggle(checked);
        } else {
            try {
                await updateTaskMutation.mutateAsync({
                    id,
                    data: { isCompleted: checked }
                });
            } catch (error) {
                console.error('Failed to update task:', error);
            }
        }
    };

    const displayTime = createdAt ? formatTaskTime(createdAt) : '12:00 AM';

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
                    <h4 className="text-xs text-primary-45">{displayTime}</h4>
                </div>
            </div>
            <div className="grid gap-6 justify-items-end">
                <TaskCheckbox
                    level={level}
                    checked={isCompleted}
                    onCheckedChange={handleToggle}
                    disabled={updateTaskMutation.isPending}
                />
                <Badge variant={level} size="mini">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                </Badge>
            </div>
        </div>
    );
}
