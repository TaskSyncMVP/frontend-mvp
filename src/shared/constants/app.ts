export const APP_CONSTANTS = {
  CALENDAR_DAYS_RANGE: 7,
  
  WEEK_DAYS: 7,
  
  CACHE_TIME: {
    TASKS: 1000 * 60 * 5,
    USER: 1000 * 60 * 10,
  },
  
  ANIMATION_DURATION: 200,
  
  TIME_FORMAT: {
    HOUR_12: { hour: 'numeric', minute: '2-digit', hour12: true } as const,
    DATE_SHORT: { month: 'short', day: 'numeric' } as const,
    DATE_WITH_TIME: { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    } as const,
  }
} as const;

export type TimeFormatOptions = typeof APP_CONSTANTS.TIME_FORMAT[keyof typeof APP_CONSTANTS.TIME_FORMAT];