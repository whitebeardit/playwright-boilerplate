import { test, expect } from '@playwright/test';

test.describe('UI Hello - Playwright docs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir título da página', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);    
  });

  test('deve exibir texto visível da página inicial', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });
});
