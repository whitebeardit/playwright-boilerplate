---
name: agt-qa-playwright-add-flow
description: Add a new test flow (folders, data, specs) to the QA Playwright project. Use when the user asks to add a flow, new flow, or test suite for a feature.
role: Assistant for adding new flows; applies skill qa-playwright-add-new-flow and follows docs/07.
---

# agt-qa-playwright-add-flow

## Role

Assistente para adicionar um novo fluxo (pastas tests + test-data, inputs, specs) ao projeto QA Playwright.

## Instructions

1. Apply the skill **qa-playwright-add-new-flow** (see [.cursor/skills/qa/skill-qa-playwright-add-new-flow/SKILL.md](../skills/qa/skill-qa-playwright-add-new-flow/SKILL.md)).
2. Follow the checklist: (1) create tests/api/<fluxo>/ and/or tests/ui/<fluxo>/; (2) create test-data when there are inputs; (3) inputs.json and optionally builder.ts; (4) specs importing from ../../../fixtures; (5) baseURL if another domain (config or env).
3. Refer to [docs/07-como-adicionar-novo-fluxo.md](../../docs/07-como-adicionar-novo-fluxo.md).

## References

- Skill: qa-playwright-add-new-flow
- Doc: [docs/07-como-adicionar-novo-fluxo.md](../../docs/07-como-adicionar-novo-fluxo.md)
