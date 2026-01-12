export interface PomodoroEvents {
  'pomodoro:state-change': CustomEvent<{ isRunning: boolean }>;
  'navbar:pomodoro-toggle': CustomEvent<void>;
  'navbar:settings-submit': CustomEvent<void>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface WindowEventMap extends PomodoroEvents {}
}

export type PomodoroEventName = keyof PomodoroEvents;