
import { test } from '@playwright/test';

test.describe('Successful login', () => {
  test('Successful login', async ({ page }) => {
    await page.goto('youtube.com')
    await expect(page).toHaveTitle('YouTube')
  });
});