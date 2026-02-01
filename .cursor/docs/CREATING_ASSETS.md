# Creating Assets for Cursor Configuration

This guide explains how to create new subagents, skills, and commands for the Cursor configuration repository.

## Table of Contents

- [Creating Subagents](#creating-subagents)
- [Creating Skills](#creating-skills)
- [Creating Commands](#creating-commands)
- [Best Practices](#best-practices)

## Creating Subagents

Subagents are specialized AI assistants that perform specific tasks.

### Directory Structure

- **Agents**: All agent files go directly in `agents/` (no subdirectories). Cursor only detects agents at `.cursor/agents/`.
- **Unique names**: Use `agt-<domain>-<name>.md` (e.g. `agt-dev-dotnet-logging.md`, `agt-qa-playwright-maintain.md`) to avoid name collisions.

### Template

```markdown
---
name: your-assistant-name
model: inherit
description: Brief description of what this subagent does. Should be clear and specific.
---

# Your Assistant Name

You are a specialized assistant that [describes the main purpose].

## Required Skill Dependency

**IMPORTANT**: This subagent MUST use the `skill-name` skill located at `.cursor/skills/[language]/skill-name/SKILL.md`

Before performing any tasks:
1. Read the skill file: `.cursor/skills/[language]/skill-name/SKILL.md`
2. Understand all patterns and best practices from the skill
3. Apply those patterns when working

## Your Mission

When invoked, you will:

1. **Step 1**: Description
2. **Step 2**: Description
3. **Step 3**: Description

## Analysis Process

### Step 1: [Step Name]

[Detailed instructions]

### Step 2: [Step Name]

[Detailed instructions]

## Patterns

### Pattern 1: [Pattern Name]

```[language]
// Example code
```

## Critical Rules

### ✅ DO:
- Rule 1
- Rule 2

### ❌ DON'T:
- Anti-pattern 1
- Anti-pattern 2

## Output Format

After completing the task, provide:

1. **Summary**: What was done
2. **Modified Files**: List of files updated
3. **Verification**: Confirmation that best practices were followed
```

### Naming convention

- **Agents**: Prefix `agt-`; domain `dev` (general dev) or `qa` (QA-focused); no `-assistant` suffix. Example: `agt-dev-dotnet-logging`, `agt-dev-commit`, `agt-qa-playwright-maintain`. Each file must have a unique name.
- **Skills**: Prefix `skill-` for folder names. Example: `skill-correlation-id-tracking`, `skill-testing`, `skill-conventional-commits`.

### Skill references in agents

When referencing skills from an agent (in `.cursor/agents/`), use either:
- **Full path from `.cursor/`**: `.cursor/skills/<dotnet|nodejs|shared|qa>/skill-<name>/SKILL.md`
- **Relative link** (for Markdown): `../skills/<dotnet|nodejs|shared|qa>/skill-<name>/SKILL.md`

### Example: Language-Specific Agent

For `.NET` logging:
- File: `agents/agt-dev-dotnet-logging.md`
- References: `.cursor/skills/dotnet/skill-correlation-id-tracking/SKILL.md`

For `Node.js` logging:
- File: `agents/agt-dev-nodejs-logging.md`
- References: `.cursor/skills/nodejs/skill-correlation-id-tracking/SKILL.md`

### Example: Shared Agent

For multi-language test:
- File: `agents/agt-dev-test.md`
- References: `.cursor/skills/shared/skill-testing/SKILL.md`

## Creating Skills

Skills are reusable knowledge repositories that subagents reference. They contain patterns, best practices, and implementation details.

### Directory Structure

- **Language-specific**: `skills/dotnet/` or `skills/nodejs/`
- **Multi-language**: `skills/shared/`

Each skill should be in its own directory with a `SKILL.md` file.

### Template

```markdown
---
name: skill-name
description: Brief description of what this skill provides. Use when [use cases].
---

# Skill Name

This skill helps you [main purpose] in [language/context].

## When to Use

**✅ DO Use:**
- Use case 1
- Use case 2

**❌ DON'T Use:**
- Anti-pattern 1
- Anti-pattern 2

## Core Concepts

[Explain fundamental concepts]

## Patterns

### Pattern 1: [Pattern Name]

```[language]
// Example implementation
```

### Pattern 2: [Pattern Name]

```[language]
// Example implementation
```

## Best Practices

1. **Practice 1**: Explanation
2. **Practice 2**: Explanation

## Common Issues

**Issue 1:**
- Problem description
- Solution

**Issue 2:**
- Problem description
- Solution

## Key Principles

1. Principle 1
2. Principle 2
```

### Example Structure

```
skills/
├── dotnet/
│   └── skill-correlation-id-tracking/
│       └── SKILL.md
├── nodejs/
│   └── skill-correlation-id-tracking/
│       └── SKILL.md
└── shared/
    └── skill-idempotency/
        └── SKILL.md
```

## Creating Commands

Commands are custom workflows accessible via `/command-name` in Cursor chat.

### Directory Structure

Commands go in `commands/` directory (no subdirectories needed for now).

### Template

```markdown
# command-name

## Objective

Clear description of what this command does.

---

## Rule (to paste in Cursor / Rules)

**Suggested name:** `rule-name`

### 1) [Step 1]

[Instructions]

### 2) [Step 2]

[Instructions]

## Expected Behavior

When invoked, the agent should:

1. Behavior 1
2. Behavior 2

## Examples

### Example 1: [Scenario]

**Input:**
```
/command-name
```

**Expected Output:**
[Description of expected behavior]
```

### Example

See `commands/wb-commit.md` for a complete example of a command implementation.

## Best Practices

### Naming Conventions

- **Agents**: Prefix `agt-`; domain `dev` or `qa`; no `-assistant` suffix (e.g., `agt-dev-dotnet-logging`, `agt-dev-commit`, `agt-qa-playwright-maintain`)
- **Skills**: Prefix `skill-` for folder names (e.g., `skill-correlation-id-tracking`, `skill-conventional-commits`, `skill-testing`)
- **Commands**: Use kebab-case with prefix if needed (e.g., `wb-commit`)

### File Organization

1. **Language-specific assets** → Place in `dotnet/` or `nodejs/` subdirectories
2. **Multi-language assets** → Place in `shared/` subdirectory
3. **Always use full paths** when referencing skills: `.cursor/skills/[language]/skill-<name>/SKILL.md`

### Frontmatter

Always include frontmatter in subagents and skills:

**Agents:**
```yaml
---
name: agt-dev-commit
model: inherit
description: Clear, specific description
---
```

**Skills:**
```yaml
---
name: skill-name
description: Clear description with use cases
---
```

### Path References

**Always use full paths from `.cursor/`:**

✅ Correct:
- `.cursor/skills/dotnet/skill-correlation-id-tracking/SKILL.md`
- `.cursor/skills/shared/skill-idempotency/SKILL.md`

❌ Incorrect:
- `skills/correlation-id-tracking/SKILL.md` (missing `skill-` prefix)
- `../skills/idempotency/SKILL.md`

### Skill Dependencies

When an agent depends on a skill:

1. **Explicitly state the dependency** in the subagent
2. **Provide the full path** to the skill (with `skill-` prefix in folder name)
3. **Instruct the agent** to read the skill before performing tasks
4. **Reference specific patterns** from the skill

### Code Examples

- Use appropriate language tags in code blocks
- Provide complete, working examples
- Include error handling where relevant
- Show both simple and complex use cases

### Documentation

- **Clear mission**: Each agent should have a clear mission statement
- **Step-by-step process**: Break down complex tasks into steps
- **DO/DON'T lists**: Make rules explicit
- **Output format**: Specify what the subagent should provide

## Testing Your Assets

Before committing:

1. **Verify paths**: All skill references use correct full paths
2. **Check frontmatter**: YAML frontmatter is valid
3. **Test in Cursor**: Link to a test project and verify detection
4. **Review structure**: Follows directory organization rules

## Checklist

When creating a new asset:

- [ ] Agent in `agents/` (flat); skill in correct `skills/<dotnet|nodejs|shared|qa>/` subdir
- [ ] Frontmatter is complete and valid
- [ ] Paths use full `.cursor/` paths
- [ ] Code examples are complete and correct
- [ ] DO/DON'T rules are explicit
- [ ] Documentation is clear
- [ ] Tested in Cursor

## Examples

See existing assets for reference:

- **Agent (.NET)**: `agents/agt-dev-dotnet-logging.md`
- **Agent (Shared)**: `agents/agt-dev-test.md`
- **Agent (QA)**: `agents/agt-qa-playwright-maintain.md`
- **Skill (.NET)**: `skills/dotnet/skill-correlation-id-tracking/SKILL.md`
- **Skill (Shared)**: `skills/shared/skill-idempotency/SKILL.md`
- **Command**: `commands/wb-commit.md`
