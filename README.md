# QA – Automação de testes com Playwright

Automação de testes (API + UI) com Playwright para QA. Um único runner para testes de API e de tela.

**Documentação detalhada:** pasta [docs/](docs/) — um arquivo por seção (estrutura, fixtures, test-data, como adicionar teste/fluxo, ambiente). Índice em [docs/README.md](docs/README.md).

**Agentes / LLMs:** [AGENTS.md](AGENTS.md) — convenções, comandos e referências às docs para trabalho automatizado.

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

## Arquitetura e padrão

- **fixtures/** – Test estendido com fixtures compartilhados. Todos os specs importam `test` e `expect` de `fixtures` (não de `@playwright/test`) para manter o padrão e permitir evolução (baseURL por env, auth, inputs).
- **lib/** – Utilitários compartilhados: `lib/env.ts` (leitura de BASE_URL_API, BASE_URL_UI) e `lib/data-factory.ts` (randomString, randomEmail, randomNumber para gerar dados).
- **test-data/** – Dados de entrada por fluxo, espelhando `tests/`: `test-data/api/<fluxo>/` e `test-data/ui/<fluxo>/`. Use `inputs.json` ou `inputs.ts` para entradas estáticas; opcionalmente `builder.ts` para montar objetos com overrides e uso do data-factory.
- **tests/** – Specs por tipo (api | ui) e fluxo (pasta com nome do fluxo).

O caminho indica **tipo de teste** (api | ui) e **fluxo** (pasta com nome do fluxo):

- `tests/api/<fluxo>/` – testes de API do fluxo (ex.: `tests/api/login/`, `tests/api/pedido/`)
- `tests/ui/<fluxo>/` – testes de tela do fluxo (ex.: `tests/ui/login/`, `tests/ui/pedido/`)

Assim, ao ver `tests/api/login/` ou `tests/ui/pedido/`, fica claro qual fluxo está sendo testado. O `playwright.config.ts` usa `testMatch` com `**/*.spec.ts` para incluir todas as subpastas.

### Rodar só um fluxo

```bash
npx playwright test tests/api/login/
npx playwright test tests/ui/pedido/
```

## Como adicionar inputs (estáticos)

- Crie a pasta de dados do fluxo: `test-data/api/<fluxo>/` e/ou `test-data/ui/<fluxo>/`.
- Adicione `inputs.json` (ou `inputs.ts`) com os casos necessários. Ex.: `inputs.json` com chaves por cenário (`getPost`, `createPost`, etc.).
- No spec, importe os dados: `import inputs from '../../../test-data/api/<fluxo>/inputs.json'` e use no Arrange (ex.: `inputs.createPost`).

## Como gerar dados diferentes

- Use **lib/data-factory.ts**: `randomString()`, `randomEmail()`, `randomNumber(min, max)` para dados únicos (ex.: cadastro).
- Por fluxo, opcionalmente crie **test-data/.../builder.ts** com uma função que monta o objeto padrão e aceita overrides. Ex.: `createFormInput(overrides?)` que retorna `{ nome: '...', email: randomEmail(), ... }` e mescla `overrides`. No teste: `createFormInput({ email: randomEmail() })`.

## Checklist: novo fluxo

1. **Criar pasta do fluxo:** `tests/api/<fluxo>/` e/ou `tests/ui/<fluxo>/`.
2. **Criar pasta de dados (se houver inputs):** `test-data/api/<fluxo>/` e/ou `test-data/ui/<fluxo>/`.
3. **Definir inputs estáticos:** criar `inputs.json` (ou `inputs.ts`) com os casos; se precisar variar muito, adicionar `builder.ts` que usa `lib/data-factory`.
4. **Escrever os specs:** importar `test` e `expect` de `../../../fixtures` (path relativo: três níveis a partir de `tests/<tipo>/<fluxo>/`); usar Arrange-Act-Assert; para dados, importar de test-data ou usar builder.
5. **BaseURL:** se o fluxo for em outro domínio, configurar no projeto em `playwright.config.ts` ou via variáveis de ambiente (veja Configuração).

Naming: manter `*.spec.ts`; dentro do fluxo, nomes que indiquem o cenário (ex.: `footer.spec.ts`, `form-diagnostico.spec.ts`).

## Como acrescentar um novo fluxo

1. Criar pasta com o nome do fluxo: `tests/api/<fluxo>/` e/ou `tests/ui/<fluxo>/`.
2. (Opcional) Criar pasta de dados: `test-data/api/<fluxo>/` e/ou `test-data/ui/<fluxo>/` com `inputs.json` ou `builder.ts`.
3. Dentro da pasta de testes, criar os arquivos `.spec.ts` (ex.: `login.spec.ts`, `pedido.spec.ts`).

## Como acrescentar um novo teste de API

1. Criar arquivo em `tests/api/<fluxo>/<nome>.spec.ts` (ex.: `tests/api/login/login.spec.ts`).
2. Importar `test` e `expect` de `../../../fixtures` (path relativo ao fluxo).
3. Usar o fixture `request` no argumento do teste.
4. Fazer requisições com `request.get()`, `request.post()`, etc., e asserções em `expect(response.ok())` e `expect(await response.json())`.
5. Para dados, importar de `test-data/api/<fluxo>/inputs.json` ou usar builder/data-factory. A baseURL do projeto API vem de `lib/env` (variáveis BASE_URL_API ou BASE_URL).

Exemplo:

```ts
import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/api/meufluxo/inputs.json';

test('deve retornar 200 ao buscar recurso', async ({ request }) => {
  const { id } = inputs.getRecurso;
  const response = await request.get(`/recurso/${id}`);
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toHaveProperty('id');
});
```

## Como acrescentar um novo teste de UI

1. Criar arquivo em `tests/ui/<fluxo>/<nome>.spec.ts` (ex.: `tests/ui/login/login.spec.ts`).
2. Importar `test` e `expect` de `../../../fixtures` (path relativo ao fluxo).
3. Usar o fixture `page`; navegar com `page.goto()` (caminhos relativos ao baseURL quando fizer sentido).
4. Preferir locators `getByRole`, `getByText`, `getByLabel`; usar web-first assertions (`await expect(locator).toHaveText(...)`).
5. Para dados de formulário, importar de `test-data/ui/<fluxo>/inputs.json` ou usar builder com `randomEmail()` etc.

Exemplo:

```ts
import { test, expect } from '../../../fixtures';

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
- **baseURL**: por projeto, lido de `lib/env.ts` – usa `BASE_URL_API` e `BASE_URL_UI` quando definidas (CI, staging, prod), senão defaults (JSONPlaceholder para API, Playwright docs para UI).
- **Timeouts**: 15s para API, 30s para UI.
- **Reporter**: HTML e list no terminal.
- **Trace**: gravado na primeira tentativa de retry (útil para debug de falhas).

**Variáveis de ambiente:** copie `.env.example` para `.env` e preencha. Para CI, defina `BASE_URL_API` e/ou `BASE_URL_UI` no pipeline. Não commite `.env`.

Para novos ambientes ou produtos, use as variáveis de ambiente ou ajuste os defaults em `lib/env.ts`; se necessário, crie novos projetos no config.

## CI

Sugestão para pipeline: rodar `npx playwright test` em cada commit ou pull request. Publicar a pasta `playwright-report/` e `test-results/` como artefatos para inspeção de falhas e traces.
