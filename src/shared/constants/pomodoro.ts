export const POMODORO_DEFAULTS = {
  WORK_INTERVAL: 25,
  BREAK_INTERVAL: 5,
  INTERVALS_COUNT: 4,
  MAX_WORK_INTERVAL: 60,
  MAX_BREAK_INTERVAL: 30,
  MAX_INTERVALS: 10,
  MIN_INTERVAL: 1,
} as const;

export const POMODORO_STORAGE_KEYS = {
  WAS_RUNNING: 'pomodoro-was-running',
} as const;

export const POMODORO_EVENTS = {
  STATE_CHANGE: 'pomodoro:state-change',
  NAVBAR_TOGGLE: 'navbar:pomodoro-toggle',
} as const;