import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('User navigates to facebook page', async ({ page }) => {
        await page.goto('https://facebook.com')
    await expect(page).toHaveTitle('Facebook')

  });
});