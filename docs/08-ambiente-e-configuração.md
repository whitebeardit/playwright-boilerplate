# Ambiente e configuração

Como variar baseURL e outras opções por ambiente (local, CI, staging, prod) sem mudar código dos testes.

## Variáveis de ambiente

### Principais

| Variável        | Uso                         | Exemplo                    |
|----------------|-----------------------------|----------------------------|
| `BASE_URL`     | URL única (api e ui)        | `https://api.empresa.com`   |
| `BASE_URL_API` | Base URL dos testes de API  | `https://api.staging.com`  |
| `BASE_URL_UI`  | Base URL dos testes de UI   | `https://app.staging.com`  |
| `AUTH_TOKEN`   | (Futuro) token para auth    | `Bearer xxx`               |

`playwright.config.ts` usa `getBaseUrl('api')` e `getBaseUrl('ui')` de `lib/env.ts`. Essas funções leem `BASE_URL_API` e `BASE_URL_UI` (e, se não existirem, `BASE_URL`); se nada estiver definido, usam os defaults (JSONPlaceholder para API, Playwright docs para UI).

### Uso local

1. Copie `.env.example` para `.env`.
2. Preencha as variáveis que quiser (ex.: `BASE_URL_UI=https://app.staging.com`).
3. **Não commite** o arquivo `.env`.

Para o Playwright carregar o `.env` automaticamente, é possível adicionar no topo de `playwright.config.ts`:

```ts
import 'dotenv/config';  // requer: npm i -D dotenv
```

Se não usar `dotenv`, defina as variáveis no terminal antes de rodar (ex.: `$env:BASE_URL_UI="https://..."` no PowerShell, ou `export BASE_URL_UI="https://..."` no Bash).

### Uso em CI

No pipeline (GitHub Actions, Azure DevOps, etc.), defina as variáveis no job:

```yaml
env:
  BASE_URL_API: ${{ secrets.BASE_URL_API_STAGING }}
  BASE_URL_UI: ${{ secrets.BASE_URL_UI_STAGING }}
```

Assim os testes rodam contra o ambiente desejado sem alterar o repositório.

## playwright.config.ts

- **Projetos:** `api` (testMatch em `tests/api/`) e `ui` (testMatch em `tests/ui/`).
- **baseURL:** definida por projeto via `getBaseUrl('api')` e `getBaseUrl('ui')`.
- **Timeouts:** 15s (api), 30s (ui); pode sobrescrever com `test.setTimeout()` no spec.
- **Reporter:** `html` e `list`.
- **Trace:** `on-first-retry` para debug de falhas.

Para um fluxo em outro domínio sem usar env, você pode:

- Usar URL absoluta no spec (`page.goto('https://...')`) ou
- Criar um novo projeto no config com outro `testMatch` e outro `use.baseURL`.

## .gitignore

Já devem estar ignorados:

- `node_modules/`
- `test-results/`
- `playwright-report/`
- `blob-report/`
- `*.env`
- `.env.local`

Mantenha `.env` fora do controle de versão; use `.env.example` como modelo.
