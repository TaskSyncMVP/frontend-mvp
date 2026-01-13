import { Page, expect } from '@playwright/test';
import { testUsers } from '../fixtures/users';

export class AuthHelpers {
  constructor(private page: Page) {}

  async login(email: string = testUsers.validUser.email, password: string = testUsers.validUser.password) {
    await this.page.goto('/login');
    
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    
    // Ждем перенаправления на главную страницу
    await expect(this.page).toHaveURL('/home');
  }

  async register(userData = testUsers.newUser) {
    await this.page.goto('/registration');
    
    await this.page.fill('[data-testid="email-input"]', userData.email);
    await this.page.fill('[data-testid="password-input"]', userData.password);
    await this.page.click('[data-testid="register-button"]');
    
    // Ждем перенаправления на главную страницу
    await expect(this.page).toHaveURL('/home');
  }

  async logout() {
    await this.page.click('[data-testid="user-menu-trigger"]');
    await this.page.click('[data-testid="logout-button"]');
    
    // Ждем перенаправления на страницу входа
    await expect(this.page).toHaveURL('/login');
  }

  async ensureLoggedIn() {
    // Проверяем, залогинен ли пользователь
    const isOnAuthPage = this.page.url().includes('/auth/');
    
    if (isOnAuthPage) {
      await this.login();
    }
  }

  async ensureLoggedOut() {
    // Проверяем, не залогинен ли пользователь
    const isOnAuthPage = this.page.url().includes('/auth/');
    
    if (!isOnAuthPage) {
      await this.logout();
    }
  }
}