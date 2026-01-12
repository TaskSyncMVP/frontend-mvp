'use client'
import { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroTimer } from '@/entities/pomodoro';
import { usePomodoroSettings } from './pomodoro-hooks';
import { useCurrentPomodoroSession, useCreatePomodoroSession } from '@/entities/pomodoro';

export const usePomodoroTimer = () => {
    const { workInterval, breakInterval, intervalsCount } = usePomodoroSettings();
    const { data: currentSession } = useCurrentPomodoroSession();
    const createSession = useCreatePomodoroSession();

    // Инициализируем состояние с актуальными настройками
    const [timer, setTimer] = useState<PomodoroTimer>(() => ({
        state: 'idle',
        currentRound: 1,
        totalRounds: intervalsCount || 4, // Значение по умолчанию
        secondsLeft: (workInterval || 25) * 60, // Значение по умолчанию
        isWorkSession: true,
    }));

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Основной таймер - только для управления интервалом
    useEffect(() => {
        if (timer.state === 'work' || timer.state === 'break') {
            intervalRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev.secondsLeft <= 1) {
                        // Время вышло
                        if (prev.isWorkSession) {
                            // Завершили рабочий интервал
                            if (prev.currentRound >= prev.totalRounds) {
                                // Все раунды завершены
                                return {
                                    ...prev,
                                    state: 'idle',
                                    currentRound: 1,
                                    secondsLeft: workInterval * 60,
                                    isWorkSession: true,
                                };
                            } else {
                                // Переходим к перерыву
                                return {
                                    ...prev,
                                    state: 'break',
                                    secondsLeft: breakInterval * 60,
                                    isWorkSession: false,
                                };
                            }
                        } else {
                            // Завершили перерыв, переходим к следующему рабочему интервалу
                            return {
                                ...prev,
                                state: 'work',
                                currentRound: prev.currentRound + 1,
                                secondsLeft: workInterval * 60,
                                isWorkSession: true,
                            };
                        }
                    }
                    
                    return {
                        ...prev,
                        secondsLeft: prev.secondsLeft - 1,
                    };
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timer.state, workInterval, breakInterval]);

    const startTimer = useCallback(async () => {
        if (timer.state === 'idle') {
            // Создаем новую сессию только при первом запуске
            try {
                await createSession.mutateAsync();
                setTimer(prev => ({
                    ...prev,
                    state: 'work',
                }));
            } catch (error) {
                console.error('Failed to start pomodoro session:', error);
                // Продолжаем работу локально даже если API недоступен
                setTimer(prev => ({
                    ...prev,
                    state: 'work',
                }));
            }
        } else if (timer.state === 'paused') {
            setTimer(prev => ({
                ...prev,
                state: prev.isWorkSession ? 'work' : 'break',
            }));
        }
    }, [timer.state, createSession]);

    const pauseTimer = useCallback(() => {
        if (timer.state === 'work' || timer.state === 'break') {
            setTimer(prev => ({
                ...prev,
                state: 'paused',
            }));
        }
    }, [timer.state]);

    const resetTimer = useCallback(() => {
        setTimer({
            state: 'idle',
            currentRound: 1,
            totalRounds: intervalsCount,
            secondsLeft: workInterval * 60,
            isWorkSession: true,
        });
    }, [intervalsCount, workInterval]);

    const toggleTimer = useCallback(() => {
        if (timer.state === 'idle' || timer.state === 'paused') {
            startTimer();
        } else {
            pauseTimer();
        }
    }, [timer.state, startTimer, pauseTimer]);

    // Форматирование времени
    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    // Получение прогресса в процентах
    const getProgress = useCallback((): number => {
        const totalSeconds = timer.isWorkSession ? workInterval * 60 : breakInterval * 60;
        const progress = ((totalSeconds - timer.secondsLeft) / totalSeconds) * 100;
        // Используем более точное округление для плавной анимации
        return Math.min(100, Math.max(0, Number(progress.toFixed(2))));
    }, [timer.secondsLeft, timer.isWorkSession, workInterval, breakInterval]);

    return {
        timer,
        startTimer,
        pauseTimer,
        resetTimer,
        toggleTimer,
        formatTime: formatTime(timer.secondsLeft),
        progress: getProgress(),
        isRunning: timer.state === 'work' || timer.state === 'break',
        isPaused: timer.state === 'paused',
        isIdle: timer.state === 'idle',
        currentSession,
    };
};