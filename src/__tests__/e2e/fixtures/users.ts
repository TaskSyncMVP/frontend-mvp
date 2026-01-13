export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User'
  },
  
  newUser: {
    email: 'newuser@example.com',
    password: 'NewUser123!@#',
    name: 'New Test User'
  },
  
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }
};

export const testTasks = {
  basicTask: {
    title: 'Test Task',
    description: 'This is a test task description',
    priority: 'medium' as const
  },
  
  urgentTask: {
    title: 'Urgent Task',
    description: 'This task needs immediate attention',
    priority: 'high' as const
  },
  
  simpleTask: {
    title: 'Simple Task',
    description: 'A simple task for testing',
    priority: 'low' as const
  }
};

export const pomodoroSettings = {
  default: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  },
  
  custom: {
    workDuration: 30,
    shortBreakDuration: 10,
    longBreakDuration: 20,
    sessionsUntilLongBreak: 3
  }
};