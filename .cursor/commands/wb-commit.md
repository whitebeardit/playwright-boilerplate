# wb-commit

## Use the agent for AI-assisted commits

**Para fluxo de commits assistido por IA**, use o agent **@agt-dev-commit**. Ele aplica a skill `.cursor/skills/shared/skill-conventional-commits/SKILL.md` (formato, detecção de contexto, checklist, validação) e usa **GitHub CLI** (`gh pr create`) para criação de PRs — nunca `git push origin main`.

O conteúdo abaixo serve como **referência** (regra para colar em Cursor Rules, exemplos, troubleshooting) e complementa o agent e a skill.

---

## Objective

Ensure that **every commit** follows the **Semantic Commits** pattern (compatible with **semantic-release**) and that commits are made **by context** (grouping by module/layer/folder).
Also **prohibit push to `main` branch** without explicit authorization.

---

## Rule summary (for Cursor / Rules)

**Suggested rule name:** `commit-policy-semantic-context`

For the **full process** (context detection, grouping, checklist, output format), use the agent **@agt-dev-commit** or read the skill `.cursor/skills/shared/skill-conventional-commits/SKILL.md`. Summary:

1. **Before committing:** Read `AGENTS.md` if it exists; detect context from folder structure/namespaces; group changed files by context.
2. **Format:** `<type>(<scope>): <subject>` — types: `feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert`; scope = context/module; subject in English, imperative, no period.
3. **Context-based:** One commit per context when possible; don't mix types in the same context; order by dependency (innermost first).
4. **Checklist:** Validate format, scope, subject (English, imperative), same context; no accidental format/linter mix.
5. **Push/PR:** Never push to `main` without explicit phrase `AUTORIZO PUSH NA MAIN`. Use feature branch + `gh pr create` for PRs.

---

## When to use BREAKING CHANGE

If there's a contract/API break:

* Use `!` in the type: `feat(api)!: rename endpoint for ...`
* And add footer:
  ```
  BREAKING CHANGE: <short explanation in English>
  ```

---

## Expected agent output

When using **@agt-dev-commit**, the agent responds with: (1) Context analysis; (2) Commit plan; (3) Ready commands (`git add` + `git commit`); (4) Explicit warning about main branch; (5) If requested, `gh pr create` for PR. See the agent and skill for the exact output format.

---

## Mini-template (generate automatically)

**Context analysis:**
- `domain/` → files: `file1.cs`, `file2.cs`
- `service/` → files: `file3.ts`, `file4.ts`

**Commit plan:**
* `feat(domain): add new feature`
* `fix(service): correct bug`

**Execution:**
```bash
git add <context1 paths>
git commit -m "feat(domain): add new feature"

git add <context2 paths>
git commit -m "fix(service): correct bug"
```

**PR (use GitHub CLI, do not push to main without authorization):**
```bash
gh pr create --title "feat(domain): add new feature" --body "<description>"
```

⚠️ **I will not push to `main` branch without explicit authorization**

---

## Practical Examples

### Example 1: Multiple Contexts

**Changed files:**
- `src/domain/Order.cs`
- `src/domain/OrderItem.cs`
- `src/services/OrderService.cs`
- `src/api/OrdersController.cs`
- `tests/domain/OrderTests.cs`

**Context analysis:**
- `domain/` → `Order.cs`, `OrderItem.cs`
- `service/` → `OrderService.cs`
- `api/` → `OrdersController.cs`
- `test/` → `OrderTests.cs`

**Commit plan:**
1. `feat(domain): add order and order item entities`
2. `feat(service): implement order processing logic`
3. `feat(api): add orders endpoint`
4. `test(domain): add unit tests for order entity`

**Execution:**
```bash
git add src/domain/Order.cs src/domain/OrderItem.cs
git commit -m "feat(domain): add order and order item entities"

git add src/services/OrderService.cs
git commit -m "feat(service): implement order processing logic"

git add src/api/OrdersController.cs
git commit -m "feat(api): add orders endpoint"

git add tests/domain/OrderTests.cs
git commit -m "test(domain): add unit tests for order entity"
```

### Example 2: Single Context, Multiple Types

**Changed files:**
- `src/services/PaymentService.cs` (new feature)
- `src/services/PaymentService.cs` (bug fix)
- `tests/services/PaymentServiceTests.cs` (new tests)

**Context analysis:**
- `service/` → `PaymentService.cs` (feat + fix)
- `test/` → `PaymentServiceTests.cs`

