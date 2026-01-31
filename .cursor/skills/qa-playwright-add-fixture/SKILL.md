---
name: qa-playwright-add-fixture
description: Add or extend a Playwright fixture in fixtures/index.ts (e.g. inputs loader, authenticated request). Use when the user asks to add a fixture, inject test-data per flow, or authenticated API context.
---

# Add or extend fixture

When adding or extending a fixture for the QA Playwright project, edit [fixtures/index.ts](../../../fixtures/index.ts).

## Where

- **File:** [fixtures/index.ts](../../../fixtures/index.ts)
- **Pattern:** Use `base.extend({ ... })` to declare the new fixture; export the resulting `test` and `expect`; specs keep importing from `fixtures`.

## Examples

**Fixture `inputs` (load test-data per flow):** Load from `test-data/<type>/<fluxo>/inputs.json` based on the spec path (e.g. from testInfo.file) and expose the object to the test. See [docs/03-fixtures.md](../../../docs/03-fixtures.md) for a code sketch.

**Fixture `authenticatedRequest`:** Create a request context with auth header (e.g. from `process.env.AUTH_TOKEN`) and dispose after use. Specs that need auth use `async ({ authenticatedRequest }) => { ... }` instead of `request`.

## Rules

- Keep exporting `test` and `expect` from fixtures; all specs must continue to import from `../../../fixtures`.
- Do not change the default Playwright fixtures (request, page) unless extending them; prefer adding new named fixtures.

## Full reference

[docs/03-fixtures.md](../../../docs/03-fixtures.md) — fixtures, how to add a new one, examples
