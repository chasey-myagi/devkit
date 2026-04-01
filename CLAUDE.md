# DevKit

开发质量保障 skill 包。

## Architecture

- `skills/` — 所有 skill 源文件，plugin 直接读取
- `hooks/` — 自动化 hooks
- 不再需要 build 步骤

## Skills

| Skill | 类型 | 说明 |
|-------|------|------|
| `harness-workflow` | SOP | 多 Agent 编排框架（Planner→Generator→Evaluator 迭代循环） |
| `tdd-workflow` | SOP | 测试驱动开发 |
| `issue-fix` | SOP | TDD 驱动的 bug 修复 |
| `test-review` | Tool | 测试质量审核（6 维度） |
| `code-review` | Tool | 代码质量审核（6 维度） |
| `linus-review` | Tool | Linus 风格代码审查 |
| `research-report` | Tool | 生成单文件 HTML 研究报告 |

> 前端相关 skills（frontend-workflow、ui-cases、design-freeze）已迁移至 `frontend-devkit` 包。

## Hooks

| 事件 | 触发 | 效果 |
|------|------|------|
| PostToolUse:Bash | 检测到测试失败/编译错误 | 提示用 /issue-fix 排查 |
