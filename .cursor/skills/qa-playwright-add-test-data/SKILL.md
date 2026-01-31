---
name: qa-playwright-add-test-data
description: Add or extend test data for a QA Playwright flow: create or edit inputs.json and optional builder.ts in test-data, use lib/data-factory for generated data. Use when the user asks to add inputs, test data, or a builder for a flow.
---

# Add test data (inputs and builders)

When adding or extending test data for a flow, follow this structure.

## Where

- **API flow:** `test-data/api/<fluxo>/`
- **UI flow:** `test-data/ui/<fluxo>/`

## Static inputs (inputs.json)

- Create or edit `inputs.json` (or `inputs.ts`) with entries per scenario (e.g. `getPost`, `createPost`; or `formUrl`, `sobreVoce`).
- In the spec, import: `import inputs from '../../../test-data/<api|ui>/<fluxo>/inputs.json';` and use (e.g. `inputs.getPost`, `inputs.sobreVoce`).

**Example:** [test-data/api/hello/inputs.json](../../../test-data/api/hello/inputs.json), [test-data/ui/whitebeard/inputs.json](../../../test-data/ui/whitebeard/inputs.json).

## Generated data (builder.ts, optional)

- When you need to vary data (e.g. unique email per run), add `builder.ts` in the same flow folder.
- Export a function that builds a default object and accepts overrides; use [lib/data-factory.ts](../../../lib/data-factory.ts) (randomEmail, randomString, randomNumber) inside the builder.
- In the spec, import the builder and call it (e.g. `createFormInput({ email: randomEmail() })`).

**Example:** [test-data/ui/whitebeard/builder.ts](../../../test-data/ui/whitebeard/builder.ts).

## Checklist

- [ ] Folder exists under `test-data/api/<fluxo>/` or `test-data/ui/<fluxo>/`
- [ ] inputs.json (or inputs.ts) defines static cases; builder.ts only if varying data is needed
- [ ] Spec imports from `../../../test-data/...` (three levels up from `tests/<api|ui>/<fluxo>/`)

## Full reference

[docs/04-test-data.md](../../../docs/04-test-data.md) — inputs and builders  
[docs/05-lib.md](../../../docs/05-lib.md) — lib/data-factory (randomString, randomEmail, randomNumber)
