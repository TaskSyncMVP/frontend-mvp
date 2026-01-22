import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../../utils/auth-helpers';

test.describe('Тесты производительности', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
  });

  test('должен загружаться быстро', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/auth/login');
    
    // Ждем полной загрузки страницы
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Страница должна загружаться менее чем за 3 секунды
    expect(loadTime).toBeLessThan(3000);
  });

  test('должен быстро переключаться между страницами', async ({ page }) => {
    await authHelpers.login();
    
    const pages = ['/tasks', '/pomodoro', '/dashboard', '/settings'];
    
    for (const pageUrl of pages) {
      const startTime = Date.now();
      
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
      
      const navigationTime = Date.now() - startTime;
      
      // Навигация должна занимать менее 2 секунд
      expect(navigationTime).toBeLessThan(2000);
    }
  });

  test('должен эффективно обрабатывать большое количество задач', async ({ page }) => {
    await authHelpers.login();
    await page.goto('/tasks');
    
    // Создаем 50 задач для тестирования производительности
    const taskCount = 50;
    const startTime = Date.now();
    
    for (let i = 1; i <= taskCount; i++) {
      await page.click('[data-testid="create-task-button"]');
      await page.fill('[data-testid="task-title-input"]', `Задача ${i}`);
      await page.fill('[data-testid="task-description-input"]', `Описание задачи ${i}`);
      await page.click('[data-testid="save-task-button"]');
      
      // Ждем закрытия модального окна
      await page.waitForSelector('[data-testid="task-modal"]', { state: 'hidden' });
    }
    
    const creationTime = Date.now() - startTime;
    
    // Создание 50 задач должно занимать менее 30 секунд
    expect(creationTime).toBeLessThan(30000);
    
    // Проверяем, что все задачи отображаются
    const taskCards = page.locator('[data-testid="task-card"]');
    await expect(taskCards).toHaveCount(taskCount);
    
    // Тестируем производительность поиска
    const searchStartTime = Date.now();
    await page.fill('[data-testid="search-input"]', 'Задача 25');
    
    // Ждем обновления результатов поиска
    await page.waitForTimeout(500);
    
    const searchTime = Date.now() - searchStartTime;
    
    // Поиск должен работать быстро
    expect(searchTime).toBeLessThan(1000);
    
    // Проверяем результат поиска
    await expect(taskCards).toHaveCount(1);
    const foundTask = taskCards.first();
    await expect(foundTask).toContainText('Задача 25');
  });

  test('должен эффективно работать с Pomodoro таймером', async ({ page }) => {
    await authHelpers.login();
    await page.goto('/pomodoro');
    
    // Настраиваем короткие интервалы для тестирования
    await page.click('[data-testid="settings-button"]');
    await page.fill('[data-testid="work-duration-input"]', '1');
    await page.fill('[data-testid="short-break-input"]', '1');
    await page.click('[data-testid="save-settings-button"]');
    
    // Тестируем производительность обновления таймера
    const startTime = Date.now();
    await page.click('[data-testid="start-button"]');
    
    // Ждем несколько обновлений таймера
    await page.waitForTimeout(3000);
    
    const timerDisplay = page.locator('[data-testid="timer-display"]');
    const initialTime = await timerDisplay.textContent();
    
    await page.waitForTimeout(2000);
    
    const updatedTime = await timerDisplay.textContent();
    
    // Проверяем, что таймер обновляется
    expect(initialTime).not.toBe(updatedTime);
    
    // Останавливаем таймер
    await page.click('[data-testid="pause-button"]');
    
    const totalTime = Date.now() - startTime;
    
    // Операции с таймером должны быть быстрыми
    expect(totalTime).toBeLessThan(10000);
  });

  test('должен иметь хорошие Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Измеряем метрики производительности
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
              metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
            }
          });
          
          resolve(metrics);
        }).observe({ entryTypes: ['navigation'] });
        
        // Fallback если PerformanceObserver не сработает
        setTimeout(() => {
          resolve({
            loadTime: performance.timing.loadEventEnd - performance.timing.loadEventStart,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart
          });
        }, 1000);
      });
    });
    
    // Проверяем метрики
    expect(performanceMetrics.loadTime).toBeLessThan(2000); // Менее 2 секунд на загрузку
    expect(performanceMetrics.domContentLoaded).toBeLessThan(1500); // DOM готов менее чем за 1.5 секунды
  });

  test('должен эффективно использовать память', async ({ page }) => {
    await authHelpers.login();
    
    // Получаем начальное использование памяти
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Выполняем интенсивные операции
    await page.goto('/tasks');
    
    // Создаем и удаляем задачи
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="create-task-button"]');
      await page.fill('[data-testid="task-title-input"]', `Временная задача ${i}`);
      await page.click('[data-testid="save-task-button"]');
      await page.waitForSelector('[data-testid="task-modal"]', { state: 'hidden' });
      
      // Удаляем задачу
      const taskCard = page.locator(`[data-testid="task-card"]:has-text("Временная задача ${i}")`);
      await taskCard.locator('[data-testid="delete-task-button"]').click();
      await page.click('[data-testid="confirm-delete-button"]');
    }
    
    // Переходим между страницами
    const pages = ['/pomodoro', '/dashboard', '/settings', '/tasks'];
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
    }
    
    // Проверяем использование памяти после операций
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Если браузер поддерживает memory API, проверяем утечки памяти
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
      
      // Увеличение памяти не должно превышать 50%
      expect(memoryIncreasePercent).toBeLessThan(50);
    }
  });

  test('должен быстро отвечать на пользовательские действия', async ({ page }) => {
    await authHelpers.login();
    await page.goto('/tasks');
    
    // Тестируем время отклика на клики
    const responseTime = await page.evaluate(async () => {
      const button = document.querySelector('[data-testid="create-task-button"]') as HTMLElement;
      
      const startTime = performance.now();
      
      // Симулируем клик
      button.click();
      
      // Ждем появления модального окна
      await new Promise(resolve => {
        const observer = new MutationObserver(() => {
          const modal = document.querySelector('[data-testid="task-modal"]');
          if (modal && modal.getAttribute('data-state') === 'open') {
            observer.disconnect();
            resolve(null);
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        });
      });
      
      return performance.now() - startTime;
    });
    
    // Отклик на действие должен быть менее 100ms
    expect(responseTime).toBeLessThan(100);
  });

  test('должен эффективно работать на медленном соединении', async ({ page }) => {
    // Эмулируем медленное соединение
    await page.route('**/*', async (route) => {
      // Добавляем задержку для имитации медленного соединения
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    const startTime = Date.now();
    
    await authHelpers.login();
    await page.goto('/tasks');
    
    // Проверяем, что страница загружается даже на медленном соединении
    await page.waitForSelector('[data-testid="create-task-button"]');
    
    const loadTime = Date.now() - startTime;
    
    // Даже на медленном соединении загрузка должна быть разумной
    expect(loadTime).toBeLessThan(10000); // 10 секунд максимум
    
    // Проверяем, что основная функциональность работает
    await page.click('[data-testid="create-task-button"]');
    await expect(page.locator('[data-testid="task-modal"]')).toBeVisible();
  });
});