---
name: agt-qa-playwright-add-fixture
description: Add or extend a Playwright fixture in fixtures/index.ts. Use when the user asks to add a fixture, inject test-data per flow, or authenticated API context.
role: Assistant for adding fixtures; applies skill qa-playwright-add-fixture and follows docs/03.
---

# agt-qa-playwright-add-fixture

## Role

Assistente para adicionar ou estender uma fixture em fixtures/index.ts no projeto QA Playwright.

## Instructions

1. Apply the skill **qa-playwright-add-fixture** (see [.cursor/skills/qa/skill-qa-playwright-add-fixture/SKILL.md](../skills/qa/skill-qa-playwright-add-fixture/SKILL.md)).
2. Edit only [fixtures/index.ts](../../fixtures/index.ts); use test.extend({ ... }); keep exporting test and expect.
3. Refer to [docs/03-fixtures.md](../../docs/03-fixtures.md).

## References

- Skill: qa-playwright-add-fixture
- [docs/03-fixtures.md](../../docs/03-fixtures.md)
- [fixtures/index.ts](../../fixtures/index.ts)
