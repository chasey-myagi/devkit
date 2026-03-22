# 🛡️ DevKit

Development quality assurance skills for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

TDD workflow, test review, and code review — shipped as plug-and-play Claude Code skills.

## 📦 Skills

| Skill | Type | What it does |
|-------|------|-------------|
| `tdd-workflow` | SOP | Full TDD cycle: analyze → write tests → quality gate → implement → code review → verify |
| `test-review` | Tool | Test quality audit — scores across 6 dimensions + missing scenario checklist |
| `code-review` | Tool | Code quality audit — scores across 6 dimensions + prioritized issue list |

## 🚀 Quick Start

```bash
# Install as a Claude Code skill package
claude install chasey-myagi/devkit
```

```
/tdd-workflow                    # Start the full TDD flow
/test-review                     # Review test quality
/test-review path/to/tests       # Review specific test files
/code-review                     # Review code quality
/code-review HEAD~3..HEAD        # Review a specific git range
```

## 🧩 How it fits

DevKit handles **"how good is it"** (test quality → code quality), while process tools like [superpowers](https://github.com/anthropics/superpowers) handle **"how to do it"** (brainstorm → plan → implement → review).

They work best together:

```
brainstorming → writing-plans → devkit:tdd-workflow → verification
```

## 📄 License

MIT
