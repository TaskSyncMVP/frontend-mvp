import { NextRequest, NextResponse } from 'next/server';
import { getTasks, addTask } from './storage';

export async function GET() {
    try {
        const tasks = getTasks();
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, priority } = body;

        if (!name || !priority) {
            return NextResponse.json(
                { error: 'Name and priority are required' },
                { status: 400 }
            );
        }

        const newTask = {
            id: Date.now().toString(),
            name,
            priority,
            isCompleted: false,
            userId: 'user1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addTask(newTask);

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}