---
name: qa-playwright-add-new-flow
description: Add a new test flow to the QA Playwright project: create tests and test-data folders for the flow, add inputs and optional builder, write specs from fixtures. Use when the user asks to add a flow, new flow, or test suite for a feature.
---

# Add new flow

When adding a new test flow to the QA Playwright project, follow this checklist.

## Checklist

1. **Create flow folders in tests:** `tests/api/<fluxo>/` and/or `tests/ui/<fluxo>/`. Create at least one `.spec.ts` file in each folder you add.
2. **Create flow folders in test-data (if there are inputs):** `test-data/api/<fluxo>/` and/or `test-data/ui/<fluxo>/`.
3. **Define static inputs:** Create `inputs.json` (or `inputs.ts`) with the cases needed; optionally add `builder.ts` that uses [lib/data-factory.ts](../../../lib/data-factory.ts) for varying data.
4. **Write specs:** Import `test` and `expect` from `../../../fixtures`; use Arrange-Act-Assert; for data, import from test-data or use the builder.
5. **baseURL:** If the flow uses another domain, configure it in [playwright.config.ts](../../../playwright.config.ts) or via env (see [docs/08-ambiente-e-configuração.md](../../../docs/08-ambiente-e-configuração.md)).

## Naming

- **Flow folder:** short, clear name (e.g. `login`, `pedido`, `relatorio`).
- **Spec files:** `*.spec.ts`; name can describe the scenario (e.g. `login.spec.ts`, `footer.spec.ts`).

## Run only this flow

```bash
npx playwright test tests/api/<fluxo>/
npx playwright test tests/ui/<fluxo>/
```

## Full reference

[docs/07-como-adicionar-novo-fluxo.md](../../../docs/07-como-adicionar-novo-fluxo.md)
