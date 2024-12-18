
import { test } from '@playwright/test';

test.describe('Sample Scenario', () => {
  test('Sample Scenario', async ({ page }) => {
    await page.goto('google.com')
    await expect(page).toHaveTitle('Google')
  });
});