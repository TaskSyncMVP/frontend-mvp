'use client'
import { useState } from "react";
import {TaskCard} from "@features/tasks";
import {TaskListProps} from "../lib";

const defaultTasks = [
    {
        id: "1",
        title: "Review project vff vf v fv fv fv  мама ма а амам ам амам ",
        status: "pending",
        level: "high" as const,
        isCompleted: false
    },
    {
        id: "2",
        title: "Update user interface",
        status: "in-progress",
        level: "medium" as const,
        isCompleted: false
    },
    {
        id: "3",
        title: "Fix authentication bug",
        status: "pending",
        level: "high" as const,
        isCompleted: true
    },
    {
        id: "4",
        title: "Write unit tests",
        status: "pending",
        level: "low" as const,
        isCompleted: false
    },
    {
        id: "5",
        title: "Deploy to production",
        status: "pending",
        level: "medium" as const,
        isCompleted: false
    },{
        id: "6",
        title: "Fix authentication bug",
        status: "pending",
        level: "high" as const,
        isCompleted: true
    },
    {
        id: "7",
        title: "Write unit tests",
        status: "pending",
        level: "low" as const,
        isCompleted: false
    },
    {
        id: "8",
        title: "Deploy to production",
        status: "pending",
        level: "medium" as const,
        isCompleted: false
    },
    {
        id: "9",
        title: "Fix authentication bug",
        status: "pending",
        level: "high" as const,
        isCompleted: true
    },
    {
        id: "10",
        title: "Write unit tests",
        status: "pending",
        level: "low" as const,
        isCompleted: false
    },
    {
        id: "11",
        title: "Deploy to production",
        status: "pending",
        level: "medium" as const,
        isCompleted: false
    }
];

export function TaskList({
    tasks: initialTasks = defaultTasks,
    onTaskToggle,
    getTaskKey,
    emptyStateMessage = "No tasks yet. Create your first task!",
    className = ""
}: TaskListProps = {}) {
    const [tasks, setTasks] = useState(initialTasks);

    const createTaskToggleHandler = (taskId: string) => (checked: boolean) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, isCompleted: checked }
                    : task
            )
        );
        onTaskToggle?.(taskId, checked);
    };
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
                        onToggle={createTaskToggleHandler(task.id)}
                    />
                ))
            )}
        </div>
    );
}