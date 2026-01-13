import { test, expect } from '@playwright/test';

test.describe('Базовый тест входа', () => {
  test('должен отображать страницу входа', async ({ page }) => {
    await page.goto('/login');
    
    // Проверяем, что страница загрузилась
    await expect(page).toHaveTitle(/Task Sync/);
    
    // Проверяем наличие основных элементов
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const loginButton = page.locator('[data-testid="login-button"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Проверяем текст на кнопке
    await expect(loginButton).toContainText('Enter');
  });

  test('должен показать ошибки валидации при пустых полях', async ({ page }) => {
    await page.goto('/login');
    
    // Нажимаем кнопку входа без заполнения полей
    await page.click('[data-testid="login-button"]');
    
    // Ждем появления ошибок валидации
    await page.waitForTimeout(1000);
    
    // Проверяем наличие ошибок (они могут появиться как в форме, так и через toast)
    const emailError = page.locator('[data-testid="email-error"]');
    const passwordError = page.locator('[data-testid="password-error"]');
    
    // Проверяем, что хотя бы одна из ошибок видна
    const hasEmailError = await emailError.isVisible().catch(() => false);
    const hasPasswordError = await passwordError.isVisible().catch(() => false);
    
    expect(hasEmailError || hasPasswordError).toBeTruthy();
  });
});