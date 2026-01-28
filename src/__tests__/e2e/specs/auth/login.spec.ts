import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { testUsers } from '../../fixtures/users';

test.describe('Аутентификация - Вход', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('должен отображать форму входа', async () => {
    await loginPage.expectToBeVisible();
    
    await expect(loginPage.page).toHaveTitle(/TaskSync/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('должен успешно войти с валидными данными', async ({ page }) => {
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    
    // Проверяем перенаправление на главную страницу
    await expect(page).toHaveURL('/home');
    
    // Проверяем, что пользователь залогинен (есть меню пользователя)
    const userMenu = page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenu).toBeVisible();
  });

  test('должен показать ошибку при неверных данных', async () => {
    await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
    
    // Проверяем, что остались на странице входа
    await expect(loginPage.page).toHaveURL('/login');
    
    // Проверяем отображение ошибки
    await loginPage.expectErrorMessage('Wrong login or password');
  });

  test('должен показать ошибки валидации для пустых полей', async () => {
    await loginPage.loginButton.click();
    
    // Проверяем ошибки валидации
    const emailError = loginPage.page.locator('[data-testid="email-error"]');
    const passwordError = loginPage.page.locator('[data-testid="password-error"]');
    
    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
  });

  test('должен показать ошибку валидации для неверного формата email', async () => {
    await loginPage.login('invalid-email', 'password123');
    
    const emailError = loginPage.page.locator('[data-testid="email-error"]');
    await expect(emailError).toContainText('Введите корректный email');
  });

  test('должен перенаправить на страницу регистрации', async ({ page }) => {
    await loginPage.goToRegister();
    
    await expect(page).toHaveURL('/registration');
  });

  test('должен сохранить состояние после перезагрузки страницы', async ({ page }) => {
    // Входим в систему
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    await expect(page).toHaveURL('/home');
    
    // Перезагружаем страницу
    await page.reload();
    
    // Проверяем, что пользователь все еще залогинен
    const userMenu = page.locator('[data-testid="user-menu-trigger"]');
    await expect(userMenu).toBeVisible();
  });

  test('должен работать переход по ссылке "Забыли пароль?"', async ({ page }) => {
    await loginPage.forgotPasswordLink.click();
    
    // Проверяем переход на страницу восстановления пароля
    await expect(page).toHaveURL('/forgot-password');
  });
});