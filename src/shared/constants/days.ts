import {TaskLevel} from "@shared/lib/types";

export interface DayData {
    date: string;
    dayName: string;
    month: string;
    day: number;
    weekday: string;
    tasks: Array<{
        id: string;
        title: string;
        status: string;
        level: TaskLevel;
        isCompleted: boolean;
    }>;
}

export const DAYS_DATA: DayData[] = [
    {
        date: "2026-01-03",
        dayName: "Saturday",
        month: "Jan",
        day: 3,
        weekday: "Sat",
        tasks: [
            {
                id: "today-1",
                title: "Morning workout",
                status: "pending",
                level: "medium",
                isCompleted: false
            },
            {
                id: "today-2",
                title: "Review daily goals",
                status: "pending",
                level: "low",
                isCompleted: false
            },
            {
                id: "today-3",
                title: "Team meeting preparation",
                status: "pending",
                level: "high",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-01",
        dayName: "Wednesday",
        month: "Jan",
        day: 1,
        weekday: "Wed",
        tasks: [
            {
                id: "1",
                title: "Review project documentation",
                status: "pending",
                level: "high",
                isCompleted: false
            },
            {
                id: "2",
                title: "Update user interface",
                status: "in-progress",
                level: "medium",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-02",
        dayName: "Thursday",
        month: "Jan",
        day: 2,
        weekday: "Thu",
        tasks: [
            {
                id: "3",
                title: "Fix authentication bug",
                status: "pending",
                level: "high",
                isCompleted: true
            },
            {
                id: "4",
                title: "Write unit tests",
                status: "pending",
                level: "low",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-03",
        dayName: "Friday",
        month: "Jan",
        day: 3,
        weekday: "Fri",
        tasks: [
            {
                id: "5",
                title: "Deploy to production",
                status: "pending",
                level: "medium",
                isCompleted: false
            },
            {
                id: "6",
                title: "Optimize database queries",
                status: "pending",
                level: "medium",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-04",
        dayName: "Saturday",
        month: "Jan",
        day: 4,
        weekday: "Sat",
        tasks: [
            {
                id: "7",
                title: "Code review",
                status: "pending",
                level: "low",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-05",
        dayName: "Sunday",
        month: "Jan",
        day: 5,
        weekday: "Sun",
        tasks: [
            {
                id: "8",
                title: "Plan next week",
                status: "pending",
                level: "medium",
                isCompleted: false
            },
            {
                id: "9",
                title: "Update documentation",
                status: "pending",
                level: "low",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-10",
        dayName: "Sunday",
        month: "Jan",
        day: 6,
        weekday: "Sun",
        tasks: [
            {
                id: "10",
                title: "Plan next week",
                status: "pending",
                level: "medium",
                isCompleted: false
            },
            {
                id: "9",
                title: "Update documentation",
                status: "pending",
                level: "low",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-07",
        dayName: "Tuesday",
        month: "Jan",
        day: 7,
        weekday: "Tue",
        tasks: [
            {
                id: "12",
                title: "Database optimization",
                status: "in-progress",
                level: "high",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-08",
        dayName: "Wednesday",
        month: "Jan",
        day: 8,
        weekday: "Wed",
        tasks: [
            {
                id: "13",
                title: "Client presentation",
                status: "pending",
                level: "high",
                isCompleted: false
            },
            {
                id: "14",
                title: "Bug fixes",
                status: "pending",
                level: "medium",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-09",
        dayName: "Thursday",
        month: "Jan",
        day: 9,
        weekday: "Thu",
        tasks: [
            {
                id: "15",
                title: "Testing phase",
                status: "pending",
                level: "medium",
                isCompleted: false
            }
        ]
    },
    {
        date: "2025-01-11",
        dayName: "Friday",
        month: "Jan",
        day: 10,
        weekday: "Fri",
        tasks: [
            {
                id: "16",
                title: "Deploy to staging",
                status: "pending",
                level: "high",
                isCompleted: false
            },
            {
                id: "17",
                title: "Weekend planning",
                status: "pending",
                level: "low",
                isCompleted: false
            }
        ]
    }
];
