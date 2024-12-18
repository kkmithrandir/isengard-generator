import { test } from '@playwright/test';

test.describe('User Login', () => {
  test('Unsuccessful login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
  });
});