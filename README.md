# DevKit

> **⚠️ Archived (2026-06) — 不再维护。** 日常用的 code-review / test-review / linus-review 三件套已迁到 [chasey-myagi/skills](https://github.com/chasey-myagi/skills)（持续维护，`npx skills add`）。本仓作为只读归档，保留 harness-workflow / tdd-workflow / issue-fix / pdf-html / repo-port 等退役 skill，需要时仍可取用。

Development quality assurance skills for Claude Code.

10 skills covering multi-agent harness, TDD, code review, design-first frontend, research reports, and more.

## Install

```bash
claude install chasey-myagi/devkit
```

## Skills

### Harness

| Skill | Type | What it does |
|-------|------|-------------|
| `/harness-workflow` | SOP | GAN-inspired multi-agent harness: Planner → Generator → Evaluator with iterative feedback loops via AgentTeam. Supports backend, frontend, and fullstack tasks. |

### Code Quality

| Skill | Type | What it does |
|-------|------|-------------|
| `/tdd-workflow` | SOP | Full TDD cycle: analyze → write tests → quality gate → implement → code review → verify |
| `/issue-fix` | SOP | TDD-driven bug fix: write regression test (FAIL) → fix (PASS) → code review |
| `/test-review` | Tool | Test quality audit — 6-dimension scoring + missing scenario checklist |
| `/code-review` | Tool | Code quality audit — 6-dimension scoring + prioritized issue list |
| `/linus-review` | Tool | Linus Torvalds-style code roast — blunt, sharp, but every point hits a real issue |

### Frontend

| Skill | Type | What it does |
|-------|------|-------------|
| `/frontend-workflow` | SOP | Design-first frontend: design context → UI cases → design freeze → implement |
| `/ui-cases` | Tool | Generate 5+ interactive design variants as HTML — user picks in browser |
| `/design-freeze` | Tool | Consolidate design selections → completeness audit → freeze design spec |

### Research

| Skill | Type | What it does |
|-------|------|-------------|
| `/research-report` | Tool | Generate a single-file HTML report with dark/light theme, scroll animations, and strong visual hierarchy |

## Usage

```
/harness-workflow                # Multi-agent harness (Planner→Generator→Evaluator)
/tdd-workflow                    # Start the full TDD flow
/issue-fix                       # TDD-driven bug fix
/test-review                     # Review test quality
/test-review path/to/tests       # Review specific test files
/code-review                     # Review code quality
/code-review HEAD~3..HEAD        # Review a specific git range
/linus-review                    # Linus-style roast of recent changes
/linus-review src/server/ask.rs  # Roast a specific file
/frontend-workflow               # Design-first frontend development
/ui-cases button                 # Generate design cases for button
/design-freeze                   # Freeze design spec
/research-report                 # Generate HTML research report
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

## Hooks

| Event | Trigger | Effect |
|-------|---------|--------|
| PostToolUse:Bash | Test failure or compile error detected | Suggest `/issue-fix` for investigation |

## Architecture

```
skills/
    ├── harness-workflow/   # 多 Agent 编排框架
    │   ├── SKILL.md
    │   ├── planner.md
    │   ├── backend/
    │   │   ├── generator.md
    │   │   └── evaluator.md
    │   └── frontend/
    │       ├── generator.md
    │       └── evaluator.md
    ├── tdd-workflow/       # TDD 全流程
    ├── test-review/        # 测试质量审核
    ├── code-review/        # 代码质量审核
    ├── issue-fix/          # TDD 驱动 bug 修复
    ├── linus-review/       # Linus 风格毒舌审查
    ├── frontend-workflow/  # 设计先行前端开发
    ├── ui-cases/           # 组件设计方案生成
    ├── design-freeze/      # 冻结设计规范
    └── research-report/    # HTML 研究报告生成

hooks/
    └── hooks.json          # 自动化 hooks
```

## License

[BUSL-1.1](LICENSE)
