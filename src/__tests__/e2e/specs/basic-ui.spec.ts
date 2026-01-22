import { test, expect } from '@playwright/test';

test.describe('Базовые UI тесты', () => {
  test('должен отображать страницу входа с правильными элементами', async ({ page }) => {
    await page.goto('/login');
    
    // Проверяем заголовок страницы
    await expect(page).toHaveTitle(/Task Sync/);
    
    // Проверяем наличие формы входа
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const loginButton = page.locator('[data-testid="login-button"]');
    const registerLink = page.locator('[data-testid="register-link"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    await expect(registerLink).toBeVisible();
    
    // Проверяем placeholder'ы
    await expect(emailInput).toHaveAttribute('placeholder', 'Email');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
    
    // Проверяем текст на кнопках
    await expect(loginButton).toContainText('Enter');
    await expect(registerLink).toContainText('Registration');
  });

  test('должен переходить на страницу регистрации', async ({ page }) => {
    await page.goto('/login');
    
    // Нажимаем ссылку регистрации
    const registerLink = page.locator('[data-testid="register-link"]');
    await registerLink.click();
    
    // Проверяем переход на страницу регистрации
    await expect(page).toHaveURL('/registration');
    
    // Проверяем элементы страницы регистрации
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const registerButton = page.locator('[data-testid="register-button"]');
    const loginLink = page.locator('[data-testid="login-link"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(registerButton).toBeVisible();
    await expect(loginLink).toBeVisible();
  });

  test('должен показывать ошибки валидации при пустых полях', async ({ page }) => {
    await page.goto('/login');
    
    // Нажимаем кнопку входа без заполнения полей
    const loginButton = page.locator('[data-testid="login-button"]');
    await loginButton.click();
    
    // Ждем появления ошибок валидации
    await page.waitForTimeout(1000);
    
    // Проверяем наличие ошибок валидации
    const emailError = page.locator('[data-testid="email-error"]');
    const passwordError = page.locator('[data-testid="password-error"]');
    
    // Проверяем, что хотя бы одна из ошибок видна
    const hasEmailError = await emailError.isVisible().catch(() => false);
    const hasPasswordError = await passwordError.isVisible().catch(() => false);
    
    expect(hasEmailError || hasPasswordError).toBeTruthy();
  });

  test('должен показывать ошибку при неверном формате email', async ({ page }) => {
    await page.goto('/login');
    
    // Вводим неверный email
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const loginButton = page.locator('[data-testid="login-button"]');
    
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password123');
    await loginButton.click();
    
    // Ждем появления ошибки валидации
    await page.waitForTimeout(1000);
    
    // Проверяем ошибку валидации email
    const emailError = page.locator('[data-testid="email-error"]');
    const hasEmailError = await emailError.isVisible().catch(() => false);
    
    expect(hasEmailError).toBeTruthy();
  });

  test('должен работать переключатель видимости пароля', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.locator('[data-testid="password-input"]');
    
    // Проверяем, что поле пароля изначально скрыто
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Вводим пароль
    await passwordInput.fill('testpassword');
    
    // Ищем кнопку переключения видимости пароля
    const passwordToggle = page.locator('button').filter({ has: page.locator('svg') }).nth(0);
    
    if (await passwordToggle.isVisible()) {
      // Нажимаем кнопку переключения
      await passwordToggle.click();
      
      // Проверяем, что тип поля изменился на text
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Нажимаем еще раз, чтобы скрыть пароль
      await passwordToggle.click();
      
      // Проверяем, что тип поля вернулся к password
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('должен корректно отображаться на мобильных устройствах', async ({ page }) => {
    // Устанавливаем мобильный размер экрана
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    
    // Проверяем, что элементы все еще видны на мобильном экране
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const loginButton = page.locator('[data-testid="login-button"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Проверяем, что элементы не выходят за границы экрана
    const emailBox = await emailInput.boundingBox();
    const passwordBox = await passwordInput.boundingBox();
    const buttonBox = await loginButton.boundingBox();
    
    expect(emailBox?.width).toBeLessThanOrEqual(375);
    expect(passwordBox?.width).toBeLessThanOrEqual(375);
    expect(buttonBox?.width).toBeLessThanOrEqual(375);
  });
});