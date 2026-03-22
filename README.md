# 🛡️ DevKit

**Development quality assurance skills for AI coding assistants.**

7 skills, 2 platforms. TDD workflow, test review, code review, and design-first frontend development — shipped as plug-and-play skills for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [Codex CLI](https://github.com/openai/codex).

## 📦 Skills

### General

| Skill | Type | What it does |
|-------|------|-------------|
| `/tdd-workflow` | SOP | Full TDD cycle: analyze → write tests → quality gate → implement → code review → verify |
| `/issue-fix` | SOP | TDD-driven bug fix: write regression test (FAIL) → fix (PASS) → code review |
| `/test-review` | Tool | Test quality audit — 6-dimension scoring + missing scenario checklist |
| `/code-review` | Tool | Code quality audit — 6-dimension scoring + prioritized issue list |

### Frontend

| Skill | Type | What it does |
|-------|------|-------------|
| `/frontend-workflow` | SOP | Design-first frontend: design context → UI cases → component cases → design freeze → implement |
| `/ui-cases` | Tool | Generate 5+ interactive design variants as HTML — user picks in browser |
| `/design-freeze` | Tool | Consolidate design selections → completeness audit → freeze design spec |

## 🚀 Quick Start

**Claude Code:**

```bash
claude install chasey-myagi/devkit
```

**Codex CLI:**

Clone or copy `.codex/skills/` into your project.

**Then use:**

```
/tdd-workflow                    # Start the full TDD flow
/issue-fix                       # TDD-driven bug fix
/test-review                     # Review test quality
/test-review path/to/tests       # Review specific test files
/code-review                     # Review code quality
/code-review HEAD~3..HEAD        # Review a specific git range
/frontend-workflow               # Design-first frontend development
/ui-cases button                 # Generate design cases for button
/design-freeze                   # Freeze design spec
```

## ⚡ How it works

DevKit enforces **quality gates** at every stage:

```
Write tests → /test-review (≥ 8.0?) → Implement → /code-review (≥ 7.5?)
                  ❌ Fix gaps                          ❌ Fix issues
```

- **Test review**: 6 dimensions — quantity, scenario coverage, boundary exploration, error paths, state combinations, test quality. Gate: every dimension ≥ 7.5, final ≥ 8.0.
- **Code review**: 6 dimensions — correctness, security, architecture, error handling, maintainability, requirements fit. Gate: every dimension ≥ 7.0, final ≥ 7.5, no Critical issues.
- **All reviewers are independent agents** — fresh context each time, zero bias from implementation history.

## 🏗️ Architecture

```
source/skills/          ← Single source of truth
    ├── tdd-workflow/
    ├── test-review/
    ├── code-review/
    ├── issue-fix/
    ├── frontend-workflow/
    ├── ui-cases/
    └── design-freeze/

        ↓  node scripts/build.js

.claude/skills/         ← Claude Code output
.codex/skills/          ← Codex CLI output
```

Source files use `{{placeholders}}` replaced per-platform at build time:

| Placeholder | Claude Code | Codex |
|-------------|-------------|-------|
| `{{model}}` | Claude | GPT |
| `{{config_file}}` | CLAUDE.md | AGENTS.md |
| `{{skills_path}}` | .claude/skills | .codex/skills |

Never edit `.claude/skills/` or `.codex/skills/` directly — they are build outputs. Edit `source/skills/` and rebuild.

## 🧩 How it fits

- [**superpowers**](https://github.com/anthropics/superpowers) — manages *how to do it* (brainstorm → plan → implement)
- **devkit** — manages *how good is it* (test quality → code quality → design quality)
- [**impeccable**](https://github.com/pbakaus/impeccable) — manages *how good it looks* (frontend design quality)

Recommended flow:

```
superpowers:brainstorming → superpowers:writing-plans → devkit:tdd-workflow → superpowers:verification
```

## 🛠️ Development

```bash
node scripts/build.js    # Build for all platforms
```

## 📄 License

MIT
