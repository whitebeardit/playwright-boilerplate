# QA – Automação de testes com Playwright

Automação de testes (API + UI) com Playwright para QA. Um único runner para testes de API e de tela.

## Pré-requisitos

- Node.js 18+
- npm, pnpm ou yarn

## Instalação

```bash
npm install
npx playwright install
```

O comando `npx playwright install` baixa os browsers necessários para os testes de UI.

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run test` | Roda todos os testes (API + UI) |
| `npm run test:api` | Roda apenas testes de API |
| `npm run test:ui` | Roda apenas testes de UI |
| `npm run test:headed` | Roda testes de UI com o browser visível |
| `npm run report` | Abre o relatório HTML após a execução |

## Estrutura de pastas

O caminho indica **tipo de teste** (api | ui) e **fluxo** (pasta com nome do fluxo):

- `tests/api/<fluxo>/` – testes de API do fluxo (ex.: `tests/api/login/`, `tests/api/pedido/`)
- `tests/ui/<fluxo>/` – testes de tela do fluxo (ex.: `tests/ui/login/`, `tests/ui/pedido/`)

Assim, ao ver `tests/api/login/` ou `tests/ui/pedido/`, fica claro qual fluxo está sendo testado. O `playwright.config.ts` usa `testMatch` com `**/*.spec.ts` para incluir todas as subpastas.

### Rodar só um fluxo

```bash
npx playwright test tests/api/login/
npx playwright test tests/ui/pedido/
```

## Como acrescentar um novo fluxo

1. Criar pasta com o nome do fluxo: `tests/api/<fluxo>/` e/ou `tests/ui/<fluxo>/`.
2. Dentro da pasta, criar os arquivos `.spec.ts` (ex.: `login.spec.ts`, `pedido.spec.ts`).

## Como acrescentar um novo teste de API

1. Criar arquivo em `tests/api/<fluxo>/<nome>.spec.ts` (ex.: `tests/api/login/login.spec.ts`).
2. Importar `test` e `expect` de `@playwright/test`.
3. Usar o fixture `request` no argumento do teste.
4. Fazer requisições com `request.get()`, `request.post()`, etc., e asserções em `expect(response.ok())` e `expect(await response.json())`.
5. A baseURL do projeto API está em `playwright.config.ts`; para outro endpoint, use `test.use({ baseURL: '...' })` no arquivo.

Exemplo:

```ts
import { test, expect } from '@playwright/test';

test('deve retornar 200 ao buscar recurso', async ({ request }) => {
  const response = await request.get('/recurso/1');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toHaveProperty('id');
});
```

## Como acrescentar um novo teste de UI

1. Criar arquivo em `tests/ui/<fluxo>/<nome>.spec.ts` (ex.: `tests/ui/login/login.spec.ts`).
2. Importar `test` e `expect` de `@playwright/test`.
3. Usar o fixture `page`; navegar com `page.goto()` (caminhos relativos ao baseURL quando fizer sentido).
4. Preferir locators `getByRole`, `getByText`, `getByLabel`; usar web-first assertions (`await expect(locator).toHaveText(...)`).

Exemplo:

```ts
import { test, expect } from '@playwright/test';

test('deve exibir título da página', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Meu App/);
});

test('deve clicar no botão de login', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Bem-vindo')).toBeVisible();
});
```

## Boas práticas

- **Testes isolados**: cada teste deve rodar sozinho, sem depender da ordem ou de dados de outro teste.
- **Locators resilientes**: use `getByRole`, `getByText`, `getByLabel` em vez de seletores CSS frágeis.
- **Web-first assertions**: use `await expect(locator).toHaveText(...)` em vez de `expect(await locator.isVisible()).toBe(true)`.
- **Nomes descritivos**: o nome do teste deve descrever o cenário e o resultado esperado.

## Configuração

O arquivo `playwright.config.ts` na raiz define:

- **Projetos**: `api` (testMatch em `tests/api/`) e `ui` (testMatch em `tests/ui/`).
- **baseURL**: por projeto (API usa JSONPlaceholder nos exemplos; UI usa Playwright docs).
- **Timeouts**: 15s para API, 30s para UI.
- **Reporter**: HTML e list no terminal.
- **Trace**: gravado na primeira tentativa de retry (útil para debug de falhas).

Para novos ambientes ou produtos, ajuste `baseURL` e, se necessário, crie novos projetos no config.

## CI

Sugestão para pipeline: rodar `npx playwright test` em cada commit ou pull request. Publicar a pasta `playwright-report/` e `test-results/` como artefatos para inspeção de falhas e traces.
