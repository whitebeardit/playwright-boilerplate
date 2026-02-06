import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/ui/fandi/inputs.json';

test.describe('FANDI - Login', () => {
  test('deve fazer login com usuário e senha e redirecionar para fora da tela de login', async ({
    page,
  }) => {
    // Arrange: navegar até a página de login
    await page.goto(`${inputs.baseUrl}/login`);

    // Act: preencher credenciais e submeter
    const userField = page.getByLabel(/usuário|user|login|e-mail|email/i).or(
      page.getByRole('textbox').first()
    );
    const passwordField = page
      .getByLabel(/senha|password/i)
      .or(page.locator('input[type="password"]'));
    await userField.fill(inputs.login.user);
    await passwordField.fill(inputs.login.password);
    await page
      .getByRole('button', { name: /entrar|login|acessar|sign in/i })
      .click();

    // Assert: sair da URL de login (sucesso)
    await expect(page).not.toHaveURL(/\/login$/);
  });
});
