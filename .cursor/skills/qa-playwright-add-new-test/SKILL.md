---
name: qa-playwright-add-new-test
description: Add a new Playwright test (API or UI) following project conventions: import from fixtures, use test-data when applicable, Arrange-Act-Assert. Use when the user asks to add a test, create a test, or add a test for a flow.
---

# Add new test (API or UI)

When adding a new test to the QA Playwright project, follow these conventions.

## Imports

- **Always** import `test` and `expect` from the fixtures path (three levels up from the spec): `import { test, expect } from '../../../fixtures';`
- **Never** import from `@playwright/test` in any file under `tests/`.

## API test

- Use the fixture `request` in the test argument.
- Use data from `test-data/api/<fluxo>/inputs.json` when applicable; import: `import inputs from '../../../test-data/api/<fluxo>/inputs.json';`
- Arrange-Act-Assert; descriptive test name (scenario + expected result).
- baseURL comes from the project config (lib/env); no need to set in the spec.

**Example:** See [tests/api/hello/hello-api.spec.ts](../../../tests/api/hello/hello-api.spec.ts).

## UI test

- Use the fixture `page` (and optionally `context`).
- Use data from `test-data/ui/<fluxo>/inputs.json` or a builder when applicable; use [lib/data-factory.ts](../../../lib/data-factory.ts) (randomEmail, randomString) for varying data.
- Prefer resilient locators: `getByRole`, `getByText`, `getByLabel`; use web-first assertions: `await expect(locator).toBeVisible()`.
- Arrange-Act-Assert; descriptive test name.

**Example:** See [tests/ui/whitebeard/whitebeard-forms.spec.ts](../../../tests/ui/whitebeard/whitebeard-forms.spec.ts).

## Checklist

- [ ] File under `tests/api/<fluxo>/` or `tests/ui/<fluxo>/` with suffix `.spec.ts`
- [ ] Import from `../../../fixtures`
- [ ] Use test-data when there are reusable inputs; use builder or data-factory when varying data
- [ ] Test name describes scenario and expected result

## Full reference

[docs/06-como-adicionar-novo-teste.md](../../../docs/06-como-adicionar-novo-teste.md)
