import { test, expect } from '@playwright/test';

test.describe('Sample Feature', () => {
  test('Sample Scenario', async ({ page }) => {
        await page.goto('google.com')
    await expect(page).toHaveTitle('Google')

  });
});