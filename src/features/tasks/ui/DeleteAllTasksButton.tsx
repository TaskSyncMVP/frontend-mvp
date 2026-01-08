'use client';

import { useState } from 'react';
import { Button } from '@shared/ui';
import { Trash2 } from 'lucide-react';
import { useDeleteAllTasks, useTasks } from '@/entities/task';

export function DeleteAllTasksButton() {
    const [showConfirm, setShowConfirm] = useState(false);
    const deleteAllTasksMutation = useDeleteAllTasks();
    const { data: tasks = [] } = useTasks();

    const handleClick = () => {
        if (!showConfirm) {
            setShowConfirm(true);
            setTimeout(() => setShowConfirm(false), 5000);
        } else {
            handleDeleteAll();
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllTasksMutation.mutateAsync();
            setShowConfirm(false);
        } catch (error) {
            console.error('Failed to delete all tasks:', error);
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    if (tasks.length === 0) {
        return null;
    }

    if (showConfirm) {
        return (
            <div className="flex flex-col gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                    Are you sure you want to delete ALL {tasks.length} tasks?
                </p>
                <p className="text-xs text-red-600">
                    This action cannot be undone!
                </p>
                <div className="flex gap-2 mt-2">
                    <Button
                        size="sm"
                        variant="default"
                        onClick={handleDeleteAll}
                        disabled={deleteAllTasksMutation.isPending}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        {deleteAllTasksMutation.isPending ? 'Deleting...' : 'Yes, Delete All'}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={deleteAllTasksMutation.isPending}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleClick}
            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300 text-xs px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5"
        >
            <Trash2 size={14} />
            Delete All ({tasks.length})
        </Button>
    );
}