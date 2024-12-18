
import { test } from '@playwright/test';

test.describe('Unsuccessful login with valid credentials', () => {
  test('Unsuccessful login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#username', 'testuser');
await page.fill('#password', 'password123')
    await page.click('button[type="submit"]')
  });
});