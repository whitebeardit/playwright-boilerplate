# AGENTS.md – Guidance for AI agents

This repo is a **QA test automation** project using **Playwright** (API + UI) and **TypeScript**. Follow the conventions below; detailed docs are in [docs/](docs/).

---

## Commands

Run these from the project root:

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests (API + UI) |
| `npm run test:api` | Run only API tests |
| `npm run test:ui` | Run only UI tests |
| `npm run test:headed` | Run UI tests with browser visible (or `npx playwright test tests/ui/ --headed`) |
| `npm run report` | Open HTML report after a run |
| `npx playwright test tests/api/<fluxo>/` | Run tests for one API flow |
| `npx playwright test tests/ui/<fluxo>/` | Run tests for one UI flow |
| `npx playwright test --ui` | Playwright UI mode (interactive run, traces, time-travel) |

**Details:** [docs/09-comandos-e-opcoes.md](docs/09-comandos-e-opcoes.md) (all commands, `--headed`, `--ui`).

---

## Stack

- **Runtime:** Node.js (ES2020, CommonJS)
- **Test runner:** Playwright (`@playwright/test` ^1.49.0)
- **Language:** TypeScript 5.6, strict mode
- **Config:** `playwright.config.ts` (projects: `api`, `ui`); baseURL from [lib/env.ts](lib/env.ts)

---

## Project structure (summary)

```
fixtures/       → test.extend + export test, expect (all specs import from here)
lib/            → env.ts (getBaseUrl), data-factory.ts (randomString, randomEmail, randomNumber)
test-data/      → api/<fluxo>/, ui/<fluxo>/ — inputs.json, optional builder.ts
tests/          → api/<fluxo>/*.spec.ts, ui/<fluxo>/*.spec.ts
docs/           → Full documentation (one file per topic)
```

See [docs/02-estrutura-de-diretórios.md](docs/02-estrutura-de-diretórios.md) for the role of each directory.

---

## Conventions (do / don't)

### Imports in specs

- **Do:** Import `test` and `expect` from the fixtures path (three levels up from spec): `import { test, expect } from '../../../fixtures';`
- **Don't:** Import from `@playwright/test` in any file under `tests/`.

### Test data

- **Do:** Put static inputs in `test-data/<api|ui>/<fluxo>/inputs.json` (or `.ts`). Use [lib/data-factory.ts](lib/data-factory.ts) for generated data; optional per-flow builders in `test-data/.../builder.ts`.
- **Don't:** Hardcode large or reusable payloads inside spec files.

### Naming and layout

- **Do:** Use `*.spec.ts`; place specs in `tests/api/<fluxo>/` or `tests/ui/<fluxo>/` so the path reflects the flow.
- **Do:** Use descriptive test names (scenario + expected outcome). Prefer Arrange–Act–Assert in the test body.
- **Do:** Prefer resilient locators in UI tests: `getByRole`, `getByText`, `getByLabel`; use web-first assertions (`await expect(locator).toBeVisible()`).

### BaseURL and environment

- **Do:** Use `getBaseUrl('api')` / `getBaseUrl('ui')` in config; override via `BASE_URL_API`, `BASE_URL_UI`, or `BASE_URL` in CI or `.env`.
- **Don't:** Commit `.env`; use [.env.example](.env.example) as a template.

---

## Adding new work

| Task | Where to look / what to do |
|------|----------------------------|
| **New test (API or UI)** | [docs/06-como-adicionar-novo-teste.md](docs/06-como-adicionar-novo-teste.md) — import from `../../../fixtures`, use `request` (API) or `page` (UI), optionally use test-data. |
| **New flow** | [docs/07-como-adicionar-novo-fluxo.md](docs/07-como-adicionar-novo-fluxo.md) — create `tests/<api|ui>/<fluxo>/`, optionally `test-data/<api|ui>/<fluxo>/`, then add specs. |
| **New fixture** | [docs/03-fixtures.md](docs/03-fixtures.md) — extend in [fixtures/index.ts](fixtures/index.ts) and export; keep specs importing from `fixtures`. |
| **New inputs or builders** | [docs/04-test-data.md](docs/04-test-data.md) — add or edit `test-data/.../inputs.json` or `builder.ts`; use [lib/data-factory.ts](lib/data-factory.ts) for random data. |
| **Env / config** | [docs/08-ambiente-e-configuração.md](docs/08-ambiente-e-configuração.md) — variables, `.env`, and [playwright.config.ts](playwright.config.ts). |

---

## Key files

| File | Purpose |
|------|---------|
| [playwright.config.ts](playwright.config.ts) | Projects (api, ui), baseURL via getBaseUrl(), timeouts, reporter, trace. |
| [fixtures/index.ts](fixtures/index.ts) | Single place for test.extend; all specs use this. |
| [lib/env.ts](lib/env.ts) | getBaseUrl('api' \| 'ui') from env or defaults. |
| [lib/data-factory.ts](lib/data-factory.ts) | randomString, randomEmail, randomNumber. |
| [tsconfig.json](tsconfig.json) | Includes tests, config, lib, fixtures, test-data; resolveJsonModule for inputs.json. |

---

## Boundaries

- **Don't** commit `.env` or secrets; only reference `.env.example`.
- **Don't** add specs that import `test`/`expect` from `@playwright/test`; always use the fixtures path.
- **Don't** change the default projects in `playwright.config.ts` (api, ui) without aligning docs and AGENTS.md.
- When adding a new flow, follow the existing layout: `tests/<type>/<fluxo>/` and, if needed, `test-data/<type>/<fluxo>/`.

---

## Full documentation

Human-readable docs (structure, fixtures, test-data, lib, how to add tests/flows, env) are in [docs/](docs/). Index: [docs/README.md](docs/README.md).
