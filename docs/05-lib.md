# Lib (utilitários compartilhados)

A pasta `lib/` concentra código usado por vários testes e pela configuração: leitura de ambiente e geração de dados.

## Arquivos

### `lib/env.ts`

**Função:** centralizar a leitura de variáveis de ambiente usadas como baseURL.

**API:**

- `getBaseUrl(kind?: 'api' | 'ui'): string`
  - `kind === 'api'`: usa `process.env.BASE_URL_API` ?? `process.env.BASE_URL` ?? default API (JSONPlaceholder).
  - `kind === 'ui'`: usa `process.env.BASE_URL_UI` ?? `process.env.BASE_URL` ?? default UI (Playwright docs).
  - Sem argumento: retorna `process.env.BASE_URL` ?? default UI.

**Uso:** `playwright.config.ts` chama `getBaseUrl('api')` e `getBaseUrl('ui')` nos projetos. Assim, CI ou `.env` podem sobrescrever a baseURL sem alterar o código.

**Exemplo (no config):**

```ts
import { getBaseUrl } from './lib/env';

export default defineConfig({
  projects: [
    { name: 'api', use: { baseURL: getBaseUrl('api') }, ... },
    { name: 'ui', use: { baseURL: getBaseUrl('ui') }, ... },
  ],
});
```

---

### `lib/data-factory.ts`

**Função:** gerar dados para testes (strings, emails, números) e permitir variar inputs.

**API:**

- `randomString(length = 10): string` — string alfanumérica aleatória.
- `randomEmail(domain = 'teste.qa'): string` — email no formato `qa-<8 chars>@<domain>`.
- `randomNumber(min: number, max: number): number` — inteiro entre min e max (inclusive).

**Uso:** em specs ou em builders em `test-data/<tipo>/<fluxo>/builder.ts` quando precisar de dados únicos (ex.: cadastro, formulário).

**Exemplo (no spec):**

```ts
import { randomEmail } from '../../../lib/data-factory';

test('cadastro com email único', async ({ page }) => {
  const email = randomEmail();
  await page.getByLabel('E-mail').fill(email);
  // ...
});
```

**Exemplo (no builder):**

```ts
import { randomEmail } from '../../../lib/data-factory';

export function createFormInput(overrides?: Partial<FormInput>): FormInput {
  return { ...DEFAULTS, email: randomEmail(), ...overrides };
}
```

## Quando adicionar algo em lib

- **Comportamento usado em vários fluxos ou no config**: coloque em `lib/` (ex.: novo helper de data, leitura de outro env).
- **Comportamento só de um fluxo**: prefira `test-data/<tipo>/<fluxo>/builder.ts` ou helpers locais ao spec.
