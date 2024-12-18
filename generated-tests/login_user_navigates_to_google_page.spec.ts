import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('User navigates to google page', async ({ page }) => {
        await page.goto('https://google.com')
    await expect(page).toHaveTitle('Google')

  });
});