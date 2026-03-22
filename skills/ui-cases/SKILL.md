---
name: ui-cases
description: >
  Generate interactive HTML case files with 5+ design variants for a UI component or page style.
  Use when: (1) need to show users multiple design options, (2) user says /ui-cases,
  (3) in frontend-workflow before implementation, (4) exploring visual directions.
  Supports multiple style systems (e.g., Original + DaisyUI) and auto-generates index.html
  for side-by-side comparison. Triggers on: "show me options", "design cases", "component variants",
  "which style", "再来一套XX风格".
---

# UI Cases

为 UI 组件生成多种设计方案，让用户在浏览器中对比选择。支持单风格和多风格体系。

## Flow

```
1. 确定目标（组件、风格体系）
2. 读取设计上下文
3. Dispatch case-generator agent（可并行多个）
4. 生成/更新 index.html 对比工具
5. 引导用户对比选择
6. 记录选择
```

## Step 1: Identify Target

解析用户输入，确定：

| 参数 | 说明 | 示例 |
|------|------|------|
| component | 目标组件/页面 | `app-header`、`button`、`program-card` |
| style | 风格体系名称（可选） | `daisy`、`minimal`、`brutalist` |
| cases-dir | 输出目录 | `frontend/design/` |

**命名规则**：
- 单风格：`{component}-cases.html`
- 多风格：`{component}-{style}-cases.html`

**批量模式**：
- 用户可一次指定多个组件：`/ui-cases header,card,progress --style daisy`
- 每个组件 dispatch 独立 agent，并行生成

## Step 2: Gather Context

1. 读取 `.impeccable.md` — 如果缺失，先 invoke `impeccable:teach-impeccable`
2. 读取已有 `design-spec.md` — 继承已冻结的设计决策
3. 理解技术栈和风格要求

## Step 3: Dispatch Case Generator Agent

为每个组件 spawn 一个 agent。读取 `case-generator.md` 构建 prompt：

```
Agent(
  description: "ui-cases: {component} [{style}]",
  prompt: [case-generator.md 内容 + 任务上下文],
  mode: "auto",
  run_in_background: true  // 并行时
)
```

Prompt 结构：
```
你是一个 UI 方案探索专家。请按照以下规范生成设计方案：

[case-generator.md 内容]

## 本次任务

### 目标组件
{component 描述、职责、包含的数据和状态}

### 风格体系
{style 名称和特征描述，如 "DaisyUI: 圆润友好，活泼配色，pill 形状"}
如无指定风格，则自由探索 5 种差异大的方向。

### 设计上下文
{.impeccable.md 内容}

### 已冻结决策
{design-spec.md 内容，或 "无"}

### 配色 Token
{指定的配色方案，含日间/夜间}

### 输出路径
{cases-dir}/{component}[-{style}]-cases.html
```

## Step 4: Generate/Update index.html

**每次有新 cases 文件生成后，都要更新 index.html。**

扫描 `{cases-dir}/` 目录中所有 `*-cases.html` 文件，解析出组件和风格信息，生成对比工具。

读取 `index-template.md` 了解 index.html 的完整规范和模板。

### 自动检测模式

```
cases 文件数量 == 1  →  单面板模式（全屏显示）
cases 文件数量 >= 2  →  判断是否有多风格
  同组件多风格      →  分屏对比（左右各一个风格）
  不同组件单风格    →  tab 切换 + 单面板
  混合              →  tab 切换 + 分屏对比
```

## Step 5: Present to User

1. 告知 index.html 完整路径
2. 说明快捷键操作（数字键切组件、F/G 全屏左/右、Esc 恢复）
3. 等待用户反馈

## Step 6: Record Selection

用户的选择记录到 `design-spec.md`：

```markdown
## {Component Name}
- **Selected**: Case {N} — {方案描述}
- **Style**: {风格体系名}
- **Modifications**: {用户要求的调整}
- **Source**: {cases-dir}/{filename}
```

## Notes

- 每个 case-generator 是 **fresh agent** — 无记忆
- Cases 必须展示 **真实交互状态** + **日间/夜间两种模式**
- 最少 5 种 variant，最多 8 种
- Variant 之间要 **方向差异大**，不是颜色微调
- **并行生成**：多个组件/多个风格可同时 dispatch
