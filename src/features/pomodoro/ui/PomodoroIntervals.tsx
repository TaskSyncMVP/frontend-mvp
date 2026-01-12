"use client"

import { PomodoroTimer } from '@/entities/pomodoro';
import { useEffect } from 'react';

interface PomodoroIntervalsProps {
    timer: PomodoroTimer;
    progress: number; 
}

export function PomodoroIntervals({ timer, progress }: PomodoroIntervalsProps) {
    useEffect(() => {
        const styleId = 'pomodoro-shimmer-animation';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes pomodoro-shimmer {
                    0% {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                .pomodoro-shimmer {
                    animation: pomodoro-shimmer 3s ease-in-out infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const intervals = Array.from({ length: timer.totalRounds }, (_, index) => {
        const roundNumber = index + 1;
        
        if (roundNumber < timer.currentRound) {
            return 'completed';
        } else if (roundNumber === timer.currentRound && (timer.state === 'work' || timer.state === 'break' || timer.state === 'paused')) {
            return 'current';
        } else {
            return 'inactive';
        }
    });

    return (
        <div className="flex flex-row gap-2">
            {intervals.map((status, index) => (
                <div
                    key={index}
                    className={`relative rounded-soft h-6 w-6 transition-all duration-500 ease-out overflow-hidden ${
                        status === 'completed'
                            ? 'bg-pomodoro-timer shadow-sm'
                            : status === 'inactive'
                            ? 'bg-pomodoro-background'
                            : 'bg-pomodoro-background'
                    }`}
                    style={{
                        transform: status === 'current' ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {status === 'current' && timer.isWorkSession && (
                        <>
                            <div
                                className="absolute top-0 left-0 bg-pomodoro-timer h-full"
                                style={{
                                    width: `${Math.max(0, Math.min(100, progress))}%`,
                                    transition: 'width 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)',
                                    willChange: 'width'
                                }}
                            />
                        </>
                    )}
                    
                    {status === 'current' && !timer.isWorkSession && (
                        <div className="absolute inset-0 bg-pomodoro-timer opacity-60" />
                    )}
                </div>
            ))}
        </div>
    );
}