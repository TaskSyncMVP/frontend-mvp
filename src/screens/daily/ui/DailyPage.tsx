'use client'
import {useState} from "react";
import {PageHeader} from "@/widgets";
import {Button} from "@/shared/ui";
import {TaskCard} from "@features/tasks";
import {DayCard} from "./DayCard";
import {useTasks} from "@/entities/task";
import {generateDaysWithTasks} from "@shared/lib/date-utils";

export function DailyPage() {
    const [selectedDayIndex, setSelectedDayIndex] = useState(7); // Сегодняшний день в середине массива (индекс 7)
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const { data: tasks = [], isLoading } = useTasks();

    const daysData = generateDaysWithTasks(tasks);

    const handleDayClick = (index: number) => {
        setSelectedDayIndex(index);
    };

    const handleFilterChange = (filter: 'all' | 'high' | 'medium' | 'low') => {
        setSelectedFilter(filter);
    };

    const selectedDayTasks = daysData[selectedDayIndex]?.tasks || [];

    const filteredTasks = selectedFilter === 'all'
        ? selectedDayTasks
        : selectedDayTasks.filter(task => task.level === selectedFilter);

    if (isLoading) {
        return (
            <>
                <PageHeader title="Today's Tasks"/>
                <div className="flex justify-center items-center h-64">
                    <div className="text-muted-foreground">Loading tasks...</div>
                </div>
            </>
        );
    }
    return (
        <>
            <PageHeader title="Today’s Tasks"/>
            <div className="flex flex-col gap-7">
                <div className="-mx-4 flex flex-row justify-center">
                    <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide snap-x snap-mandatory">
                        {daysData.map((day, index) => (
                            <div key={day.date} className="snap-center shrink-0">
                                <DayCard
                                    date={day.date}
                                    isActive={index === selectedDayIndex}
                                    onClick={() => handleDayClick(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <Button
                        size="sm"
                        variant={selectedFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('all')}
                    >
                        All
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedFilter === 'high' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('high')}
                    >
                        High
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedFilter === 'medium' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('medium')}
                    >
                        Medium
                    </Button>
                    <Button
                        size="sm"
                        variant={selectedFilter === 'low' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('low')}
                    >
                        Low
                    </Button>
                </div>
                <div className="flex flex-col gap-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                {...task}
                            />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            {selectedFilter === 'all' 
                                ? 'No tasks for this day' 
                                : `No ${selectedFilter} priority tasks for this day`
                            }
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
