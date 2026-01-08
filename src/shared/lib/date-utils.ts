import { Task, TaskPriority } from '@/entities/task';
import { APP_CONSTANTS } from '@shared/constants/app';

export interface DayData {
    date: string;
    dayName: string;
    month: string;
    day: number;
    weekday: string;
    tasks: TaskWithLevel[];
}

export interface TaskWithLevel {
    id: string;
    title: string;
    status: string;
    level: TaskPriority;
    isCompleted: boolean;
    createdAt: string;
}

export const extractDateFromTaskName = (taskName: string): { date: string | null; cleanName: string } => {
    const datePrefix = taskName.match(/^\[(\d{4}-\d{2}-\d{2})\]\s*/);
    if (datePrefix) {
        return {
            date: datePrefix[1],
            cleanName: taskName.replace(/^\[(\d{4}-\d{2}-\d{2})\]\s*/, '')
        };
    }
    return { date: null, cleanName: taskName };
};

const getTaskTargetDate = (task: Task): string => {
    const { date } = extractDateFromTaskName(task.name);
    if (date) {
        return date;
    }
    return formatDateString(new Date(task.createdAt));
};

export const adaptTaskToTaskWithLevel = (task: Task): TaskWithLevel => {
    const { cleanName } = extractDateFromTaskName(task.name);
    return {
        id: task.id,
        title: cleanName,
        status: task.isCompleted ? 'completed' : 'pending',
        level: task.priority,
        isCompleted: task.isCompleted,
        createdAt: task.createdAt,
    };
};

const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const createDayData = (date: Date, tasks: Task[]): DayData => {
    const dateStr = formatDateString(date);
    const dayTasks = tasks.filter(task => {
        const targetDate = getTaskTargetDate(task);
        return targetDate === dateStr;
    });

    return {
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: dayTasks.map(adaptTaskToTaskWithLevel),
    };
};

export const groupTasksByDays = (tasks: Task[]): DayData[] => {
    const tasksByDate = new Map<string, Task[]>();
    
    tasks.forEach(task => {
        const targetDate = getTaskTargetDate(task);
        if (!tasksByDate.has(targetDate)) {
            tasksByDate.set(targetDate, []);
        }
        tasksByDate.get(targetDate)!.push(task);
    });

    const days: DayData[] = [];
    const sortedDates = Array.from(tasksByDate.keys()).sort();

    sortedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        const dayTasks = tasksByDate.get(dateStr) || [];
        days.push(createDayData(date, dayTasks));
    });

    return days;
};

export const getTodayTasks = (tasks: Task[]): TaskWithLevel[] => {
    const today = formatDateString(new Date());
    return tasks
        .filter(task => {
            const targetDate = getTaskTargetDate(task);
            return targetDate === today;
        })
        .map(adaptTaskToTaskWithLevel);
};

// Получение задач на неделю (сегодня + 6 дней вперед)
export const getWeekTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(task => {
        const { date } = extractDateFromTaskName(task.name);
        const targetDate = date ? new Date(date) : new Date(task.createdAt);
        return isWithinWeek(targetDate);
    });
};

export const generateDaysWithTasks = (tasks: Task[]): DayData[] => {
    const days: DayData[] = [];
    const today = new Date();
    const range = APP_CONSTANTS.CALENDAR_DAYS_RANGE;
    
    for (let i = -range; i <= range; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(createDayData(date, tasks));
    }

    return days;
};

export const formatTaskTime = (createdAt: string): string => {
    const taskDate = new Date(createdAt);
    
    if (isToday(taskDate)) {
        return taskDate.toLocaleTimeString('en-US', APP_CONSTANTS.TIME_FORMAT.HOUR_12);
    } else {
        return taskDate.toLocaleDateString('en-US', APP_CONSTANTS.TIME_FORMAT.DATE_WITH_TIME);
    }
};

export const isWithinWeek = (date: Date): boolean => {
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 6);
    
    today.setHours(0, 0, 0, 0);
    weekFromNow.setHours(23, 59, 59, 999);
    date.setHours(0, 0, 0, 0);
    
    return date >= today && date <= weekFromNow;
};

export const createDateWithCurrentTime = (targetDate: string): string => {
    const now = new Date();
    const targetDateTime = new Date(targetDate);
    
    targetDateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    
    return targetDateTime.toISOString();
};