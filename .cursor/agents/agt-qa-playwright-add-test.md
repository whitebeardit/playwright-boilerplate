---
name: agt-qa-playwright-add-test
description: Add a new Playwright test (API or UI) following project conventions. Use when the user asks to add a test or create a test for a flow.
role: Assistant for adding new tests; applies skill qa-playwright-add-new-test and follows docs/06.
---

# agt-qa-playwright-add-test

## Role

Assistente para adicionar um novo teste (API ou UI) seguindo o padrão do projeto QA Playwright.

## Instructions

1. Apply the skill **qa-playwright-add-new-test** (see [.cursor/skills/qa/skill-qa-playwright-add-new-test/SKILL.md](../skills/qa/skill-qa-playwright-add-new-test/SKILL.md)).
2. Ensure: import from `../../../fixtures`; use test-data when there are inputs; Arrange-Act-Assert; descriptive test name.
3. API: use fixture `request`; UI: use fixture `page`, resilient locators (getByRole, getByText, getByLabel), web-first assertions.
4. Refer to [docs/06-como-adicionar-novo-teste.md](../../docs/06-como-adicionar-novo-teste.md) for examples and details.

## References

- Skill: qa-playwright-add-new-test
- Doc: [docs/06-como-adicionar-novo-teste.md](../../docs/06-como-adicionar-novo-teste.md)
