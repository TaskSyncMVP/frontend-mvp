import {TaskCard} from "@features/tasks";
import {TaskListProps} from "../lib";

const defaultTasks = [
    {
        title: "Review project vff vf v fv fv fv  мама ма а амам ам амам ",
        status: "pending",
        level: "high" as const,
        isCompleted: false
    },
    {
        title: "Update user interface",
        status: "in-progress",
        level: "medium" as const,
        isCompleted: false
    },
    {
        title: "Fix authentication ",
        status: "pending",
        level: "high" as const,
        isCompleted: true
    },
    {
        title: "Fix authentication ",
        status: "pending",
        level: "low" as const,
        isCompleted: true
    },
];

export function TaskList({
    tasks = defaultTasks,
    onTaskToggle,
    getTaskKey,
    emptyStateMessage = "No tasks yet. Create your first task!",
    className = ""
}: TaskListProps = {}) {
    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {emptyStateMessage}
                </div>
            ) : (
                tasks.map((task, index) => (
                    <TaskCard
                        key={getTaskKey ? getTaskKey(task, index) : `task-${index}`}
                        {...task}
                        onToggle={(checked) => onTaskToggle?.(task.title, checked)}
                    />
                ))
            )}
        </div>
    );
}