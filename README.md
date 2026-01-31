# QA – Automação de testes com Playwright

![version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square&label=version)
![CI](https://img.shields.io/github/actions/workflow/status/whitebeardit/playwright-boilerplate/.github/workflows/ci.yml?branch=main&label=ci&style=flat-square)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node](https://img.shields.io/badge/Node-18%2B-339933?style=flat-square&logo=nodedotjs)
![Playwright](https://img.shields.io/badge/Playwright-1.49-2EAD33?style=flat-square&logo=playwright)
![GitHub Stars](https://img.shields.io/github/stars/whitebeardit/playwright-boilerplate?style=flat-square&logo=github)
![GitHub Forks](https://img.shields.io/github/forks/whitebeardit/playwright-boilerplate?style=flat-square&logo=github)

Automação de testes (API + UI) com Playwright para QA. Um único runner para testes de API e de tela.

**Documentação detalhada:** pasta [docs/](docs/) — um arquivo por seção (estrutura, fixtures, test-data, como adicionar teste/fluxo, ambiente). Índice em [docs/README.md](docs/README.md).

**Agentes / LLMs:** [AGENTS.md](AGENTS.md) — convenções, comandos e referências às docs para trabalho automatizado.

## Agentes, skills e como usar

O repositório usa **subagents** (em `.cursor/agents/`) e **skills** (em `.cursor/skills/`) para manter o padrão e guiar o uso do Cursor na automação de testes.

### Subagents

| Agente | Quando usar | O que faz |
|--------|-------------|-----------|
| **qa-playwright-context-assistant** | Dúvidas sobre estrutura, convenções, comandos ou documentação | Responde onde ficam fixtures, lib, test-data, tests; comandos (test, test:api, test:ui, test:headed, report, --ui); indica doc ou agente para "como adicionar X". Não edita código. |
| **qa-playwright-add-test-assistant** | Adicionar um novo teste (API ou UI) | Aplica a skill qa-playwright-add-new-test; garante import de fixtures, uso de test-data, Arrange-Act-Assert; API usa `request`, UI usa `page` e locators resilientes. |
| **qa-playwright-add-flow-assistant** | Adicionar um novo fluxo (pastas, dados, specs) | Aplica a skill qa-playwright-add-new-flow; cria tests/api/\<fluxo\>/, tests/ui/\<fluxo\>/, test-data quando houver inputs, inputs.json, opcional builder.ts, specs a partir de fixtures. |
| **qa-playwright-maintain-assistant** | Editar specs, refatorar ou alinhar ao padrão | Aplica a skill qa-playwright-maintain-conventions; garante import de fixtures, preferência por test-data, estrutura tests/ e test-data/, baseURL via lib/env. |
| **qa-playwright-add-data-assistant** | Adicionar ou estender dados de teste (inputs, builder) | Aplica a skill qa-playwright-add-test-data; cria/edita inputs.json e opcional builder.ts em test-data; usa lib/data-factory para dados variáveis. |
| **qa-playwright-add-fixture-assistant** | Adicionar ou estender fixture em fixtures/index.ts | Aplica a skill qa-playwright-add-fixture; edita só fixtures/index.ts com test.extend; mantém export de test e expect. |

### Skills

As skills são instruções reutilizáveis que os agentes aplicam. Ficam em `.cursor/skills/<nome>/SKILL.md`.

| Skill | Descrição |
|-------|------------|
| **qa-playwright-add-new-test** | Convenções para novo teste: import de fixtures, test-data quando aplicável, Arrange-Act-Assert; API com `request`, UI com `page` e locators resilientes. |
| **qa-playwright-add-new-flow** | Checklist para novo fluxo: pastas em tests/ e test-data/, inputs.json, opcional builder.ts, specs importando de fixtures, baseURL se outro domínio. |
| **qa-playwright-maintain-conventions** | Ao editar: import só de fixtures, dados em test-data, estrutura de pastas, baseURL via lib/env, locators e assertions web-first. |
| **qa-playwright-add-test-data** | Onde e como criar inputs.json e builder.ts em test-data; uso de lib/data-factory (randomEmail, randomString, randomNumber). |
| **qa-playwright-add-fixture** | Como adicionar/estender fixture em fixtures/index.ts (test.extend), exemplos (inputs por fluxo, authenticatedRequest), regras (manter test e expect). |

### Como usar no Cursor

1. **Por tarefa:** Descreva o que quer e mencione o agente quando fizer sentido, por exemplo:
   - *"Adicione um teste de API para o endpoint /users usando o qa-playwright-add-test-assistant"*
   - *"Quero um novo fluxo de login; use o add-flow-assistant"*
   - *"Onde fica a documentação de comandos? (context-assistant)"*

2. **@-menção:** No chat do Cursor, use **@** e selecione o agente (ex.: `@qa-playwright-add-test-assistant`) para que as respostas sigam o papel e as instruções daquele agente.

3. **Skills:** As skills são usadas automaticamente pelos agentes. Se quiser seguir o checklist manualmente, abra o arquivo `.cursor/skills/<nome>/SKILL.md` correspondente.

4. **Documentação:** Para detalhes de cada tema (estrutura, fixtures, test-data, novo teste, novo fluxo, ambiente, comandos), use a pasta [docs/](docs/) e o [AGENTS.md](AGENTS.md).

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

## Versionamento (semantic-release)

O **semantic-release** roda no GitHub Actions a cada push na branch **main**. Ele analisa os commits (conventional commits), calcula a próxima versão, atualiza `package.json` e gera o `CHANGELOG.md`, fazendo commit e tag no repositório.

**Conventional commits** (use no título do commit):

| Prefixo | Efeito na versão | Exemplo |
|---------|------------------|---------|
| `feat:` | Minor (1.0.0 → 1.1.0) | `feat: add login flow tests` |
| `fix:` | Patch (1.0.0 → 1.0.1) | `fix: correct baseURL in env` |
| `docs:`, `chore:`, `refactor:`, `test:` | Sem bump (a menos que quebre a API) | `docs: update README` |
| `BREAKING CHANGE:` no corpo ou `!` no escopo | Major (1.0.0 → 2.0.0) | `feat!: change fixture API` |

Configuração em [.releaserc.json](.releaserc.json); workflow em [.github/workflows/ci.yml](.github/workflows/ci.yml). O pacote **não** é publicado no npm (`npmPublish: false`); apenas a versão local e o changelog são atualizados.

## CI

O workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) roda em **push** e **pull request** na branch **main**:

1. **Build** – `npm run build` (verificação TypeScript com `tsc --noEmit`)
2. **Test** – `npm run test` (Playwright: API + UI)
3. **Semantic Release** – só em push em main, após build e testes passarem; atualiza versão e CHANGELOG

Em PRs só rodam build e testes. Para publicar relatório de falhas, adicione artefatos `playwright-report/` e `test-results/` no workflow se desejar.
