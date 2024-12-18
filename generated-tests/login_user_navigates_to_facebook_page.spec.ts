
import { test } from '@playwright/test';

test.describe('User navigates to facebook page', () => {
  test('User navigates to facebook page', async ({ page }) => {
    await page.goto('https://facebook.com')
    await expect(page).toHaveTitle('Facebook')
  });
});