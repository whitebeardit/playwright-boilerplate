import { test, expect } from '../../../fixtures';
import { buildCategoriaInput } from '../../../test-data/ui/painel-parceiro/builder';

test.describe('Painel do Parceiro - Criação de Categoria', () => {
  test('deve realizar login, navegar até Produtos, acessar Categorias, cadastrar categoria e concluir', async ({
    painelParceiroPage: page,
  }) => {
    const categoria = buildCategoriaInput();

    // 1. Navegar até a aba Produtos
    await page.locator('a[href="/estabelecimento/produtos"]').click();

    // 2. Acessar subaba Categorias (tab, não link)
    await page.getByRole('tab', { name: /categorias/i }).click();

    // 3. Clicar em Adicionar categoria
    await page.getByRole('button', { name: /adicionar categoria/i }).first().click();

    // 4. Preencher formulário e concluir
    const nomeField = page.getByRole('textbox', { name: /nome/i }).first();
    await expect(nomeField).toBeVisible({ timeout: 10000 });
    await nomeField.fill(categoria.nome);

    // const descricaoField = page.getByRole('textbox', { name: /descri/i });
    // await descricaoField.fill(categoria.descricao);

    // 5. Clicar no botão Cadastrar (texto dentro de <b>)
    await page.getByRole('button', { name: /cadastrar/i }).click();

    // 6. Verificação: toast de sucesso
    const toastSucesso = page.getByRole('alert').filter({
      hasText: /categoria.*sucesso|sucesso.*categoria/i,
    });
    await expect(toastSucesso).toBeVisible({ timeout: 5000 });

  });
});
