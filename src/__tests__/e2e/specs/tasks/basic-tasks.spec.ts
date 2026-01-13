import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../../utils/auth-helpers';

test.describe('Базовые тесты задач', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    
    // Входим в систему перед каждым тестом
    await authHelpers.login();
  });

  test('должен отображать страницу задач', async ({ page }) => {
    await page.goto('/tasks');
    
    // Проверяем, что страница загрузилась
    await expect(page).toHaveTitle(/Task Sync/);
    
    // Проверяем наличие кнопки создания задачи
    const createButton = page.locator('[data-testid="create-task-button"]').first();
    await expect(createButton).toBeVisible();
    await expect(createButton).toContainText('Create task');
  });

  test('должен открыть форму создания задачи', async ({ page }) => {
    await page.goto('/tasks');
    
    // Нажимаем кнопку создания задачи
    const createButton = page.locator('[data-testid="create-task-button"]').first();
    await createButton.click();
    
    // Проверяем, что форма появилась
    const taskForm = page.locator('[data-testid="task-form"]');
    await expect(taskForm).toBeVisible();
    
    // Проверяем наличие полей формы
    const titleInput = page.locator('[data-testid="task-title-input"]');
    const saveButton = page.locator('[data-testid="save-task-button"]');
    
    await expect(titleInput).toBeVisible();
    await expect(saveButton).toBeVisible();
  });

  test('должен создать новую задачу', async ({ page }) => {
    await page.goto('/tasks');
    
    // Открываем форму создания задачи
    const createButton = page.locator('[data-testid="create-task-button"]').first();
    await createButton.click();
    
    // Заполняем форму
    const titleInput = page.locator('[data-testid="task-title-input"]');
    await titleInput.fill('Тестовая задача');
    
    // Сохраняем задачу
    const saveButton = page.locator('[data-testid="save-task-button"]');
    await saveButton.click();
    
    // Ждем, пока форма закроется
    const taskForm = page.locator('[data-testid="task-form"]');
    await expect(taskForm).not.toBeVisible();
    
    // Проверяем, что задача появилась в списке
    const taskCard = page.locator('[data-testid="task-card"]').filter({ hasText: 'Тестовая задача' });
    await expect(taskCard).toBeVisible();
  });

  test('должен показать ошибку при создании задачи без заголовка', async ({ page }) => {
    await page.goto('/tasks');
    
    // Открываем форму создания задачи
    const createButton = page.locator('[data-testid="create-task-button"]').first();
    await createButton.click();
    
    // Пытаемся сохранить без заголовка
    const saveButton = page.locator('[data-testid="save-task-button"]');
    await saveButton.click();
    
    // Проверяем ошибку валидации
    const titleError = page.locator('[data-testid="title-error"]');
    await expect(titleError).toBeVisible();
  });
});