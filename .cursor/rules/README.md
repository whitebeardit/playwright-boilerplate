# Cursor Rules

This directory contains rules and guidelines for Cursor AI to follow when working on this project.

## Rule Files

### `conventional-commits.md`

Complete specification of the Conventional Commits pattern used in the project. Contains:
- Commit format specification
- Allowed commit types
- AI behavior guidelines
- Examples of valid and invalid commits
- Pull Request format and rules
- Breaking changes format
- Semantic-release integration details
- Validation checklists
- Context-based commit grouping

> **Note**: For specialized commit assistance, see the `agt-dev-commit` agent at `.cursor/agents/agt-dev-commit.md` which uses the `skill-conventional-commits` skill at `.cursor/skills/shared/skill-conventional-commits/SKILL.md`.

## Why These Rules Exist

This project uses **semantic-release** for automatic versioning and publishing. Semantic-release analyzes commits following the [Conventional Commits](https://www.conventionalcommits.org/) pattern to determine:

- Whether to generate a new version
- What type of version (MAJOR, MINOR, PATCH)
- What to include in the changelog

**Commits that don't follow the pattern are ignored** by semantic-release, resulting in:
- ❌ Versions not automatically generated
- ❌ Outdated changelog
- ❌ Publication not performed

## How to Use

Cursor AI automatically reads these rules and applies them when:
- You request commit creation
- You request Pull Request creation
- You make code changes

If you create a commit or PR that doesn't follow the pattern, Cursor AI will:
1. Alert about the problem
2. Suggest the correct format
3. Explain why it's important

## Related Assets

- **Skill**: `.cursor/skills/shared/skill-conventional-commits/SKILL.md` - Reusable knowledge about Conventional Commits
- **Agent**: `.cursor/agents/agt-dev-commit.md` - Specialized agent for commit creation
- **Command**: `.cursor/commands/wb-commit.md` - Command for context-based commits with GitHub CLI

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
