import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TasksPage } from '../../pages/TasksPage';
import { PomodoroPage } from '../../pages/PomodoroPage';
import { testUsers, testTasks } from '../../fixtures/users';

test.describe('Полный рабочий процесс TaskSync', () => {
  test('должен выполнить полный цикл: вход → создание задач → работа с Pomodoro → выход', async ({ page }) => {
    // === ЭТАП 1: АУТЕНТИФИКАЦИЯ ===
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Входим в систему
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await expect(page).toHaveURL('/');
    
    // === ЭТАП 2: СОЗДАНИЕ ЗАДАЧ ===
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    
    // Создаем несколько задач с разными приоритетами
    const tasks = [
      { title: 'Подготовить презентацию', description: 'Создать слайды для встречи', priority: 'high' },
      { title: 'Ответить на emails', description: 'Проверить и ответить на важные письма', priority: 'medium' },
      { title: 'Обновить документацию', description: 'Добавить новые разделы в wiki', priority: 'low' }
    ];
    
    for (const task of tasks) {
      await tasksPage.createTask(task.title, task.description, task.priority);
      await tasksPage.expectTaskExists(task.title);
    }
    
    // Проверяем, что все задачи созданы
    await tasksPage.expectTasksCount(3);
    
    // === ЭТАП 3: РАБОТА С ЗАДАЧАМИ ===
    // Отмечаем одну задачу как выполненную
    await tasksPage.toggleTaskComplete(tasks[1].title);
    
    // Редактируем задачу
    await tasksPage.editTask(tasks[0].title, 'Подготовить презентацию (обновлено)', 'Создать слайды и добавить графики');
    
    // === ЭТАП 4: НАСТРОЙКА И ИСПОЛЬЗОВАНИЕ POMODORO ===
    const pomodoroPage = new PomodoroPage(page);
    await pomodoroPage.goto();
    
    // Проверяем начальное состояние таймера
    await pomodoroPage.expectTimerDisplay('25:00');
    await pomodoroPage.expectSessionType('Работа');
    
    // Настраиваем кастомные интервалы для быстрого тестирования
    await pomodoroPage.updateSettings({
      workDuration: 1, // 1 минута для быстрого тестирования
      shortBreak: 1,
      longBreak: 2,
      sessions: 2
    });
    
    // Проверяем, что настройки применились
    await pomodoroPage.expectTimerDisplay('01:00');
    
    // Запускаем таймер
    await pomodoroPage.startTimer();
    await pomodoroPage.expectTimerRunning();
    
    // Ждем немного и проверяем, что время идет
    await page.waitForTimeout(2000);
    
    // Приостанавливаем и сбрасываем таймер
    await pomodoroPage.pauseTimer();
    await pomodoroPage.resetTimer();
    await pomodoroPage.expectTimerDisplay('01:00');
    
    // === ЭТАП 5: НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ ===
    // Проверяем навигацию через меню
    const navbar = page.locator('[data-testid="navbar"]');
    await expect(navbar).toBeVisible();
    
    // Переходим на главную страницу
    const homeLink = page.locator('[data-testid="home-link"]');
    await homeLink.click();
    await expect(page).toHaveURL('/');
    
    // Переходим на страницу статистики
    const statsLink = page.locator('[data-testid="stats-link"]');
    await statsLink.click();
    await expect(page).toHaveURL('/dashboard');
    
    // Проверяем отображение статистики
    const statisticsCards = page.locator('[data-testid="statistic-card"]');
    await expect(statisticsCards).toHaveCount.greaterThan(0);
    
    // === ЭТАП 6: НАСТРОЙКИ ПРОФИЛЯ ===
    const settingsLink = page.locator('[data-testid="settings-link"]');
    await settingsLink.click();
    await expect(page).toHaveURL('/settings');
    
    // Проверяем форму настроек
    const settingsForm = page.locator('[data-testid="settings-form"]');
    await expect(settingsForm).toBeVisible();
    
    // === ЭТАП 7: ПРОВЕРКА АДАПТИВНОСТИ ===
    // Тестируем мобильную версию
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Проверяем, что навигация адаптировалась
    const mobileMenu = page.locator('[data-testid="mobile-menu-trigger"]');
    await expect(mobileMenu).toBeVisible();
    
    // Возвращаем десктопный размер
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // === ЭТАП 8: ВЫХОД ИЗ СИСТЕМЫ ===
    const userMenu = page.locator('[data-testid="user-menu-trigger"]');
    await userMenu.click();
    
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await logoutButton.click();
    
    // Проверяем перенаправление на страницу входа
    await expect(page).toHaveURL('/auth/login');
    
    // Проверяем, что пользователь действительно вышел
    await page.goto('/');
    await expect(page).toHaveURL('/auth/login'); // Должно перенаправить на вход
  });

  test('должен сохранить данные между сессиями', async ({ page }) => {
    // === СОЗДАНИЕ ДАННЫХ ===
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    
    // Создаем задачу
    const testTask = { title: 'Тестовая задача для сохранения', description: 'Проверка персистентности данных' };
    await tasksPage.createTask(testTask.title, testTask.description);
    await tasksPage.expectTaskExists(testTask.title);
    
    // Настраиваем Pomodoro
    const pomodoroPage = new PomodoroPage(page);
    await pomodoroPage.goto();
    await pomodoroPage.updateSettings({
      workDuration: 30,
      shortBreak: 10
    });
    
    // === ВЫХОД И ПОВТОРНЫЙ ВХОД ===
    const userMenu = page.locator('[data-testid="user-menu-trigger"]');
    await userMenu.click();
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await logoutButton.click();
    
    // Входим снова
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    
    // === ПРОВЕРКА СОХРАНЕНИЯ ДАННЫХ ===
    // Проверяем, что задача сохранилась
    await tasksPage.goto();
    await tasksPage.expectTaskExists(testTask.title);
    
    // Проверяем, что настройки Pomodoro сохранились
    await pomodoroPage.goto();
    await pomodoroPage.expectTimerDisplay('30:00');
  });

  test('должен корректно обрабатывать ошибки сети', async ({ page }) => {
    // Входим в систему
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    
    // Имитируем отключение сети
    await page.context().setOffline(true);
    
    const tasksPage = new TasksPage(page);
    await tasksPage.goto();
    
    // Пытаемся создать задачу при отсутствии сети
    await tasksPage.createTaskButton.click();
    await tasksPage.taskTitleInput.fill('Задача без сети');
    await tasksPage.saveTaskButton.click();
    
    // Проверяем отображение ошибки сети
    const networkError = page.locator('[data-testid="network-error"]');
    await expect(networkError).toBeVisible();
    
    // Восстанавливаем сеть
    await page.context().setOffline(false);
    
    // Повторяем попытку создания задачи
    await tasksPage.saveTaskButton.click();
    
    // Проверяем, что задача создалась после восстановления сети
    await expect(tasksPage.taskModal).not.toBeVisible();
    await tasksPage.expectTaskExists('Задача без сети');
  });

  test('должен работать с несколькими вкладками', async ({ browser }) => {
    // Создаем два контекста (как две вкладки)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Входим в обеих вкладках
    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);
    
    await loginPage1.goto();
    await loginPage1.login(testUsers.validUser.email, testUsers.validUser.password);
    
    await loginPage2.goto();
    await loginPage2.login(testUsers.validUser.email, testUsers.validUser.password);
    
    // Создаем задачу в первой вкладке
    const tasksPage1 = new TasksPage(page1);
    await tasksPage1.goto();
    await tasksPage1.createTask('Задача из вкладки 1', 'Тест синхронизации');
    
    // Проверяем, что задача появилась во второй вкладке
    const tasksPage2 = new TasksPage(page2);
    await tasksPage2.goto();
    await page2.reload(); // Обновляем для получения новых данных
    await tasksPage2.expectTaskExists('Задача из вкладки 1');
    
    await context1.close();
    await context2.close();
  });
});