**Commit plan:**
1. `feat(service): add payment processing with retry logic`
2. `fix(service): correct payment validation error handling`
3. `test(service): unit tests for payment service`

**Execution:**
```bash
# Commit feature changes
git add src/services/PaymentService.cs
git commit -m "feat(service): add payment processing with retry logic"

# Commit fix separately (even in same file)
git add src/services/PaymentService.cs
git commit -m "fix(service): correct payment validation error handling"

# Commit tests
git add tests/services/PaymentServiceTests.cs
git commit -m "test(service): unit tests for payment service"
```

### Example 3: Breaking Change

**Changed files:**
- `src/api/UsersController.cs` (renamed endpoint)

**Context analysis:**
- `api/` → `UsersController.cs`

**Commit plan:**
1. `feat(api)!: rename user endpoint from /users to /accounts`

**Execution:**
```bash
git add src/api/UsersController.cs
git commit -m "feat(api)!: rename user endpoint from /users to /accounts

BREAKING CHANGE: The /users endpoint has been renamed to /accounts. 
All clients must update their API calls to use the new endpoint path."
```

### Example 4: Node.js/TypeScript Project

**Changed files:**
- `src/controllers/order.controller.ts`
- `src/services/order.service.ts`
- `src/models/order.model.ts`
- `tests/controllers/order.controller.test.ts`

**Context analysis:**
- `model/` → `order.model.ts`
- `service/` → `order.service.ts`
- `controller/` → `order.controller.ts`
- `test/` → `order.controller.test.ts`

**Commit plan:**
1. `feat(model): add order model with validation`
2. `feat(service): implement order business logic`
3. `feat(controller): add order endpoints`
4. `test(controller): integration tests for order endpoints`

## Troubleshooting

### Problem: Cannot determine context from file structure

**Solution:**
- Use namespace/package name as scope
- If no clear structure, use `core` as scope
- Check `AGENTS.md` for project conventions

**Example:**
```bash
# If file is in root or unclear structure
git commit -m "feat(core): add utility function for date formatting"
```

### Problem: Mixed changes in same file (feat + fix)

**Solution:**
- Make separate commits for different types
- Use `git add -p` to stage specific changes
- Or commit all changes with the primary type and note in subject

**Example:**
```bash
# Stage only feature changes
git add -p src/services/PaymentService.cs
git commit -m "feat(service): add payment retry logic"

# Stage only fix changes
git add -p src/services/PaymentService.cs
git commit -m "fix(service): correct validation error"
```

### Problem: User wants to push to main

**Solution:**
- Require explicit authorization phrase: `AUTORIZO PUSH NA MAIN`
- If phrase not provided, create feature branch and push there (or use `gh pr create`)
- Always warn user about main branch protection

**Example:**
```
User: "push to main"

Agent: "⚠️ I cannot push to main branch without explicit authorization.
Please confirm by typing: AUTORIZO PUSH NA MAIN

Alternatively, I can create a feature branch and open a PR:
git checkout -b feat/your-feature
gh pr create --title "feat(scope): subject" --body "..."
```

### Problem: Commit message validation fails

**Common errors:**
- Missing scope: `feat: add feature` ❌ → `feat(scope): add feature` ✅
- Wrong language: `feat(api): adicionar endpoint` ❌ → `feat(api): add endpoint` ✅
- Not imperative: `feat(api): added endpoint` ❌ → `feat(api): add endpoint` ✅
- Period in subject: `feat(api): add endpoint.` ❌ → `feat(api): add endpoint` ✅

**Solution:**
- Always use format: `type(scope): subject`
- Subject must be in English and imperative mood
- No period at end of subject
- Scope must reflect context/module

## Best Practices

1. **One context per commit**: Group related changes by module/folder
2. **Separate types**: Don't mix `feat` and `fix` in same commit
3. **Dependency order**: Commit innermost layers first (domain → service → api)
4. **Clear subjects**: Use descriptive but concise subjects
5. **English only**: All commit messages in English
6. **Imperative mood**: "add", "fix", "update" (not "added", "fixed", "updated")
7. **No periods**: Subject should not end with period
8. **Branch protection**: Never push to main without explicit authorization

## Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- **Agent:** `@agt-dev-commit` — AI-assisted commits and PR via GitHub CLI
- **Skill:** `.cursor/skills/shared/skill-conventional-commits/SKILL.md` — full format, types, validation, semantic-release
- **Rules:** `.cursor/rules/conventional-commits.md` (if present) — detailed commit type definitions
