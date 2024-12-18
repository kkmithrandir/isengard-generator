import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Successful login', async ({ page }) => {
        await page.goto('youtube.com')
    await expect(page).toHaveTitle('YouTube')

  });
});