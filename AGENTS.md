# DevKit

Development quality assurance skills. Contains SOPs (Standard Operating Procedures) for multiple development phases.

## Skills

### General

| Skill | Type | Description |
|-------|------|-------------|
| `tdd-workflow` | SOP | Test-Driven Development: analyze → write tests → test-review → implement → code-review → verify |
| `issue-fix` | SOP | TDD-driven bug fix: write regression test (FAIL) → fix (PASS) → code-review |
| `test-review` | Tool | Test case quality audit, 6-dimension scoring + missing scenario checklist |
| `code-review` | Tool | Implementation quality audit, 6-dimension scoring + prioritized issue list |

### Frontend

| Skill | Type | Description |
|-------|------|-------------|
| `frontend-workflow` | SOP | Design-first frontend dev: design context → UI/UX cases → component cases → design freeze → implement |
| `ui-cases` | Tool | Generate 5+ design variant HTML files for components/pages, user selects in browser |
| `design-freeze` | Tool | Consolidate all design selections → completeness/consistency audit → freeze design spec |

## Usage

```
/tdd-workflow              # Full TDD flow
/issue-fix                 # TDD-driven bug fix
/test-review               # Review test quality
/code-review               # Review code quality
/frontend-workflow         # Design-first frontend development
/ui-cases button           # Generate design cases for button
/design-freeze             # Freeze design spec
```

## Architecture

DevKit uses a **source-based architecture**:

- `source/skills/` — Single source of truth for all skill definitions
- `scripts/build.js` — Transforms source into platform-specific outputs
- `.claude/skills/` — Built output for Claude Code
- `.codex/skills/` — Built output for Codex CLI

### Platform Differences

| Aspect | Claude Code | Codex CLI |
|--------|-------------|-----------|
| Skills directory | `.claude/skills/` | `.codex/skills/` |
| Config file | `CLAUDE.md` | `AGENTS.md` |
| Frontmatter | Full (name, description, user-invocable, args) | Simplified (name, description, argument-hint) |
| Agent dispatch | `Agent` tool with `subagent_type` | Native agent dispatch |

### Source Placeholders

Source files use `{{placeholder}}` syntax, replaced per-platform at build time:

| Placeholder | Claude Code | Codex |
|-------------|-------------|-------|
| `{{model}}` | Claude | GPT |
| `{{config_file}}` | CLAUDE.md | AGENTS.md |
| `{{skills_path}}` | .claude/skills | .codex/skills |
| `{{ask_instruction}}` | STOP and call AskUserQuestion | ask the user directly |

## Relationship with Other Tools

- **superpowers**: Manages "how to do it" (brainstorm → plan → implement)
- **devkit**: Manages "how good is it" (test quality → code quality → design quality)
- **impeccable**: Manages "how good it looks" (frontend design quality); devkit's frontend-workflow enforces impeccable usage
