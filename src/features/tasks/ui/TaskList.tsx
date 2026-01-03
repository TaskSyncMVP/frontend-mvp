'use client'
import {TaskCard} from "@features/tasks";
import {TaskListProps} from "../lib";

export function TaskList({
    tasks = [],
    onTaskToggle,
    getTaskKey,
    emptyStateMessage = "No tasks yet. Create your first task!",
    className = ""
}: TaskListProps = {}) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 pb-4 overflow-y-auto gap-4 ${className}`}>
            {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {emptyStateMessage}
                </div>
            ) : (
                tasks.map((task, index) => (
                    <TaskCard
                        key={getTaskKey ? getTaskKey(task, index) : task.id}
                        {...task}
                        onToggle={onTaskToggle ? (checked) => onTaskToggle(task.id, checked) : undefined}
                    />
                ))
            )}
        </div>
    );
}