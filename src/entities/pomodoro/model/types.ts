export interface PomodoroSession {
  id: string;
  isCompleted?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroRound {
  totalSeconds: number;
  isCompleted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreatePomodoroSessionDto {
}

export interface UpdatePomodoroSessionDto {
  isCompleted?: boolean;
  totalSeconds?: number;
}

export type PomodoroState = 'idle' | 'work' | 'break' | 'paused';

export interface PomodoroTimer {
  state: PomodoroState;
  currentRound: number;
  totalRounds: number;
  secondsLeft: number;
  isWorkSession: boolean;
}