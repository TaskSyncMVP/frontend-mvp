'use client';

import { Button } from '@shared/ui';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePomodoroTimer } from '../lib/usePomodoroTimer';
import { useDeletePomodoroSession } from '@/entities/pomodoro';
import { usePomodoroSettings } from '../lib/pomodoro-hooks';
import { PomodoroCircle } from './PomodoroCircle';
import { PomodoroIntervals } from './PomodoroIntervals';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function PomodoroTimer() {
    const { workInterval, breakInterval } = usePomodoroSettings();
    const {
        timer,
        toggleTimer,
        resetTimer,
        formatTime,
        progress,
        isRunning,
        isPaused,
        isIdle,
        currentSession,
    } = usePomodoroTimer();

    const deleteSession = useDeletePomodoroSession();

    useEffect(() => {
        const handleNavbarToggle = () => {
            toggleTimer();
        };

        window.addEventListener('navbar:pomodoro-toggle', handleNavbarToggle);
        return () => window.removeEventListener('navbar:pomodoro-toggle', handleNavbarToggle);
    }, [toggleTimer]);

    useEffect(() => {
        if (timer.state === 'break' && timer.secondsLeft === breakInterval * 60 - 1 && !timer.isWorkSession) {
            toast.success('Work session completed! Time for a break.');
        } else if (timer.state === 'work' && timer.currentRound > 1 && timer.secondsLeft === workInterval * 60 - 1 && timer.isWorkSession) {
            toast.success('Break is over! Back to work.');
        } else if (timer.state === 'idle' && timer.currentRound === 1) {
            const wasRunning = sessionStorage.getItem('pomodoro-was-running');
            if (wasRunning === 'true') {
                toast.success('🎉 Pomodoro session completed! Great work!');
                sessionStorage.removeItem('pomodoro-was-running');
            }
        }
    }, [timer.state, timer.secondsLeft, timer.currentRound, timer.isWorkSession, workInterval, breakInterval]);

    useEffect(() => {
        if (timer.state === 'work' || timer.state === 'break') {
            sessionStorage.setItem('pomodoro-was-running', 'true');
        }
    }, [timer.state]);

    useEffect(() => {
        const isRunning = timer.state === 'work' || timer.state === 'break';
        window.dispatchEvent(new CustomEvent('pomodoro:state-change', {
            detail: { isRunning }
        }));
    }, [timer.state]);

    const handleReset = async () => {
        resetTimer();
        sessionStorage.removeItem('pomodoro-was-running');
        
        if (currentSession) {
            try {
                await deleteSession.mutateAsync(currentSession.id);
            } catch (error) {
                console.error('Failed to reset session:', error);
            }
        }
    };

    const getStatusText = () => {
        if (isIdle) return 'Ready to start';
        if (isPaused) return `Paused - ${timer.isWorkSession ? 'Work' : 'Break'} Session`;
        if (timer.isWorkSession) return `Work Session ${timer.currentRound}/${timer.totalRounds}`;
        return `Break Time`;
    };

    return (
        <div className="flex flex-col items-center gap-6 justify-center min-h-[calc(100vh-200px)] transition-all
        duration-500 ease-out">
            <div className="text-center animate-in fade-in slide-in-from-top-2 duration-700">
                <h2 className="text-lg font-semibold text-gray-700 mb-2 transition-all duration-500 ease-in-out">
                    {getStatusText()}
                </h2>
                {currentSession && (
                    <p className="text-sm text-gray-500 transition-opacity duration-300">
                        Session active since {new Date(currentSession.createdAt).toLocaleTimeString()}
                    </p>
                )}
            </div>

            <div className="animate-in zoom-in-50 duration-700 delay-100">
                <PomodoroCircle
                    progress={progress}
                    timeDisplay={formatTime}
                    isWorkSession={timer.isWorkSession}
                />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                <PomodoroIntervals timer={timer} progress={progress} />
            </div>

            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleTimer}
                    className="h-12 w-12 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-primary-50"
                    disabled={deleteSession.isPending}
                >
                    <div className="transition-all duration-200 ease-out">
                        {isRunning ? (
                            <Pause size={24} className="transition-transform duration-200" />
                        ) : (
                            <Play size={24} className="transition-transform duration-200 hover:translate-x-0.5" />
                        )}
                    </div>
                </Button>

                {!isIdle && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleReset}
                        className="h-12 w-12 transition-all hover:scale-110 active:scale-95 hover:bg-red-50 animate-in
                        fade-in slide-in-from-right-2 duration-500"
                        disabled={deleteSession.isPending}
                    >
                        <RotateCcw 
                            size={20} 
                            className="transition-all duration-300 hover:rotate-180 ease-out" 
                        />
                    </Button>
                )}
            </div>

            {!isIdle && (
                <div className="text-center text-sm text-gray-500 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400">
                    <p className="transition-all duration-300">Round {timer.currentRound} of {timer.totalRounds}</p>
                    {timer.isWorkSession ? (
                        <p className="transition-all duration-300 text-pink-600">Focus time - stay concentrated!</p>
                    ) : (
                        <p className="transition-all duration-300 text-green-600">Break time - relax and recharge!</p>
                    )}
                </div>
            )}
        </div>
    );
}