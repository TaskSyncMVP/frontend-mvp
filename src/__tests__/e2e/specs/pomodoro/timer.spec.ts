import { test, expect } from '@playwright/test';
import { PomodoroPage } from '../../pages/PomodoroPage';
import { AuthHelpers } from '../../utils/auth-helpers';
import { pomodoroSettings } from '../../fixtures/users';

test.describe('Pomodoro таймер', () => {
  let pomodoroPage: PomodoroPage;
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    pomodoroPage = new PomodoroPage(page);
    authHelpers = new AuthHelpers(page);
    
    // Входим в систему перед каждым тестом
    await authHelpers.login();
    await pomodoroPage.goto();
  });

  test('должен отображать страницу Pomodoro таймера', async () => {
    await expect(pomodoroPage.page).toHaveURL('/pomodoro');
    await expect(pomodoroPage.timerDisplay).toBeVisible();
    await expect(pomodoroPage.startButton).toBeVisible();
    await expect(pomodoroPage.resetButton).toBeVisible();
    await expect(pomodoroPage.settingsButton).toBeVisible();
  });

  test('должен отображать начальное время (25:00)', async () => {
    await pomodoroPage.expectTimerDisplay('25:00');
    await pomodoroPage.expectSessionType('Работа');
    await pomodoroPage.expectCurrentSession(1);
  });

  test('должен запустить и приостановить таймер', async () => {
    // Запускаем таймер
    await pomodoroPage.startTimer();
    await pomodoroPage.expectTimerRunning();
    
    // Ждем немного и проверяем, что время изменилось
    await pomodoroPage.page.waitForTimeout(2000);
    
    // Приостанавливаем таймер
    await pomodoroPage.pauseTimer();
    await pomodoroPage.expectTimerPaused();
  });

  test('должен сбросить таймер', async () => {
    // Запускаем таймер
    await pomodoroPage.startTimer();
    await pomodoroPage.page.waitForTimeout(2000);
    
    // Сбрасываем таймер
    await pomodoroPage.resetTimer();
    
    // Проверяем, что время вернулось к начальному значению
    await pomodoroPage.expectTimerDisplay('25:00');
    await pomodoroPage.expectTimerPaused();
  });

  test('должен пропустить текущую сессию', async () => {
    await pomodoroPage.expectCurrentSession(1);
    await pomodoroPage.expectSessionType('Работа');
    
    // Пропускаем сессию
    await pomodoroPage.skipSession();
    
    // Проверяем переход к перерыву
    await pomodoroPage.expectSessionType('Короткий перерыв');
    await pomodoroPage.expectTimerDisplay('05:00');
  });

  test('должен открыть и закрыть настройки', async () => {
    await pomodoroPage.openSettings();
    
    // Проверяем, что все поля настроек видны
    await expect(pomodoroPage.workDurationInput).toBeVisible();
    await expect(pomodoroPage.shortBreakInput).toBeVisible();
    await expect(pomodoroPage.longBreakInput).toBeVisible();
    await expect(pomodoroPage.sessionsInput).toBeVisible();
    
    // Закрываем настройки
    await pomodoroPage.cancelSettingsButton.click();
    await expect(pomodoroPage.settingsModal).not.toBeVisible();
  });

  test('должен изменить настройки таймера', async () => {
    const customSettings = pomodoroSettings.custom;
    
    await pomodoroPage.updateSettings({
      workDuration: customSettings.workDuration,
      shortBreak: customSettings.shortBreakDuration,
      longBreak: customSettings.longBreakDuration,
      sessions: customSettings.sessionsUntilLongBreak
    });
    
    // Проверяем, что время изменилось согласно новым настройкам
    await pomodoroPage.expectTimerDisplay('30:00');
  });

  test('должен показать ошибки валидации в настройках', async () => {
    await pomodoroPage.openSettings();
    
    // Вводим некорректные значения
    await pomodoroPage.workDurationInput.clear();
    await pomodoroPage.workDurationInput.fill('0');
    
    await pomodoroPage.saveSettingsButton.click();
    
    // Проверяем ошибку валидации
    const workDurationError = pomodoroPage.page.locator('[data-testid="work-duration-error"]');
    await expect(workDurationError).toBeVisible();
    await expect(workDurationError).toContainText('Минимальное значение: 1');
  });

  test('должен отображать интервалы сессий', async () => {
    // Проверяем начальное состояние интервалов
    await pomodoroPage.expectIntervalsCount(4); // По умолчанию 4 сессии до длинного перерыва
    await pomodoroPage.expectCompletedIntervals(0);
    
    // Пропускаем первую сессию
    await pomodoroPage.skipSession();
    await pomodoroPage.skipSession(); // Пропускаем короткий перерыв
    
    // Проверяем, что одна сессия отмечена как завершенная
    await pomodoroPage.expectCompletedIntervals(1);
  });

  test('должен переключаться между рабочими сессиями и перерывами', async () => {
    // Начальное состояние - рабочая сессия
    await pomodoroPage.expectSessionType('Работа');
    await pomodoroPage.expectTimerDisplay('25:00');
    
    // Пропускаем рабочую сессию
    await pomodoroPage.skipSession();
    
    // Должен переключиться на короткий перерыв
    await pomodoroPage.expectSessionType('Короткий перерыв');
    await pomodoroPage.expectTimerDisplay('05:00');
    
    // Пропускаем короткий перерыв
    await pomodoroPage.skipSession();
    
    // Должен вернуться к рабочей сессии
    await pomodoroPage.expectSessionType('Работа');
    await pomodoroPage.expectTimerDisplay('25:00');
    await pomodoroPage.expectCurrentSession(2);
  });

  test('должен переключиться на длинный перерыв после 4 сессий', async () => {
    // Пропускаем 4 рабочие сессии и 3 коротких перерыва
    for (let i = 0; i < 4; i++) {
      // Пропускаем рабочую сессию
      await pomodoroPage.skipSession();
      
      if (i < 3) {
        // Пропускаем короткий перерыв (кроме последней итерации)
        await pomodoroPage.skipSession();
      }
    }
    
    // После 4-й сессии должен быть длинный перерыв
    await pomodoroPage.expectSessionType('Длинный перерыв');
    await pomodoroPage.expectTimerDisplay('15:00');
  });

  test('должен сохранить прогресс при перезагрузке страницы', async () => {
    // Запускаем таймер
    await pomodoroPage.startTimer();
    await pomodoroPage.page.waitForTimeout(2000);
    
    // Перезагружаем страницу
    await pomodoroPage.page.reload();
    
    // Проверяем, что состояние сохранилось
    // (Время может немного отличаться, но таймер должен продолжать работать)
    await pomodoroPage.expectTimerRunning();
  });

  test('должен отображать прогресс в круговой диаграмме', async () => {
    await expect(pomodoroPage.progressCircle).toBeVisible();
    
    // Запускаем таймер и проверяем, что прогресс обновляется
    await pomodoroPage.startTimer();
    await pomodoroPage.page.waitForTimeout(1000);
    
    // Проверяем, что атрибуты прогресса изменились
    const progressValue = await pomodoroPage.progressCircle.getAttribute('data-progress');
    expect(progressValue).not.toBe('0');
  });
});