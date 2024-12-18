
import { test } from '@playwright/test';

test.describe('User navigates to google page', () => {
  test('User navigates to google page', async ({ page }) => {
    await page.goto('https://google.com')
    await expect(page).toHaveTitle('Google')
  });
});