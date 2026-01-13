# E2E тесты TaskSync

Этот каталог содержит end-to-end тесты для приложения TaskSync, использующие Playwright.

## Структура

```
e2e/
├── README.md                    # Этот файл
├── fixtures/                    # Тестовые данные и фикстуры
├── pages/                       # Page Object Model
├── specs/                       # Тестовые сценарии
│   ├── auth/                    # Тесты аутентификации
│   ├── tasks/                   # Тесты управления задачами
│   ├── pomodoro/                # Тесты Pomodoro таймера
│   └── settings/                # Тесты настроек
└── utils/                       # Вспомогательные утилиты
```

## Запуск тестов

```bash
# Запуск всех E2E тестов
pnpm test:e2e

# Запуск в UI режиме
pnpm test:e2e:ui

# Запуск конкретного теста
pnpm test:e2e auth/login.spec.ts

# Запуск в headed режиме (с браузером)
pnpm test:e2e --headed

# Запуск только в Chrome
pnpm test:e2e --project=chromium
```

## Соглашения

1. **Именование файлов**: `*.spec.ts`
2. **Page Objects**: Используем POM для переиспользования
3. **Тестовые данные**: Храним в `fixtures/`
4. **Селекторы**: Используем `data-testid` атрибуты
5. **Ожидания**: Всегда используем `expect` с таймаутами