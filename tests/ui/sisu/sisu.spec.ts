import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/ui/sisu/inputs.json';

test.describe('SISU - Portal Único de Acesso ao Ensino Superior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(inputs.baseUrl);
  });

  test('deve exibir o elemento principal do conteúdo na área main-content', async ({
    page,
  }) => {
    const mainContent = page.getByRole('main', { name: /main-content/i }).or(
      page.locator('#main-content')
    );
    await expect(mainContent).toBeVisible();
    await expect(mainContent.locator('span').first()).toBeVisible();
  });
});
