# Conventional Commits Specification

This file contains the complete specification for Conventional Commits used in this project, including AI behavior guidelines.

## Why Conventional Commits?

This project uses **semantic-release** for automatic versioning and publishing. Semantic-release analyzes commits following the [Conventional Commits](https://www.conventionalcommits.org/) pattern to determine:

- Whether to generate a new version
- What type of version (MAJOR, MINOR, PATCH)
- What to include in the changelog

**Commits that don't follow the pattern are ignored** by semantic-release, resulting in:
- ❌ Versions not automatically generated
- ❌ Outdated changelog
- ❌ Publication not performed

## AI Behavior Guidelines

**ALWAYS** when the user requests commits, PRs, or code changes, you MUST:

1. **Suggest commits in Conventional Commits format**
2. **Suggest PR titles in Conventional Commits format**
3. **Remind the user about the format if they forget**

## Commit Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

## Allowed Commit Types

- **`feat`**: New feature (generates MINOR version)
- **`fix`**: Bug fix (generates PATCH version)
- **`docs`**: Documentation-only changes
- **`style`**: Formatting changes (spaces, commas, etc.) that don't affect code
- **`refactor`**: Code refactoring without functionality changes
- **`perf`**: Performance improvements
- **`test`**: Adding or fixing tests
- **`build`**: Build system or dependency changes
- **`ci`**: CI/CD configuration changes
- **`chore`**: Other changes that don't fit the categories above
- **`revert`**: Reverts a previous commit

### Type Prioritization

When determining the commit type, prioritize in this order:

1. **`feat`** - For new features
2. **`fix`** - For bug fixes
3. **`refactor`** - For refactoring without behavior changes
4. **`docs`** - For documentation changes
5. **`test`** - For adding/fixing tests
6. **`chore`** - For maintenance tasks

## Scope (Optional)

The scope should indicate the affected code area. Common scopes in this project:

- `logging`: Changes related to logging, enrichers, formatters
- `http`: Changes related to HttpClient, handlers
- `middleware`: Changes in middleware (CorrelationIdMiddleware, etc.)
- `mvc`: Changes related to MVC (RouteExtractor, etc.)
- `webapi`: Changes related to Web API
- `config`: Configuration changes (TraceabilityOptions, etc.)
- `core`: Changes in core (CorrelationContext, etc.)
- `tests`: Test changes
- Generic examples: `domain`, `service`, `api`, `db`, `auth`, `utils`, `component`, `model`, `controller`, `validator`

**For context-based commits:** Use the main folder/module name (e.g., if file is in `Core/Domain/`, scope is `domain`). For projects without clear structure, use `core` or the main package name.

## Subject (Required)

- Must be written in lowercase (except proper nouns)
- Must not end with a period
- Must be a short, clear description (maximum 72 characters)
- Must use imperative mood: "add feature" not "added feature" or "adds feature"
- Must be in **English**

## Valid Commit Examples

```bash
# Feature
feat(logging): add TraceContextEnricher for OpenTelemetry support
feat(mvc): add RouteNameEnricher to include route name in logs
feat(http): add support for custom correlation ID headers
feat(domain): add loyalty card entity

# Bug Fix
fix(middleware): ensure Activity is available in PreSendRequestHeaders
fix(logging): normalize Index action route name to 'Controller/' format
fix(service): correct mongo connection retry strategy
fix: resolve compiler warnings in CorrelationIdHttpModule

# Documentation
docs: update README with new configuration options
docs(api): add XML documentation for RouteNameEnricher
docs(api): document auth headers for endpoints

# Refactoring
refactor(core): simplify CorrelationContext implementation
refactor(utils): simplify normalization logic
refactor: extract route extraction logic to separate class

# Performance
perf(http): optimize HttpClient correlation ID injection

# Tests
test(logging): add tests for TraceContextEnricher
test(validator): add unit tests for CNPJ rules
test: add integration tests for MVC route extraction

# CI/CD
ci: update semantic-release configuration
ci: add GitHub Actions workflow for automated releases

# Chore
chore: update dependencies to latest versions
chore: remove trailing whitespace from files
```

## Invalid Commit Examples (DO NOT USE)

```bash
# ❌ No type
Add new feature for logging

# ❌ Incorrect type
feature: add TraceContextEnricher

# ❌ No colon
feat add new feature

# ❌ Title too long
feat(logging): add TraceContextEnricher that enriches trace context with TraceId SpanId and ParentSpanId from Activity.Current

# ❌ Non-imperative mood
feat: added new feature
feat: adds support for X

# ❌ Ends with period
feat(logging): add TraceContextEnricher.

# ❌ Not in English
feat(logging): adicionar novo recurso
```

## Context-Based Commits

**Golden rule:** *one commit = one context (when possible)*

**Process:**

1. **Group changes by context/folder/module**
2. **Make separate commits by context**:
   - Order by dependency (innermost layers first, interfaces last)
   - If there's no clear dependency, order alphabetically
3. **Don't mix different types in the same context**:
   - `refactor(domain)` separate from `feat(domain)`
   - `fix(service)` separate from `test(service)`

**Exceptions:**
- If all changes are from the same context and type, can be a single commit
- Formatting/linter changes can be grouped in `style` or `chore`

## Breaking Changes

If there's a contract/API break:

* Use `!` in the type: `feat(api)!: rename endpoint for ...`
* And add footer:
  ```
  BREAKING CHANGE: <short explanation in English>
  ```

**Example:**
```
feat(api): change method signature

BREAKING CHANGE: Method X now requires parameter Y instead of Z
```

## Pull Request Format

### PR Title (CRITICAL)

**The PR title MUST follow EXACTLY the same semantic commit format**, as semantic-release analyzes the merge commit title to determine whether to generate a new version.

**Required Format:**
```
<type>(<scope>): <subject>
```

**PR Title Rules:**
1. **MUST start with a valid type** (`feat`, `fix`, `docs`, etc.)
2. **MUST have a colon (`:`) after the scope** (or after the type if there's no scope)
3. **MUST be in lowercase** (except proper nouns)
4. **MUST use imperative mood** ("add feature" not "added feature")
5. **MUST NOT end with a period**
6. **MUST have a maximum of 72 characters**
7. **MUST NOT include PR number in the title** (GitHub adds it automatically)

**Valid PR Title Examples:**
- `feat(logging): enrich trace context + JSON trace fields`
- `fix(middleware): ensure Activity is available in debug mode`
- `feat(mvc): add Attribute Routing support`
- `fix: resolve compiler warnings in CorrelationIdHttpModule`
- `docs: update README with new configuration options`
- `refactor(core): simplify CorrelationContext implementation`
- `perf(http): optimize HttpClient correlation ID injection`

**Invalid PR Title Examples (DO NOT USE):**
- ❌ `Logging: enrich trace context + JSON trace fields` (no type)
- ❌ `Add new feature for logging` (no type and format)
- ❌ `feat: Add TraceContextEnricher` (uppercase at start of subject)
- ❌ `feat(logging) add TraceContextEnricher` (no colon)
- ❌ `feat(logging): Added TraceContextEnricher` (non-imperative mood)
- ❌ `feat(logging): add TraceContextEnricher.` (ends with period)
- ❌ `Feature: Add new logging enricher` (incorrect type, uppercase)
- ❌ `[FEAT] Add new feature` (incorrect format)
- ❌ `feat(logging): enrich trace context + JSON trace fields (#29)` (don't include PR number)

### PR Description Template

The PR description must include:

1. **Summary**: Brief description of what was changed
2. **Changes**: Detailed list of changes
3. **Release Type**: Indication if it's `feat`, `fix`, or `breaking change`
4. **Related**: Links to related issues (if any)

**Template:**
```markdown
## Summary
Brief description of the implemented changes.

## Changes
- Item 1
- Item 2
- Item 3

## Release Type
- [ ] `feat` - New feature (MINOR)
- [ ] `fix` - Bug fix (PATCH)
- [ ] `BREAKING CHANGE` - Incompatible change (MAJOR)

## Related
- Closes #issue-number (if any)

## Checklist
- [ ] Code tested
- [ ] Documentation updated
- [ ] Tests added/updated
```

**Example PR:**

**Title:**
```
feat(logging): enrich trace context + JSON trace fields
```

**Description:**
```markdown
## Summary
Adds trace context enrichment (TraceId/SpanId/ParentSpanId) and promotes fields in JSON.

## Changes
- Adds `TraceContextEnricher` that extracts TraceId/SpanId/ParentSpanId from Activity.Current
- Integrates enricher into `WithTraceability` and `WithTraceabilityJson`
- JsonFormatter now displays TraceId/SpanId/ParentSpanId/RouteName at the top of JSON
- Adds tests for TraceContextEnricher
- Updates documentation about JSON depending on formatter

## Release Type
- [x] `feat` - New feature (MINOR)
```

### Situations That Require PR

**ALWAYS** create/suggest a PR when:
- The user explicitly requests PR creation
- The user mentions "pull request", "PR", "merge request"
- The user asks to "open PR", "create PR", "make PR"
- The user completes a feature or fix and wants code review
- The user wants semantic-release to analyze the changes

**DO NOT** create/suggest PR for:
- Release commits (automatically generated)
- Local configuration commits
- Temporary debug commits

### PR Creation Process

**ALWAYS** when the user requests PR creation or mentions Pull Request, you MUST:

1. **Suggest a title in Conventional Commits format**
2. **Validate the title before suggesting** (use validation checklist below)
3. **Suggest a complete PR description** (use template above)
4. **Remind about the importance of the format for semantic-release**

**Use GitHub CLI (`gh`) to create PRs:**
```bash
gh pr create --title "<type>(<scope>): <subject>" --body "<description>"
```

## Merge Commits

When a PR is merged, the merge commit title must follow the pattern. If GitHub automatically generates a title that doesn't follow the pattern, **it must be manually edited** before merging.

**Invalid Merge Title:**
```
Merge pull request #29 from branch-name
Logging: enrich trace context + JSON trace fields
```

**Valid Merge Title:**
```
feat(logging): enrich trace context + JSON trace fields (#29)
```

## Semantic Release Integration

Semantic-release analyzes commits using the `angular` preset with the following rules:

- `feat:` → MINOR version (1.0.0 → 1.1.0)
- `fix:` → PATCH version (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` → MAJOR version (1.0.0 → 2.0.0)
- Other types (`docs`, `chore`, etc.) → No release (unless configured)

**Commits that don't follow the pattern are ignored** and don't generate a release.

## Validation Checklists

### Before Committing

Before suggesting a commit, verify:

- [ ] Type is correct (`feat`, `fix`, etc.)
- [ ] Scope is appropriate (or omitted if it doesn't make sense)
- [ ] Subject is in lowercase (except proper nouns)
- [ ] Subject is in imperative mood
- [ ] Subject has less than 72 characters
- [ ] Subject doesn't end with period
- [ ] Subject is in English
- [ ] Format is correct: `<type>(<scope>): <subject>`
- [ ] Commit files belong to the same context (or are related changes)
- [ ] If there's a breaking change, includes `BREAKING CHANGE:` in the footer

**If any validation fails, fix it before suggesting.**

### Before Creating PR

**Title Validation:**
- [ ] Title starts with valid type (`feat`, `fix`, `docs`, etc.)
- [ ] Title has colon (`:`) after scope/type
- [ ] Title is in lowercase (except proper nouns)
- [ ] Title uses imperative mood
- [ ] Title doesn't end with period
- [ ] Title has maximum of 72 characters
- [ ] Title doesn't include PR number
- [ ] Format is correct: `<type>(<scope>): <subject>`

**Description Validation:**
- [ ] PR description is complete
- [ ] Summary of changes is clear
- [ ] List of changes is detailed
- [ ] Release type is correctly marked
- [ ] Related issues are linked (if any)

**Commits Validation:**
- [ ] All commits in the branch follow Conventional Commits pattern
- [ ] Commits are logically organized
- [ ] There are no debug or temporary commits

**If any validation fails, fix it before suggesting.**

## Reminders for the User

If the user creates a commit or PR that doesn't follow the pattern, you MUST:

1. **Inform** that the format is incorrect
2. **Suggest** the correct format
3. **Explain** why it's important (semantic-release won't detect it)
4. **Show** examples of correct format

**Example response for commit:**
```
⚠️ The commit title doesn't follow the Conventional Commits pattern.

Current title: "Add new feature"
Suggested title: "feat(logging): add TraceContextEnricher"

This is important because semantic-release analyzes commits to automatically generate versions. Commits that don't follow the pattern are ignored.
```

**Example response for PR:**
```
⚠️ The PR title doesn't follow the Conventional Commits pattern.

Current title: "Logging: enrich trace context + JSON trace fields"
Suggested title: "feat(logging): enrich trace context + JSON trace fields"

IMPORTANT: Semantic-release analyzes the merge commit title to determine whether to generate a new version. PRs with titles that don't follow the pattern will result in "no relevant changes" and no version will be generated.

Correct format: <type>(<scope>): <subject>
Examples:
- feat(logging): enrich trace context + JSON trace fields
- fix(middleware): ensure Activity is available in debug mode
- feat(mvc): add Attribute Routing support
```

## Special Cases

### Release Commits

Commits generated by semantic-release already follow the pattern:
```
chore(release): 1.2.3 [skip ci]
```
**DO NOT modify** these commits.

### Multiple Changes

**Scenario:** Adds feature X and fixes bug Y

**Suggested commits:**
```
feat(scope): add feature X
fix(scope): fix bug Y
```

**NEVER combine multiple changes in a single commit** unless they are related and make sense together.

### PR with Breaking Change

**Suggested title:**
```
feat(api): change method X signature
```

**Suggested description:**
Include in the description footer:
```
BREAKING CHANGE: Method X now requires parameter Y instead of Z
```

This will make semantic-release generate a MAJOR version.

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
