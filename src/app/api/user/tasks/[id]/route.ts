import { NextRequest, NextResponse } from 'next/server';
import { updateTask, deleteTask } from '../storage';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        
        const updatedTask = updateTask(id, body);
        
        if (!updatedTask) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        
        const deletedTask = deleteTask(id);
        
        if (!deletedTask) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(deletedTask);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}