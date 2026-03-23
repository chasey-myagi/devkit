# DevKit

Development quality assurance skills for Claude Code.

7 skills. TDD workflow, test review, code review, and design-first frontend development.

## Skills

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

## Hooks

| Event | Trigger | Effect |
|-------|---------|--------|
| PostToolUse:Bash | Test failure or compile error detected | Suggest `/issue-fix` for investigation |

## Install

```bash
claude install chasey-myagi/devkit
```

## Usage

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

## How it works

DevKit enforces **quality gates** at every stage:

```
Write tests → /test-review (>= 8.0?) → Implement → /code-review (>= 7.5?)
                  ✗ Fix gaps                          ✗ Fix issues
```

- **Test review**: 6 dimensions — quantity, scenario coverage, boundary exploration, error paths, state combinations, test quality. Gate: every dimension >= 7.5, final >= 8.0.
- **Code review**: 6 dimensions — correctness, security, architecture, error handling, maintainability, requirements fit. Gate: every dimension >= 7.0, final >= 7.5, no Critical issues.
- **All reviewers are independent agents** — fresh context each time, zero bias from implementation history.

## Architecture

```
skills/                 ← Skill source files (plugin reads directly)
    ├── tdd-workflow/
    ├── test-review/
    ├── code-review/
    ├── issue-fix/
    ├── frontend-workflow/
    ├── ui-cases/
    └── design-freeze/

hooks/
    └── hooks.json      ← Automation hooks
```

## Version

v0.3.0

## License

[BUSL-1.1](LICENSE)
