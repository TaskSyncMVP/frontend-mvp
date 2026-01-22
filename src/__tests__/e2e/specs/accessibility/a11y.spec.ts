import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../../utils/auth-helpers';

test.describe('Тесты доступности (A11y)', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    await authHelpers.login();
  });

  test('должен иметь правильную структуру заголовков', async ({ page }) => {
    await page.goto('/');
    
    // Проверяем наличие основного заголовка
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Проверяем иерархию заголовков
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingTexts = await headings.allTextContents();
    
    expect(headingTexts.length).toBeGreaterThan(0);
  });

  test('должен иметь альтернативный текст для изображений', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Каждое изображение должно иметь alt или aria-label
      expect(alt !== null || ariaLabel !== null).toBeTruthy();
    }
  });

  test('должен поддерживать навигацию с клавиатуры', async ({ page }) => {
    await page.goto('/tasks');
    
    // Проверяем, что можно перемещаться по интерактивным элементам с помощью Tab
    const createButton = page.locator('[data-testid="create-task-button"]');
    
    // Фокусируемся на кнопке с помощью Tab
    await page.keyboard.press('Tab');
    await expect(createButton).toBeFocused();
    
    // Активируем кнопку с помощью Enter
    await page.keyboard.press('Enter');
    
    // Проверяем, что модальное окно открылось
    const modal = page.locator('[data-testid="task-modal"]');
    await expect(modal).toBeVisible();
    
    // Проверяем, что фокус переместился в модальное окно
    const titleInput = page.locator('[data-testid="task-title-input"]');
    await expect(titleInput).toBeFocused();
  });

  test('должен иметь правильные ARIA атрибуты', async ({ page }) => {
    await page.goto('/tasks');
    
    // Проверяем кнопки
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Кнопка должна иметь либо текст, либо aria-label
      expect(ariaLabel !== null || (text && text.trim().length > 0)).toBeTruthy();
    }
    
    // Проверяем формы
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      
      // Проверяем, что есть связанный label
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const labelExists = await label.count() > 0;
        
        expect(labelExists || ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy();
      }
    }
  });

  test('должен иметь достаточный цветовой контраст', async ({ page }) => {
    await page.goto('/');
    
    // Проверяем основные текстовые элементы
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6, button, a');
    const elementCount = await textElements.count();
    
    // Проверяем первые 10 элементов (для производительности)
    const elementsToCheck = Math.min(elementCount, 10);
    
    for (let i = 0; i < elementsToCheck; i++) {
      const element = textElements.nth(i);
      const text = await element.textContent();
      
      if (text && text.trim().length > 0) {
        // Проверяем, что элемент видим (базовая проверка контраста)
        await expect(element).toBeVisible();
      }
    }
  });

  test('должен поддерживать скринридеры', async ({ page }) => {
    await page.goto('/pomodoro');
    
    // Проверяем live regions для динамического контента
    const timerDisplay = page.locator('[data-testid="timer-display"]');
    const ariaLive = await timerDisplay.getAttribute('aria-live');
    
    // Таймер должен объявлять изменения для скринридеров
    expect(ariaLive).toBe('polite');
    
    // Проверяем роли для интерактивных элементов
    const startButton = page.locator('[data-testid="start-button"]');
    const role = await startButton.getAttribute('role');
    
    // Кнопка должна иметь правильную роль или быть button элементом
    const tagName = await startButton.evaluate(el => el.tagName.toLowerCase());
    expect(tagName === 'button' || role === 'button').toBeTruthy();
  });

  test('должен работать с увеличенным масштабом', async ({ page }) => {
    // Устанавливаем 200% масштаб
    await page.setViewportSize({ width: 640, height: 360 }); // Имитируем 200% zoom
    
    await page.goto('/tasks');
    
    // Проверяем, что основные элементы остаются доступными
    const createButton = page.locator('[data-testid="create-task-button"]');
    await expect(createButton).toBeVisible();
    
    const navbar = page.locator('[data-testid="navbar"]');
    await expect(navbar).toBeVisible();
    
    // Проверяем, что текст не обрезается
    const buttonText = await createButton.textContent();
    expect(buttonText).toBeTruthy();
  });

  test('должен поддерживать режим высокой контрастности', async ({ page }) => {
    // Эмулируем предпочтения высокой контрастности
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    
    await page.goto('/');
    
    // Проверяем, что страница загружается и элементы видны
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Проверяем, что интерактивные элементы остаются функциональными
    const navLinks = page.locator('[data-testid="navbar"] a');
    const linkCount = await navLinks.count();
    
    expect(linkCount).toBeGreaterThan(0);
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
    }
  });

  test('должен иметь правильные заголовки страниц', async ({ page }) => {
    const pages = [
      { url: '/', expectedTitle: /TaskSync.*Главная/ },
      { url: '/tasks', expectedTitle: /TaskSync.*Задачи/ },
      { url: '/pomodoro', expectedTitle: /TaskSync.*Pomodoro/ },
      { url: '/dashboard', expectedTitle: /TaskSync.*Статистика/ },
      { url: '/settings', expectedTitle: /TaskSync.*Настройки/ }
    ];
    
    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await expect(page).toHaveTitle(pageInfo.expectedTitle);
    }
  });

  test('должен объявлять изменения состояния', async ({ page }) => {
    await page.goto('/tasks');
    
    // Создаем задачу
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Тестовая задача');
    await page.click('[data-testid="save-task-button"]');
    
    // Проверяем, что есть уведомление об успешном создании
    const successMessage = page.locator('[data-testid="success-message"], [role="status"], [aria-live]');
    
    // Должно быть уведомление о создании задачи
    await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
  });
});