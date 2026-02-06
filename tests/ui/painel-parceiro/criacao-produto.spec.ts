import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/ui/painel-parceiro/inputs.json';

test.describe('Painel do Parceiro - Criação de Produto', () => {
  test('deve realizar login, navegar até Produtos, cadastrar produto e concluir', async ({
    painelParceiroPage: page,
  }) => {
    const { produto } = inputs;

    // 1. Navegar até a aba Produtos
    await page.locator('a[href="/estabelecimento/produtos"]').click();

    // 2. Clicar em Cadastrar produto / Adicionar produto (botão, não o span)
    await page.getByRole('button', { name: /cadastrar produto|adicionar produto/i }).first().click();

    // 3. Preencher formulário e concluir
    const nomeField = page.getByRole('textbox', { name: /nome do produto/i });
    await expect(nomeField).toBeVisible({ timeout: 10000 });
    await nomeField.fill(produto.nome);

    const descricaoField = page.getByRole('textbox', { name: /descri/i });
    await descricaoField.fill(produto.descricao);

    // Categoria (obrigatório) — combobox: abre e seleciona primeira opção disponível
    const categoriaCombobox = page.getByRole('combobox', { name: /categoria/i });
    await categoriaCombobox.click();
    await page.getByRole('option').first().click();

    await page
      .getByRole('button', { name: /salvar|cadastrar|concluir|enviar/i })
      .click();

    // 4. Verificação: toast de sucesso (role="alert", some rápido)
    const toastSucesso = page.getByRole('alert').filter({
      hasText: 'Produto criado com sucesso!',
    });
    await expect(toastSucesso).toBeVisible({ timeout: 5000 });

  });
});
