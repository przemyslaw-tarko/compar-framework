const { test, expect } = require('@playwright/test');

test('Bookstore smoke (Playwright)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveTitle(/.+/);
});
