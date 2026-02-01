# Cursor Configuration

Configuração compartilhada de Cursor para a empresa: agents, skills, commands e rules. Use link ou cópia para o `.cursor/` do seu projeto.

## Como usar

**Symlink (recomendado):**
```bash
ln -s /caminho/para/.cursor-configs .cursor
```

**Cópia:**
```bash
cp -r /caminho/para/.cursor-configs/* .cursor/
```

## Prefixos

- **Agents**: prefixo `agt-`; domínio `dev` (uso geral) ou `qa` (focado em QA); sem sufixo `-assistant`.
- **Skills**: prefixo `skill-` nas pastas.

## Localização dos agents

- **Agentes ficam somente** em `.cursor/agents/` (sem subpastas). O Cursor só reconhece agentes nesse nível.
- **Nome único** por arquivo: `agt-<domínio>-<nome>.md` (ex.: `agt-dev-dotnet-logging.md`, `agt-qa-playwright-maintain.md`) para evitar colisão.

## Agents (agt-)

### Dev (uso geral)
- `agt-dev-commit` — Conventional Commits, agrupamento por contexto, GitHub CLI
- `agt-dev-test` — Sugere/cria testes (unit, integration)
- `agt-dev-security` — Vulnerabilidades, OWASP Top 10
- `agt-dev-refactor` — Refatoração, SOLID, code quality
- `agt-dev-documentation` — JSDoc, XML docs, README, API
- `agt-dev-idempotency` — Operações idempotentes
- `agt-dev-jira-update` — Atualiza cards Jira (MCP Atlassian)
- `agt-dev-dotnet-logging` — Logging estruturado (.NET), correlation-ID
- `agt-dev-dotnet-opentelemetry` — OpenTelemetry (.NET)
- `agt-dev-nodejs-logging` — Logging estruturado (Node.js), correlation-ID
- `agt-dev-nodejs-opentelemetry` — OpenTelemetry (Node.js)
- `agt-dev-frontend-quality` — Frontend testável para QA (acessibilidade, seletores estáveis; uso pelo dev)

### QA (focado em QA / Playwright)
- `agt-qa-playwright-maintain` — Mantém convenções do projeto QA Playwright
- `agt-qa-playwright-add-test` — Adiciona novo teste (API ou UI)
- `agt-qa-playwright-add-data` — Adiciona/estende test-data (inputs, builder)
- `agt-qa-playwright-add-fixture` — Adiciona/estende fixture em fixtures/index.ts
- `agt-qa-playwright-add-flow` — Adiciona novo fluxo (pastas, specs, test-data)
- `agt-qa-playwright-context` — Responde sobre estrutura, convenções, docs (não edita código)

## Skills (skill-)

- **dotnet**: `skill-correlation-id-tracking`, `skill-opentelemetry-instrumentation`
- **nodejs**: `skill-correlation-id-tracking`, `skill-opentelemetry-instrumentation`
- **shared**: `skill-code-quality`, `skill-conventional-commits`, `skill-idempotency`, `skill-jira-update`, `skill-performance`, `skill-security`, `skill-testing`
- **qa**: `skill-qa-playwright-maintain-conventions`, `skill-qa-playwright-add-new-test`, `skill-qa-playwright-add-test-data`, `skill-qa-playwright-add-fixture`, `skill-qa-playwright-add-new-flow`, `skill-frontend-qa-friendly`

## Referências

- [README.md](README.md) — visão geral e Quick Start
- [docs/CREATING_ASSETS.md](docs/CREATING_ASSETS.md) — como criar novos agents e skills
