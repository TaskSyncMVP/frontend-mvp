import { NextRequest, NextResponse } from 'next/server';
import { findTask, updateTask } from '../../storage';

// Функция для извлечения даты из названия задачи
const extractDateFromTaskName = (taskName: string): { date: string | null; cleanName: string } => {
    const datePrefix = taskName.match(/^\[(\d{4}-\d{2}-\d{2})\]\s*/);
    if (datePrefix) {
        return {
            date: datePrefix[1],
            cleanName: taskName.replace(/^\[(\d{4}-\d{2}-\d{2})\]\s*/, '')
        };
    }
    return { date: null, cleanName: taskName };
};

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { targetDate } = body;
        
        if (!targetDate) {
            return NextResponse.json(
                { error: 'Target date is required' },
                { status: 400 }
            );
        }

        const task = findTask(id);
        
        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        const { cleanName } = extractDateFromTaskName(task.name);
        
        // Определяем новое название задачи
        let newTaskName = cleanName;
        const today = new Date().toISOString().split('T')[0];
        
        if (targetDate !== today) {
            newTaskName = `[${targetDate}] ${cleanName}`;
        }

        const updatedTask = updateTask(id, { name: newTaskName });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to move task' },
            { status: 500 }
        );
    }
}