import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import painelParceiroInputs from '../test-data/ui/painel-parceiro/inputs.json';

/**
 * Test estendido com fixtures compartilhados.
 * Todos os specs devem importar test e expect daqui para manter o padrão
 * e permitir evolução (baseURL por env, auth, inputs por fluxo) sem mudar os specs.
 */

/**
 * Página já autenticada no Painel do Parceiro (pós-login, link Produtos visível).
 * Usar em specs do fluxo painel-parceiro para evitar repetir login.
 */
async function loginPainelParceiro(page: Page): Promise<void> {
  const { baseUrl, login } = painelParceiroInputs;
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByLabel(/conta|account/i).fill(login.conta);
  await page.getByLabel(/usuário|usuario|user|login/i).fill(login.usuario);
  await page.getByLabel(/senha|password/i).fill(login.senha);
  await page.getByRole('button', { name: /entrar|login|acessar/i }).click();
  const linkProdutos = page.locator('a[href="/estabelecimento/produtos"]');
  await linkProdutos.waitFor({ state: 'visible', timeout: 15000 });
}

const test = base.extend<{ painelParceiroPage: Page }>({
  painelParceiroPage: async ({ page }, use) => {
    await loginPainelParceiro(page);
    await use(page);
  },
});

export { test, expect };
