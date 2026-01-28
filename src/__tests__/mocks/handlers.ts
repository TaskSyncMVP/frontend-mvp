import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api'

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  workInterval: 25,
  breakInterval: 5,
  intervalsCount: 4,
  createdAt: '2024-01-01T00:00:00.000Z'
}

const mockTasks = [
  {
    id: '1',
    name: 'Test Task 1',
    priority: 'high' as const,
    isCompleted: false,
    userId: '1',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Test Task 2',
    priority: 'medium' as const,
    isCompleted: true,
    userId: '1',
    createdAt: '2024-01-01T11:00:00.000Z',
    updatedAt: '2024-01-01T11:00:00.000Z'
  }
]

const mockPomodoroSession = {
  id: '1',
  isCompleted: false,
  userId: '1',
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-01T12:00:00.000Z'
}

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      })
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      user: { ...mockUser, email: body.email },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    })
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  http.post(`${API_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token'
    })
  }),

  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json(mockUser)
  }),

  // Tasks endpoints
  http.get(`${API_URL}/user/tasks`, () => {
    return HttpResponse.json(mockTasks)
  }),

  http.post(`${API_URL}/user/tasks`, async ({ request }) => {
    const body = await request.json() as { name: string; priority: string }
    
    const newTask = {
      id: String(Date.now()),
      name: body.name,
      priority: body.priority as 'low' | 'medium' | 'high',
      isCompleted: false,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.put(`${API_URL}/user/tasks/:id`, async ({ params, request }) => {
    const body = await request.json() as Partial<{ name: string; priority: string; isCompleted: boolean }>
    const taskId = params.id as string
    
    const existingTask = mockTasks.find(task => task.id === taskId)
    if (!existingTask) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      )
    }
    
    const updatedTask = {
      ...existingTask,
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return HttpResponse.json(updatedTask)
  }),

  http.delete(`${API_URL}/user/tasks/:id`, ({ params }) => {
    const taskId = params.id as string
    
    const taskExists = mockTasks.some(task => task.id === taskId)
    if (!taskExists) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ message: 'Task deleted successfully' })
  }),

  http.put(`${API_URL}/user/tasks/:id/move`, async ({ params, request }) => {
    const taskId = params.id as string
    const body = await request.json() as { targetDate: string }
    
    const task = mockTasks.find(task => task.id === taskId)
    if (!task) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      )
    }

    // Extract clean name from task
    const extractDateFromTaskName = (taskName: string): { date: string | null; cleanName: string } => {
      const datePrefix = taskName.match(/^\[(\d{4}-\d{2}-\d{2})\]\s*/);
      if (datePrefix) {
        return {
          date: datePrefix[1],
          cleanName: taskName.replace(/^\[(\d{4}-\d{2}-\d{2})\]\s*/, '')
        };
      }
      return { date: null, cleanName: taskName };
    };

    const { cleanName } = extractDateFromTaskName(task.name);
    const today = new Date().toISOString().split('T')[0];
    
    let newTaskName = cleanName;
    if (body.targetDate !== today) {
      newTaskName = `[${body.targetDate}] ${cleanName}`;
    }

    const updatedTask = {
      ...task,
      name: newTaskName,
      updatedAt: new Date().toISOString()
    }
    
    return HttpResponse.json(updatedTask)
  }),

  // Pomodoro endpoints
  http.get(`${API_URL}/pomodoro/current`, () => {
    return HttpResponse.json(mockPomodoroSession)
  }),

  http.post(`${API_URL}/pomodoro`, () => {
    const newSession = {
      ...mockPomodoroSession,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return HttpResponse.json(newSession, { status: 201 })
  }),

  http.put(`${API_URL}/pomodoro/:id`, async ({ params, request }) => {
    const body = await request.json() as { isCompleted?: boolean }
    const sessionId = params.id as string
    
    if (sessionId !== mockPomodoroSession.id) {
      return HttpResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      )
    }
    
    const updatedSession = {
      ...mockPomodoroSession,
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return HttpResponse.json(updatedSession)
  }),

  http.delete(`${API_URL}/pomodoro/:id`, ({ params }) => {
    const sessionId = params.id as string
    
    if (sessionId !== mockPomodoroSession.id) {
      return HttpResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ message: 'Session deleted successfully' })
  }),

  // Profile endpoints
  http.put(`${API_URL}/user/profile`, async ({ request }) => {
    const body = await request.json() as Partial<{ name: string; password: string; workInterval: number; breakInterval: number; intervalsCount: number }>
    
    const updatedUser = {
      ...mockUser,
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return HttpResponse.json(updatedUser)
  }),

  http.get(`${API_URL}/user/profile`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json({ user: mockUser })
  }),

  // Auth refresh token endpoint
  http.post(`${API_URL}/auth/login/access-token`, () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token'
    })
  })
]