'use client'
import {useState} from "react";
import {PageHeader} from "@/widgets";
import {Button} from "@/shared/ui";
import {TaskList} from "@features/tasks";
import {DayCard} from "./DayCard";
import {DAYS_DATA} from "@shared/constants";

export function DailyPage() {
    const [selectedDayIndex, setSelectedDayIndex] = useState(2);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    const handleDayClick = (index: number) => {
        setSelectedDayIndex(index);
    };

    const handleFilterChange = (filter: 'all' | 'high' | 'medium' | 'low') => {
        setSelectedFilter(filter);
    };

    const sortedDaysData = [...DAYS_DATA].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const selectedDayTasks = sortedDaysData[selectedDayIndex]?.tasks || [];

    const filteredTasks = selectedFilter === 'all'
        ? selectedDayTasks
        : selectedDayTasks.filter(task => task.level === selectedFilter);
    return (
        <>
            <PageHeader title="Today’s Tasks"/>
            <div className="flex flex-col gap-7">
                <div className="-mx-4 flex flex-row justify-center">
                    <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide snap-x snap-mandatory">
                        {sortedDaysData.map((day, index) => (
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
                <TaskList tasks={filteredTasks}/>
            </div>
        </>
    )
}
