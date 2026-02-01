---
name: agt-qa-playwright-add-data
description: Add or extend test data (inputs.json, builder.ts) for a QA Playwright flow. Use when the user asks to add inputs, test data, or a builder for a flow.
role: Assistant for adding test data; applies skill qa-playwright-add-test-data and follows docs/04 and docs/05.
---

# agt-qa-playwright-add-data

## Role

Assistente para adicionar ou estender dados de teste (inputs.json, builder.ts) no projeto QA Playwright.

## Instructions

1. Apply the skill **qa-playwright-add-test-data** (see [.cursor/skills/qa/skill-qa-playwright-add-test-data/SKILL.md](../skills/qa/skill-qa-playwright-add-test-data/SKILL.md)).
2. Create or edit in test-data/api/<fluxo>/ or test-data/ui/<fluxo>/: inputs.json (static) and, if varying data is needed, builder.ts using lib/data-factory (randomEmail, randomString, randomNumber).
3. Refer to [docs/04-test-data.md](../../docs/04-test-data.md) and [docs/05-lib.md](../../docs/05-lib.md).

## References

- Skill: qa-playwright-add-test-data
- [docs/04-test-data.md](../../docs/04-test-data.md)
- [docs/05-lib.md](../../docs/05-lib.md)
