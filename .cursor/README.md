# Cursor Configuration Repository

Comprehensive configuration for Cursor IDE to maximize development productivity. This repository provides agents (prefix `agt-`), skills (prefix `skill-`), custom commands, and development rules organized by domain and language.

## Overview

This configuration repository is designed to be linked/synchronized to `.cursor/` directories in your projects. It provides:

- **Agents**: Specialized AI assistants (prefix `agt-`); domain `dev` (general) or `qa` (QA/Playwright); no `-assistant` suffix
- **Skills**: Reusable knowledge (folder prefix `skill-`) organized by language and domain
- **Commands**: Custom commands for development workflows
- **Rules**: Development guidelines and conventions

## Prefixes

- **Agents**: `agt-dev-*` (general dev: commit, test, security, logging, frontend quality, etc.), `agt-qa-*` (QA/Playwright)
- **Skills**: All skill folders start with `skill-` (e.g. `skill-conventional-commits`, `skill-qa-playwright-maintain-conventions`)

## Structure

```
.cursor-configs/
├── AGENTS.md                    # Index by prefix + link instruction
├── README.md                    # This file
│
├── agents/                      # all agt-*.md here (no subdirectories)
│   # agt-dev-dotnet-logging.md, agt-dev-commit.md, agt-qa-playwright-maintain.md, etc.
│
├── skills/
│   ├── dotnet/                  # skill-correlation-id-tracking, skill-opentelemetry-instrumentation
│   ├── nodejs/                  # (same)
│   ├── shared/                  # skill-testing, skill-conventional-commits, skill-security, etc.
│   └── qa/                      # skill-qa-playwright-*, skill-frontend-qa-friendly
│
├── commands/
│   └── wb-commit.md             # Commit workflow command
│
├── rules/                       # Development rules and guidelines
│
└── docs/
    └── CREATING_ASSETS.md       # Guide for creating new assets
```

## Quick Start

### 1. Link to Your Project

Link or copy this repository to your project's `.cursor/` directory:

```bash
# Option 1: Symlink (recommended)
ln -s /path/to/.cursor-configs .cursor

# Option 2: Copy
cp -r /path/to/.cursor-configs/* .cursor/
```

### 2. Available Agents

Type `@agt-` in Cursor chat to list all agents. Filter by domain: `@agt-dev-` (general dev), `@agt-qa-` (QA/Playwright).

#### Dev — .NET
- **agt-dev-dotnet-logging**: Structured logging with correlation-ID tracking
- **agt-dev-dotnet-opentelemetry**: OpenTelemetry instrumentation

#### Dev — Node.js
- **agt-dev-nodejs-logging**: Structured logging with correlation-ID tracking (Node.js)
- **agt-dev-nodejs-opentelemetry**: OpenTelemetry instrumentation (Node.js)

#### Dev — Shared (multi-language)
- **agt-dev-commit**: Conventional Commits, context grouping, GitHub CLI
- **agt-dev-test**: Suggests/creates unit and integration tests
- **agt-dev-security**: Security vulnerabilities, OWASP Top 10
- **agt-dev-refactor**: Refactoring, SOLID, code quality
- **agt-dev-documentation**: JSDoc, XML docs, README, API docs
- **agt-dev-idempotency**: Idempotent operations
- **agt-dev-jira-update**: Safely updates Jira cards (Atlassian MCP)
- **agt-dev-frontend-quality**: Frontend test-friendly for QA (accessibility, stable selectors; for dev use)

#### QA (Playwright / frontend testability)
- **agt-qa-playwright-maintain**: Maintains QA Playwright project conventions
- **agt-qa-playwright-add-test**: Adds new API or UI test
- **agt-qa-playwright-add-data**: Adds/extends test-data (inputs, builder)
- **agt-qa-playwright-add-fixture**: Adds/extends fixture in fixtures/index.ts
- **agt-qa-playwright-add-flow**: Adds new test flow (folders, specs, test-data)
- **agt-qa-playwright-context**: Answers about structure, conventions, docs (read-only)

### 3. Using Agents

Agents are automatically available when this configuration is linked to `.cursor/`. Invoke in Cursor chat:

```
@agt-dev-commit Suggest commits for my changes
@agt-dev-test Create tests for this function
@agt-qa-playwright-maintain Align this spec with project conventions
```

### 4. Available Skills

Skills (folder prefix `skill-`) are referenced by agents. Organized by language and domain:

- **dotnet/**: skill-correlation-id-tracking, skill-opentelemetry-instrumentation
- **nodejs/**: (same)
- **shared/**: skill-testing, skill-security, skill-code-quality, skill-conventional-commits, skill-idempotency, skill-jira-update, skill-performance
- **qa/**: skill-qa-playwright-maintain-conventions, skill-qa-playwright-add-new-test, skill-qa-playwright-add-test-data, skill-qa-playwright-add-fixture, skill-qa-playwright-add-new-flow, skill-frontend-qa-friendly

### 5. Custom Commands

- **wb-commit**: Ensures commits follow Conventional Commits pattern with context-based grouping. Uses GitHub CLI (`gh`) for PR creation.

Use in Cursor chat:
```
/wb-commit
```

The command:
- Groups changes by context/module
- Creates commits following Conventional Commits format
- Uses `git add` and `git commit` for local operations
- Uses `gh pr create` for PR creation (not `git push`)
- Protects `main` branch (requires explicit authorization)

## How It Works

### Cursor Detection

Cursor automatically detects:
- Agents in `.cursor/agents/` (flat; no subdirectories — Cursor only lists agents at this level)
- Skills in `.cursor/skills/` (including subdirectories)
- Commands in `.cursor/commands/`
- Rules in `.cursor/rules/`

### Path References

All paths in agents and skills use the full path from `.cursor/` (with `skill-` prefix for skill folders):

- `.cursor/skills/dotnet/skill-correlation-id-tracking/SKILL.md`
- `.cursor/skills/shared/skill-conventional-commits/SKILL.md`
- `.cursor/agents/agt-dev-commit.md`

## Creating New Assets

See [docs/CREATING_ASSETS.md](docs/CREATING_ASSETS.md) for detailed guides on:
- Creating new agents (prefix `agt-`, domain `dev` or `qa`, no `-assistant` suffix)
- Creating new skills (folder prefix `skill-`)
- Creating new commands
- Best practices and templates

## Language Support

Currently supported:
- **.NET** (C#): Full support with agt-dev-dotnet-* agents and skill-* skills
- **Node.js** (TypeScript/JavaScript): Full support with agt-dev-nodejs-* agents and skill-* skills
- **Multi-language**: Shared agt-dev-* agents and skill-* skills
- **QA / Playwright**: agt-qa-* agents and skill-qa-* / skill-frontend-qa-friendly

## Contributing

When adding new assets:
1. Put agents directly in `.cursor/agents/` (no subdirs); skills stay in `skills/dotnet/`, `skills/nodejs/`, `skills/shared/`, or `skills/qa/`
2. Use prefix `agt-` for agents (name without `-assistant`); use prefix `skill-` for skill folder names
3. Use proper frontmatter; reference skills using full paths (`.cursor/skills/.../skill-<name>/SKILL.md`)
4. Update this README and [AGENTS.md](AGENTS.md) if adding major features

## References

- [Cursor Documentation](https://docs.cursor.com)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [AGENTS.md](AGENTS.md) - Minimal root configuration
