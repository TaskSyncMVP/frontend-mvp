import { Page, Locator, expect } from '@playwright/test';

export class PomodoroPage {
  readonly page: Page;
  readonly timerDisplay: Locator;
  readonly startButton: Locator;
  readonly pauseButton: Locator;
  readonly resetButton: Locator;
  readonly skipButton: Locator;
  readonly settingsButton: Locator;
  readonly settingsModal: Locator;
  readonly workDurationInput: Locator;
  readonly shortBreakInput: Locator;
  readonly longBreakInput: Locator;
  readonly sessionsInput: Locator;
  readonly saveSettingsButton: Locator;
  readonly cancelSettingsButton: Locator;
  readonly currentSession: Locator;
  readonly totalSessions: Locator;
  readonly sessionType: Locator;
  readonly progressCircle: Locator;
  readonly intervalsDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timerDisplay = page.locator('[data-testid="timer-display"]');
    this.startButton = page.locator('[data-testid="start-button"]');
    this.pauseButton = page.locator('[data-testid="pause-button"]');
    this.resetButton = page.locator('[data-testid="reset-button"]');
    this.skipButton = page.locator('[data-testid="skip-button"]');
    this.settingsButton = page.locator('[data-testid="settings-button"]');
    this.settingsModal = page.locator('[data-testid="pomodoro-settings-modal"]');
    this.workDurationInput = page.locator('[data-testid="work-duration-input"]');
    this.shortBreakInput = page.locator('[data-testid="short-break-input"]');
    this.longBreakInput = page.locator('[data-testid="long-break-input"]');
    this.sessionsInput = page.locator('[data-testid="sessions-input"]');
    this.saveSettingsButton = page.locator('[data-testid="save-settings-button"]');
    this.cancelSettingsButton = page.locator('[data-testid="cancel-settings-button"]');
    this.currentSession = page.locator('[data-testid="current-session"]');
    this.totalSessions = page.locator('[data-testid="total-sessions"]');
    this.sessionType = page.locator('[data-testid="session-type"]');
    this.progressCircle = page.locator('[data-testid="progress-circle"]');
    this.intervalsDisplay = page.locator('[data-testid="intervals-display"]');
  }

  async goto() {
    await this.page.goto('/pomodoro');
  }

  async startTimer() {
    await this.startButton.click();
  }

  async pauseTimer() {
    await this.pauseButton.click();
  }

  async resetTimer() {
    await this.resetButton.click();
  }

  async skipSession() {
    await this.skipButton.click();
  }

  async openSettings() {
    await this.settingsButton.click();
    await expect(this.settingsModal).toBeVisible();
  }

  async updateSettings(settings: {
    workDuration?: number;
    shortBreak?: number;
    longBreak?: number;
    sessions?: number;
  }) {
    await this.openSettings();
    
    if (settings.workDuration) {
      await this.workDurationInput.clear();
      await this.workDurationInput.fill(settings.workDuration.toString());
    }
    
    if (settings.shortBreak) {
      await this.shortBreakInput.clear();
      await this.shortBreakInput.fill(settings.shortBreak.toString());
    }
    
    if (settings.longBreak) {
      await this.longBreakInput.clear();
      await this.longBreakInput.fill(settings.longBreak.toString());
    }
    
    if (settings.sessions) {
      await this.sessionsInput.clear();
      await this.sessionsInput.fill(settings.sessions.toString());
    }
    
    await this.saveSettingsButton.click();
    await expect(this.settingsModal).not.toBeVisible();
  }

  async expectTimerDisplay(time: string) {
    await expect(this.timerDisplay).toContainText(time);
  }

  async expectSessionType(type: string) {
    await expect(this.sessionType).toContainText(type);
  }

  async expectCurrentSession(session: number) {
    await expect(this.currentSession).toContainText(session.toString());
  }

  async expectTimerRunning() {
    await expect(this.pauseButton).toBeVisible();
    await expect(this.startButton).not.toBeVisible();
  }

  async expectTimerPaused() {
    await expect(this.startButton).toBeVisible();
    await expect(this.pauseButton).not.toBeVisible();
  }

  async waitForSessionComplete() {
    // Ждем завершения сессии (появление уведомления или изменение типа сессии)
    await this.page.waitForTimeout(1000); // Небольшая пауза для стабильности
  }

  async expectIntervalsCount(count: number) {
    const intervals = this.page.locator('[data-testid="interval-dot"]');
    await expect(intervals).toHaveCount(count);
  }

  async expectCompletedIntervals(count: number) {
    const completedIntervals = this.page.locator('[data-testid="interval-dot"][data-completed="true"]');
    await expect(completedIntervals).toHaveCount(count);
  }
}