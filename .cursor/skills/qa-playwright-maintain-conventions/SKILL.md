---
name: qa-playwright-maintain-conventions
description: Enforce QA Playwright project conventions when editing tests or project files: import from fixtures only, use test-data for inputs, follow directory structure. Use when editing specs, refactoring, or when the user asks to align code with project standards.
---

# Maintain conventions

When editing specs or other project files, ensure the QA Playwright conventions are followed.

## Specs (tests/)

- **Imports:** Always `import { test, expect } from '../../../fixtures';` (three levels up from `tests/<api|ui>/<fluxo>/`). Never import from `@playwright/test` in any file under `tests/`.
- **Data:** Prefer [test-data](../../../test-data/) (inputs.json, builder.ts) over hardcoding payloads in specs; use [lib/data-factory.ts](../../../lib/data-factory.ts) for varying data (randomEmail, randomString, randomNumber).
- **Structure:** Specs live in `tests/api/<fluxo>/*.spec.ts` or `tests/ui/<fluxo>/*.spec.ts`; data lives in `test-data/api/<fluxo>/` or `test-data/ui/<fluxo>/`.
- **baseURL:** Use [lib/env.ts](../../../lib/env.ts) (getBaseUrl) in config; avoid hardcoding URLs in specs when baseURL can be used.

## Checklist when editing

- [ ] Specs import from `../../../fixtures`, not `@playwright/test`
- [ ] Reusable or scenario-specific inputs are in test-data, not inline in specs
- [ ] New tests go under `tests/<api|ui>/<fluxo>/`; new data under `test-data/<api|ui>/<fluxo>/`
- [ ] UI tests use resilient locators (getByRole, getByText, getByLabel) and web-first assertions

## References

[AGENTS.md](../../../AGENTS.md) — conventions summary  
[docs/02-estrutura-de-diretórios.md](../../../docs/02-estrutura-de-diretórios.md) — role of each directory
