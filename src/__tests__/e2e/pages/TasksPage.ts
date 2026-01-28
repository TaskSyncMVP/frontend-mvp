import { Page, Locator, expect } from '@playwright/test';

export class TasksPage {
  readonly page: Page;
  readonly createTaskButton: Locator;
  readonly taskModal: Locator;
  readonly taskTitleInput: Locator;
  readonly taskDescriptionInput: Locator;
  readonly taskPrioritySelect: Locator;
  readonly saveTaskButton: Locator;
  readonly cancelTaskButton: Locator;
  readonly tasksList: Locator;
  readonly deleteAllButton: Locator;
  readonly searchInput: Locator;
  readonly filterSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createTaskButton = page.locator('[data-testid="create-task-button"]');
    this.taskModal = page.locator('[data-testid="task-modal"]');
    this.taskTitleInput = page.locator('[data-testid="task-title-input"]');
    this.taskDescriptionInput = page.locator('[data-testid="task-description-input"]');
    this.taskPrioritySelect = page.locator('[data-testid="task-priority-select"]');
    this.saveTaskButton = page.locator('[data-testid="save-task-button"]');
    this.cancelTaskButton = page.locator('[data-testid="cancel-task-button"]');
    this.tasksList = page.locator('[data-testid="tasks-list"]');
    this.deleteAllButton = page.locator('[data-testid="delete-all-tasks-button"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.filterSelect = page.locator('[data-testid="filter-select"]');
  }

  async goto() {
    await this.page.goto('/tasks');
  }

  async createTask(title: string, description?: string, priority?: string) {
    await this.createTaskButton.click();
    await expect(this.taskModal).toBeVisible();
    
    await this.taskTitleInput.fill(title);
    
    if (description) {
      await this.taskDescriptionInput.fill(description);
    }
    
    if (priority) {
      await this.taskPrioritySelect.selectOption(priority);
    }
    
    await this.saveTaskButton.click();
    await expect(this.taskModal).not.toBeVisible();
  }

  async getTaskCard(title: string) {
    return this.page.locator(`[data-testid="task-card"]:has-text("${title}")`);
  }

  async expectTaskExists(title: string) {
    const taskCard = await this.getTaskCard(title);
    await expect(taskCard).toBeVisible();
  }

  async expectTaskNotExists(title: string) {
    const taskCard = await this.getTaskCard(title);
    await expect(taskCard).not.toBeVisible();
  }

  async deleteTask(title: string) {
    const taskCard = await this.getTaskCard(title);
    const deleteButton = taskCard.locator('[data-testid="delete-task-button"]');
    await deleteButton.click();
    
    // Подтверждаем удаление
    const confirmButton = this.page.locator('[data-testid="confirm-delete-button"]');
    await confirmButton.click();
  }

  async editTask(oldTitle: string, newTitle: string, newDescription?: string) {
    const taskCard = await this.getTaskCard(oldTitle);
    const editButton = taskCard.locator('[data-testid="edit-task-button"]');
    await editButton.click();
    
    await expect(this.taskModal).toBeVisible();
    
    await this.taskTitleInput.clear();
    await this.taskTitleInput.fill(newTitle);
    
    if (newDescription) {
      await this.taskDescriptionInput.clear();
      await this.taskDescriptionInput.fill(newDescription);
    }
    
    await this.saveTaskButton.click();
    await expect(this.taskModal).not.toBeVisible();
  }

  async toggleTaskComplete(title: string) {
    const taskCard = await this.getTaskCard(title);
    const checkbox = taskCard.locator('[data-testid="task-checkbox"]');
    await checkbox.click();
  }

  async searchTasks(query: string) {
    await this.searchInput.fill(query);
  }

  async filterTasks(filter: string) {
    await this.filterSelect.selectOption(filter);
  }

  async deleteAllTasks() {
    await this.deleteAllButton.click();
    
    // Подтверждаем удаление всех задач
    const confirmButton = this.page.locator('[data-testid="confirm-delete-all-button"]');
    await confirmButton.click();
  }

  async expectEmptyState() {
    const emptyState = this.page.locator('[data-testid="empty-tasks-state"]');
    await expect(emptyState).toBeVisible();
  }

  async expectTasksCount(count: number) {
    const taskCards = this.page.locator('[data-testid="task-card"]');
    await expect(taskCards).toHaveCount(count);
  }
}