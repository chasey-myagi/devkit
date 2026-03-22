---
name: design-freeze
description: >
  Consolidate all confirmed UI/UX decisions into a frozen design spec document.
  Use when: (1) all ui-cases selections are complete, (2) user says /design-freeze,
  (3) ready to transition from design to implementation phase, (4) need to formalize
  design decisions before coding. Dispatches an auditor agent to verify completeness
  and consistency. Triggers on: "freeze the design", "finalize design", "lock the spec",
  "ready to implement", or when all component cases have been selected.
---

# Design Freeze

汇总所有已确认的 UI/UX 决策，生成冻结的设计规范文档。冻结后，实现必须严格按照此文档执行。

## Flow

```
1. Collect all case selections and UI/UX decisions
2. Dispatch spec-auditor agent to verify completeness
3. Generate design-spec.md
4. User final confirmation
5. Freeze — no changes without explicit approval
```

## Step 1: Collect Decisions

Scan the project for all design artifacts:

1. `UI.html` — 整体风格方向
2. `UX.html` — 交互流程
3. `*-cases.html` — 每个组件的方案选择
4. `.impeccable.md` — 设计上下文
5. 对话历史中用户的选择记录

## Step 2: Dispatch Spec Auditor

Spawn a **spec-auditor agent** to check completeness and consistency.

Read `skills/design-freeze/spec-auditor.md` for the agent prompt.

The auditor verifies:
- 所有需要 cases 的组件是否都有选择记录
- 选择之间是否有视觉冲突（如组件 A 选了极简但组件 B 选了极度华丽）
- Design tokens 是否完整（颜色、字体、间距、圆角、阴影）
- 交互模式是否一致

## Step 3: Generate design-spec.md

Output a `design-spec.md` using this structure:

```markdown
# [Project] Frontend Design Spec

> ⚠️ FROZEN — 此文档已冻结。实现必须严格遵循。修改需经用户明确批准。

## Design Tokens

### Colors
[CSS custom properties]

### Typography
[Font families, scale, weights]

### Spacing & Layout
[Spacing scale, breakpoints, max-width]

### Effects
[Border radius, shadows, transitions]

## Component Specs

### {Component Name}
- **方案来源**: {name}-cases.html — Case {N}
- **描述**: {one-line description}
- **修改**: {user's modifications, or "无"}
- **状态**: default / hover / focus / active / disabled / loading
- **截图/参考**: [path to cases file]

[Repeat for each component]

## Page Layouts
[Confirmed layouts from UX.html]

## Interaction Patterns
[Navigation, transitions, state handling]
```

## Step 4: User Confirmation

Present the complete spec to the user:

> "设计规范已生成：`design-spec.md`。请检查所有组件选择和 design tokens 是否符合预期。确认后将冻结——实现阶段不得偏离此规范。"

## Step 5: Freeze

After user confirms:
- 在 design-spec.md 顶部保留 FROZEN 标记
- 后续实现 agent 必须读取此文件作为约束
- 任何偏离必须先获得用户批准
