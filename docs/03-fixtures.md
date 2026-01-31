# Fixtures

Fixtures são o ponto único de extensão do Playwright: todos os specs importam `test` e `expect` de `fixtures`, não de `@playwright/test`. Assim, evoluímos comportamento (baseURL, auth, dados) sem mudar os arquivos de teste.

## O que existe hoje

**Arquivo:** `fixtures/index.ts`

```ts
import { test as base, expect } from '@playwright/test';

const test = base.extend<Record<string, never>>({});

export { test, expect };
```

- Hoje o `test` é o do Playwright apenas “re-exportado” (extend vazio).
- Todos os specs usam `import { test, expect } from '../../../fixtures';` (path com três níveis a partir de `tests/<tipo>/<fluxo>/`).

## Por que usar fixtures

- **Padrão único**: um lugar para configurar request, page, baseURL ou auth.
- **Evolução**: depois podemos adicionar fixture `inputs` (carrega test-data por fluxo) ou `authenticatedRequest` sem alterar os specs.
- **Ambiente**: baseURL já pode vir de `lib/env` no config; no futuro um fixture pode expor baseURL por projeto.

## Como adicionar uma nova fixture

1. Abra `fixtures/index.ts`.
2. Use `base.extend({ ... })` para declarar a nova fixture.
3. Exporte o `test` resultante (e o `expect`).

### Exemplo: fixture `inputs` que carrega dados do fluxo

```ts
// fixtures/index.ts
import { test as base, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

type Fluxo = { tipo: 'api' | 'ui'; nome: string };

const test = base.extend<{ inputs: Record<string, unknown> }>({
  inputs: async ({}, use, testInfo) => {
    // Exemplo: carregar test-data baseado no path do arquivo
    const relativePath = testInfo.file.replace(/.*tests[\\/]/, '').replace(/[\\/][^/\\]+\.spec\.ts$/, '');
    const [tipo, fluxo] = relativePath.split(/[\\/]/);
    const pathJson = path.join(__dirname, '..', 'test-data', tipo, fluxo, 'inputs.json');
    let data = {};
    if (fs.existsSync(pathJson)) {
      data = JSON.parse(fs.readFileSync(pathJson, 'utf-8'));
    }
    await use(data);
  },
});

export { test, expect };
```

Uso no spec:

```ts
test('exemplo com fixture inputs', async ({ request, inputs }) => {
  const { postId } = inputs.getPost;
  const response = await request.get(`/posts/${postId}`);
  expect(response.ok()).toBeTruthy();
});
```

### Exemplo: fixture `authenticatedRequest` (futuro)

```ts
const test = base.extend<{ authenticatedRequest: APIRequestContext }>({
  authenticatedRequest: async ({ request }, use) => {
    const token = process.env.AUTH_TOKEN;
    const context = await request.newContext({
      extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });
    await use(context);
    await context.dispose();
  },
});
```

## Regra para os specs

- **Sempre** importar `test` e `expect` de `fixtures` (path relativo com três níveis: `../../../fixtures`).
- **Nunca** importar de `@playwright/test` nos specs, para manter o padrão e a evolução centralizada.
