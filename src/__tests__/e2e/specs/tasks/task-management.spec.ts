import { test, expect } from '@playwright/test';
import { TasksPage } from '../../pages/TasksPage';
import { AuthHelpers } from '../../utils/auth-helpers';
import { testTasks } from '../../fixtures/users';

test.describe('Управление задачами', () => {
  let tasksPage: TasksPage;
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    authHelpers = new AuthHelpers(page);
    
    // Входим в систему перед каждым тестом
    await authHelpers.login();
    await tasksPage.goto();
  });

  test('должен отображать страницу задач', async () => {
    await expect(tasksPage.page).toHaveURL('/tasks');
    await expect(tasksPage.createTaskButton).toBeVisible();
  });

  test('должен создать новую задачу', async () => {
    const task = testTasks.basicTask;
    
    await tasksPage.createTask(task.title, task.description, task.priority);
    
    // Проверяем, что задача появилась в списке
    await tasksPage.expectTaskExists(task.title);
    
    // Проверяем содержимое карточки задачи
    const taskCard = await tasksPage.getTaskCard(task.title);
    await expect(taskCard).toContainText(task.description);
  });

  test('должен создать задачу только с заголовком', async () => {
    const taskTitle = 'Простая задача';
    
    await tasksPage.createTask(taskTitle);
    
    await tasksPage.expectTaskExists(taskTitle);
  });

  test('должен показать ошибку при создании задачи без заголовка', async () => {
    await tasksPage.createTaskButton.click();
    await expect(tasksPage.taskModal).toBeVisible();
    
    // Пытаемся сохранить без заголовка
    await tasksPage.saveTaskButton.click();
    
    // Проверяем ошибку валидации
    const titleError = tasksPage.page.locator('[data-testid="title-error"]');
    await expect(titleError).toBeVisible();
    await expect(titleError).toContainText('Заголовок обязателен');
  });

  test('должен редактировать существующую задачу', async () => {
    const originalTask = testTasks.basicTask;
    const newTitle = 'Обновленная задача';
    const newDescription = 'Обновленное описание';
    
    // Создаем задачу
    await tasksPage.createTask(originalTask.title, originalTask.description);
    
    // Редактируем задачу
    await tasksPage.editTask(originalTask.title, newTitle, newDescription);
    
    // Проверяем обновления
    await tasksPage.expectTaskExists(newTitle);
    await tasksPage.expectTaskNotExists(originalTask.title);
    
    const taskCard = await tasksPage.getTaskCard(newTitle);
    await expect(taskCard).toContainText(newDescription);
  });

  test('должен удалить задачу', async () => {
    const task = testTasks.basicTask;
    
    // Создаем задачу
    await tasksPage.createTask(task.title, task.description);
    await tasksPage.expectTaskExists(task.title);
    
    // Удаляем задачу
    await tasksPage.deleteTask(task.title);
    
    // Проверяем, что задача удалена
    await tasksPage.expectTaskNotExists(task.title);
  });

  test('должен отмечать задачу как выполненную', async () => {
    const task = testTasks.basicTask;
    
    // Создаем задачу
    await tasksPage.createTask(task.title, task.description);
    
    // Отмечаем как выполненную
    await tasksPage.toggleTaskComplete(task.title);
    
    // Проверяем, что задача отмечена как выполненная
    const taskCard = await tasksPage.getTaskCard(task.title);
    const checkbox = taskCard.locator('[data-testid="task-checkbox"]');
    await expect(checkbox).toBeChecked();
  });

  test('должен создать несколько задач с разными приоритетами', async () => {
    const tasks = [
      { ...testTasks.basicTask, title: 'Задача 1' },
      { ...testTasks.urgentTask, title: 'Задача 2' },
      { ...testTasks.simpleTask, title: 'Задача 3' }
    ];
    
    // Создаем задачи
    for (const task of tasks) {
      await tasksPage.createTask(task.title, task.description, task.priority);
    }
    
    // Проверяем, что все задачи созданы
    await tasksPage.expectTasksCount(3);
    
    for (const task of tasks) {
      await tasksPage.expectTaskExists(task.title);
    }
  });

  test('должен искать задачи по заголовку', async () => {
    const tasks = [
      { title: 'Важная задача', description: 'Описание 1' },
      { title: 'Обычная задача', description: 'Описание 2' },
      { title: 'Срочная задача', description: 'Описание 3' }
    ];
    
    // Создаем задачи
    for (const task of tasks) {
      await tasksPage.createTask(task.title, task.description);
    }
    
    // Ищем задачи со словом "важная"
    await tasksPage.searchTasks('важная');
    
    // Проверяем результаты поиска
    await tasksPage.expectTaskExists('Важная задача');
    await tasksPage.expectTaskNotExists('Обычная задача');
    await tasksPage.expectTaskNotExists('Срочная задача');
  });

  test('должен фильтровать задачи по статусу', async () => {
    const task1 = { title: 'Выполненная задача', description: 'Описание 1' };
    const task2 = { title: 'Невыполненная задача', description: 'Описание 2' };
    
    // Создаем задачи
    await tasksPage.createTask(task1.title, task1.description);
    await tasksPage.createTask(task2.title, task2.description);
    
    // Отмечаем первую задачу как выполненную
    await tasksPage.toggleTaskComplete(task1.title);
    
    // Фильтруем только выполненные задачи
    await tasksPage.filterTasks('completed');
    
    // Проверяем результаты фильтрации
    await tasksPage.expectTaskExists(task1.title);
    await tasksPage.expectTaskNotExists(task2.title);
  });

  test('должен удалить все задачи', async () => {
    const tasks = [
      { title: 'Задача 1', description: 'Описание 1' },
      { title: 'Задача 2', description: 'Описание 2' },
      { title: 'Задача 3', description: 'Описание 3' }
    ];
    
    // Создаем несколько задач
    for (const task of tasks) {
      await tasksPage.createTask(task.title, task.description);
    }
    
    await tasksPage.expectTasksCount(3);
    
    // Удаляем все задачи
    await tasksPage.deleteAllTasks();
    
    // Проверяем, что все задачи удалены
    await tasksPage.expectEmptyState();
    await tasksPage.expectTasksCount(0);
  });

  test('должен отменить создание задачи', async () => {
    await tasksPage.createTaskButton.click();
    await expect(tasksPage.taskModal).toBeVisible();
    
    // Заполняем форму
    await tasksPage.taskTitleInput.fill('Тестовая задача');
    await tasksPage.taskDescriptionInput.fill('Описание');
    
    // Отменяем создание
    await tasksPage.cancelTaskButton.click();
    
    // Проверяем, что модальное окно закрылось и задача не создалась
    await expect(tasksPage.taskModal).not.toBeVisible();
    await tasksPage.expectTaskNotExists('Тестовая задача');
  });
});