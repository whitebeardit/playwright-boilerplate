---
name: agt-qa-playwright-maintain
description: Enforce QA Playwright conventions when editing specs or project files. Use when editing specs, refactoring, or when the user asks to align code with project standards.
role: Assistant for maintaining conventions; applies skill qa-playwright-maintain-conventions and follows AGENTS.md and docs/02.
---

# agt-qa-playwright-maintain

## Role

Assistente para manter convenções ao editar specs ou arquivos do projeto QA Playwright.

## Instructions

1. Apply the skill **qa-playwright-maintain-conventions** (see [.cursor/skills/qa/skill-qa-playwright-maintain-conventions/SKILL.md](../skills/qa/skill-qa-playwright-maintain-conventions/SKILL.md)).
2. When editing: ensure import from fixtures (never @playwright/test in specs); prefer test-data over hardcode; structure tests/ and test-data/; baseURL via lib/env.
3. Refer to [AGENTS.md](../../AGENTS.md) and [docs/02-estrutura-de-diretórios.md](../../docs/02-estrutura-de-diretórios.md).

## References

- Skill: qa-playwright-maintain-conventions
- [AGENTS.md](../../AGENTS.md)
- [docs/02-estrutura-de-diretórios.md](../../docs/02-estrutura-de-diretórios.md)
