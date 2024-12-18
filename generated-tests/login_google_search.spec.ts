
import { test } from '@playwright/test';

test.describe('Google search', () => {
  test('Google search', async ({ page }) => {
    await page.goto('https://google.com')
    await page.click('button[type="submit"]')
    await expect(page.locator('.search-results')).toContainText('some results')
  });
});