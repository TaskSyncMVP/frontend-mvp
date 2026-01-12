# 🧪 Тестирование TaskSync

## 📋 Обзор

Этот проект использует современный стек для тестирования:

- **Vitest** - быстрый unit test runner
- **React Testing Library** - тестирование React компонентов
- **MSW** - мокирование API запросов
- **Jest DOM** - дополнительные матчеры для DOM

## 🚀 Быстрый старт

### Установка зависимостей
```bash
pnpm install
```

### Запуск тестов
```bash
# Запуск всех тестов
pnpm test

# Запуск в watch режиме
pnpm test:watch

# Запуск с UI интерфейсом
pnpm test:ui

# Запуск с покрытием кода
pnpm test:coverage

# Одноразовый запуск (для CI)
pnpm test:run
```

## 📁 Структура тестов

```
src/__tests__/
├── setup.ts              # Настройка тестовой среды
├── mocks/                 # MSW моки для API
│   ├── server.ts         # MSW сервер
│   └── handlers.ts       # API handlers
├── utils/                 # Утилиты для тестов
│   └── test-utils.tsx    # Кастомный render с провайдерами
├── unit/                  # Unit тесты
│   ├── shared/           # Тесты shared утилит
│   ├── entities/         # Тесты entities
│   └── features/         # Тесты features
└── integration/           # Интеграционные тесты
```

## 🛠️ Утилиты для тестирования

### Кастомный render
```typescript
import { render, screen } from '../utils/test-utils'

// Автоматически оборачивает в провайдеры
render(<MyComponent />)
```

### Mock данные
```typescript
import { createMockUser, createMockTask } from '../utils/test-utils'

const user = createMockUser({ name: 'Custom Name' })
const task = createMockTask({ priority: 'high' })
```

### Таймеры
```typescript
import { mockTimers } from '../utils/test-utils'

const timers = mockTimers()
timers.advanceTime(1000) // Продвинуть на 1 секунду
timers.restore() // Восстановить реальные таймеры
```

## 🎯 Примеры тестов

### Unit тест для утилиты
```typescript
import { describe, it, expect } from 'vitest'
import { formatTaskTime } from '@shared/lib/date-utils'

describe('formatTaskTime', () => {
  it('should format time correctly', () => {
    const result = formatTaskTime('2024-01-01T10:30:00.000Z')
    expect(result).toBe('10:30')
  })
})
```

### Тест React компонента
```typescript
import { render, screen, fireEvent } from '../utils/test-utils'
import { TaskCard } from '@features/tasks/ui/TaskCard'

it('should toggle task completion', async () => {
  const task = createMockTask({ isCompleted: false })
  const onToggle = vi.fn()
  
  render(<TaskCard task={task} onToggle={onToggle} />)
  
  const checkbox = screen.getByRole('checkbox')
  fireEvent.click(checkbox)
  
  expect(onToggle).toHaveBeenCalledWith(task.id)
})
```

### API тест с MSW
```typescript
import { taskApi } from '@entities/task/model/api'

it('should create task successfully', async () => {
  const taskData = { name: 'New Task', priority: 'high' }
  const result = await taskApi.createTask(taskData)
  
  expect(result).toMatchObject(taskData)
  expect(result.id).toBeDefined()
})
```

## 🔧 Конфигурация

### vitest.config.ts
- Настроены path aliases (@shared, @features, etc.)
- Подключен jsdom environment
- Настроено покрытие кода с порогами
- Автоматический импорт глобальных функций

### MSW Handlers
- Полное покрытие API endpoints
- Реалистичные ответы и ошибки
- Поддержка различных сценариев

## 📊 Покрытие кода

Целевые показатели:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Исключения из покрытия:
- `node_modules/`
- Тестовые файлы
- Конфигурационные файлы
- `.next/` и `public/`

## 🚨 Правила написания тестов

### 1. Именование
- Файлы: `*.test.ts` или `*.test.tsx`
- Describe блоки: название функции/компонента
- It блоки: "should + действие"

### 2. Структура
```typescript
describe('ComponentName', () => {
  describe('method/prop name', () => {
    it('should do something when condition', () => {
      // Arrange
      // Act  
      // Assert
    })
  })
})
```

### 3. Моки
- Используйте MSW для API
- vi.mock() для модулей
- vi.fn() для функций

### 4. Assertions
- Предпочитайте специфичные матчеры
- `toMatchObject()` для частичного сравнения
- `toHaveBeenCalledWith()` для проверки вызовов

## 🔍 Отладка тестов

### Vitest UI
```bash
pnpm test:ui
```
Откроет браузерный интерфейс для интерактивной отладки.

### Debug в VS Code
1. Установите расширение "Vitest"
2. Используйте breakpoints в тестах
3. Запустите через Command Palette: "Vitest: Debug"

### Логирование
```typescript
import { screen } from '@testing-library/react'

screen.debug()

screen.debug(screen.getByRole('button'))
```

## 📚 Полезные ресурсы

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🤝 Вклад в тесты

1. Пишите тесты для новых функций
2. Обновляйте тесты при изменении API
3. Поддерживайте покрытие выше 80%
4. Следуйте принципам AAA (Arrange, Act, Assert)
5. Используйте описательные названия тестов