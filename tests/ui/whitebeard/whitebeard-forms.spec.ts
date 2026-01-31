import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/ui/whitebeard/inputs.json';
import { createFormInput } from '../../../test-data/ui/whitebeard/builder';
import { randomEmail } from '../../../lib/data-factory';

test.describe('Whitebeard Academy - Forms flow', () => {
  test.setTimeout(90000);

  test('deve preencher todo o formulário de diagnóstico e verificar o resultado', async ({
    page,
  }) => {
    const formUrl = inputs.formUrl;
    const { nome, email, cargo, empresa } = inputs.sobreVoce;

    await page.goto(formUrl, { waitUntil: 'networkidle' });

    await expect(
      page.getByRole('heading', { name: /diagnóstico whitebeard academy/i })
    ).toBeVisible({ timeout: 15000 });

    const form = page.locator('form');

    // 1. Sobre você — form/div[1]/div/div[n]/input (label no div irmão)
    await form.locator('xpath=./div[1]/div/div[1]/input').fill(nome);
    await form.locator('xpath=./div[1]/div/div[2]/input').fill(email);
    await form.locator('xpath=./div[1]/div/div[3]/input').fill(cargo);
    await form.locator('xpath=./div[1]/div/div[4]/input').fill(empresa);

    // 2. Contexto do time — comboboxes (button abre o dropdown)
    await form.locator('xpath=./div[2]/div/div[1]//button').first().click();
    await page.getByRole('option').first().click();

    await form.locator('xpath=./div[2]/div/div[2]//button').first().click();
    await page.getByRole('option').first().click();

    await page.getByRole('checkbox', { name: 'Jira' }).check();
    await page.getByRole('checkbox', { name: 'GitHub / GitLab' }).check();

    // 3. Stack e práticas técnicas — comboboxes
    await form.locator('xpath=./div[3]/div/div[1]//button').first().click();
    await page.getByRole('option').first().click();

    await form.locator('xpath=./div[3]/div/div[2]//button').first().click();
    await page.getByRole('option').first().click();

    await form.locator('xpath=./div[3]/div/div[3]//button').first().click();
    await page.getByRole('option').first().click();

    // 4. Desafios e oportunidades
    await page
      .getByPlaceholder(/retrabalho, baixa previsibilidade/i)
      .fill(inputs.desafios);

    await page
      .getByRole('checkbox', {
        name: 'Aumentar produtividade e previsibilidade',
      })
      .check();
    await page
      .getByRole('checkbox', {
        name: 'Integrar inteligência artificial aos fluxos',
      })
      .check();

    // Slider estágio (1–5 no snapshot)
    await form.locator('input[type="range"]').fill(String(inputs.estagioSlider));

    // 5. Próximos passos
    await form.locator('xpath=./div[5]/div/div[1]//button').first().click();
    await page.getByRole('option').first().click();

    await page
      .getByPlaceholder(/e-mail, whatsapp, teams/i)
      .fill(inputs.contato);

    await page.getByRole('button', { name: 'Enviar Diagnóstico' }).click();

    // Verificação do resultado
    await expect(page).toHaveURL(/whitebeard\.ac/, { timeout: 20000 });
    await expect(
      page.getByText(/obrigado|enviado|sucesso|recebemos|diagnóstico enviado/i)
    ).toBeVisible({ timeout: 20000 });
  });

  test('exemplo: preencher seção Sobre você com email gerado (builder + data-factory)', async ({
    page,
  }) => {
    const formInput = createFormInput({ email: randomEmail() });

    await page.goto(inputs.formUrl, { waitUntil: 'networkidle' });

    await expect(
      page.getByRole('heading', { name: /diagnóstico whitebeard academy/i })
    ).toBeVisible({ timeout: 15000 });

    const form = page.locator('form');
    await form.locator('xpath=./div[1]/div/div[1]/input').fill(formInput.nome);
    await form.locator('xpath=./div[1]/div/div[2]/input').fill(formInput.email);
    await form.locator('xpath=./div[1]/div/div[3]/input').fill(formInput.cargo);
    await form.locator('xpath=./div[1]/div/div[4]/input').fill(formInput.empresa);

    await expect(form.locator('xpath=./div[1]/div/div[2]/input')).toHaveValue(
      formInput.email
    );
  });
});
