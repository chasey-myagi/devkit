---
name: ui-cases
description: >
  Generate interactive HTML case files with 5+ design variants for a UI component or page style.
  Use when: (1) need to show users multiple design options, (2) user says /ui-cases,
  (3) in frontend-workflow before implementation, (4) exploring visual directions.
  Dispatches a design explorer agent that generates side-by-side comparison pages.
  Triggers on: "show me options", "design cases", "component variants", "which style".
---

# UI Cases

Dispatch an independent design explorer agent to generate multiple design variants for user selection. You (the session leader) handle the workflow; the explorer generates the comparison pages.

## Flow

```
1. Identify what needs cases (component, page style, or UX pattern)
2. Gather design context (.impeccable.md)
3. Dispatch case-generator agent
4. Present cases to user (open in browser)
5. Record user's selection
```

## Step 1: Identify Target

If no target specified, ask the user:
- Is this a **component** (button, card, nav, form)?
- A **page-level style** (overall look & feel)?
- A **UX pattern** (navigation flow, state handling)?

If target given (e.g., `/ui-cases navigation-bar`), use it directly.

## Step 2: Gather Context

1. Read `.impeccable.md` from project root — if missing, invoke `impeccable:teach-impeccable` first
2. Read any existing `design-spec.md` — inherit frozen decisions
3. Understand the tech stack (React? Vue? vanilla HTML?)

## Step 3: Dispatch Case Generator Agent

Spawn a **new agent** as the case generator. It must produce an HTML file with side-by-side comparisons.

Use the Agent tool:

```
Agent(
  description: "ui-cases: [component name]",
  prompt: <see case-generator.md>,
  subagent_type: "general-purpose"
)
```

Read `{{skills_path}}/ui-cases/case-generator.md` for the full agent prompt. Construct the dispatch prompt as:

```
你是一个 UI 方案探索专家。请按照以下规范生成设计方案：

[paste contents of case-generator.md]

## 本次任务

### 目标组件/页面
[component or page description]

### 设计上下文
[contents of .impeccable.md]

### 已冻结的设计决策
[contents of design-spec.md if exists, or "无"]

### 技术栈
[e.g., React + Tailwind / vanilla HTML]

### 输出文件路径
[e.g., docs/frontend/cases/button-cases.html]

请生成方案文件。
```

**Important**: The agent MUST use `impeccable:frontend-design` style guidelines. Every case must be production-quality, not wireframes.

## Step 4: Present to User

1. Tell the user file path
2. Suggest: `open docs/frontend/cases/{name}-cases.html`
3. Ask: "请在浏览器中查看，告诉我你偏好哪个方案（可以混搭，比如'方案 3 的布局 + 方案 1 的配色'）"

## Step 5: Record Selection

User's choice goes into `design-spec.md`:

```markdown
## {Component Name}
- **Selected**: Case 3 (具体描述)
- **Modifications**: 按钮改为更圆的圆角
- **Source**: docs/frontend/cases/{name}-cases.html
```

## Notes

- Each case-generator run is a **fresh agent** — no memory of previous runs
- Cases must show **real interactive states** (hover, focus, disabled), not just static mockups
- Minimum 5 variants, maximum 8 (too many = decision paralysis)
- Variants should be **genuinely different directions**, not color tweaks
