---
name: frontend-workflow
description: >
  Design-first frontend development workflow. Enforces establishing UI/UX direction,
  generating component design cases for user selection, and freezing design specs before
  any production code is written. Use when: (1) starting any frontend feature, (2) user
  says /frontend-workflow or "build the UI", (3) implementing pages/components/views. All
  design and code work uses impeccable skill for quality. Triggers on: "build frontend",
  "create the UI", "design the page", "implement the view", "write the component".
---

# Frontend Workflow

设计先行的前端开发 SOP。在写任何正式前端代码之前，必须先确定 UI/UX 方案并获得用户确认。

## Why This Matters

直接写前端代码会导致"做完了但不好看"或"好看但不是用户想要的"。这个流程把设计决策前置——用户在开发之前就能看到并选择每个组件的风格。

## Participants

| 角色 | Skill/Agent | 职责 |
|------|-------------|------|
| **Session Leader** | 你自己 | 协调流程、收集用户反馈 |
| **Case Generator** | `ui-cases` | 为每个组件生成 5+ 设计方案 |
| **Spec Auditor** | `design-freeze` | 审核设计完整性和一致性 |
| **Implementor** | `impeccable:frontend-design` | 按冻结 spec 写正式代码 |
| **Code Reviewer** | `code-review` | 审核实现代码质量 |

## The Flow

```
┌──────────────────────────────────────────┐
│ 1. Design Context                        │
│    确保 .impeccable.md 存在              │
│    否则 → impeccable:teach-impeccable    │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 2. App-Level UI Direction                │
│    /ui-cases 生成整体风格 cases          │
│    输出: app-style-cases.html            │
│    用户选择 → 确定配色/字体/氛围         │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 3. UX Flow Design                        │
│    /ui-cases 生成交互流程 cases          │
│    输出: ux-flow-cases.html              │
│    用户选择 → 确定导航/布局/状态处理     │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 4. Component Cases (逐个)                │
│    /ui-cases {component} × N 个组件      │
│    每个输出: {component}-cases.html       │
│    用户逐一选择偏好方案                  │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 5. Design Freeze                         │
│    /design-freeze                        │
│    Spec Auditor 检查完整性/一致性        │
│    输出: design-spec.md（用户确认冻结）  │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 6. Implementation                        │
│    按 design-spec.md 写代码              │
│    必须使用 impeccable:frontend-design   │
│    不得偏离冻结的 spec                   │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 7. Code Review + Visual Review           │
│    /code-review 审代码质量               │
│    截图对比 cases 中选定的方案           │
│    用户确认视觉一致性                    │
└──────────────┬───────────────────────────┘
               ▼
             Done ✅
```

## Step-by-Step

### Step 1: Design Context

**前置条件**：项目必须有设计上下文。

1. 检查项目根目录是否有 `.impeccable.md`
2. 如果没有 → 调用 `impeccable:teach-impeccable` 建立设计上下文
3. 如果有 → 读取并理解设计原则

**绝不跳过**。没有设计上下文直接写代码 = 盲写。

### Step 2: App-Level UI Direction

确定整个应用的视觉基调。

调用 `/ui-cases` 技能，目标是"应用整体风格"：
- 配色方案、字体组合、间距系统、圆角/阴影风格
- 输出 `app-style-cases.html`（5+ 种整体风格方向）
- 用户在浏览器中查看并选择

用户确认后记录选择，继续。

### Step 3: UX Flow Design

确定交互模式和用户流转。

调用 `/ui-cases` 技能，目标是"交互流程与布局"：
- 页面结构、导航模式、关键交互流、状态处理
- 输出 `ux-flow-cases.html`
- 用户选择

### Step 4: Component Cases

对每个 UI 组件，调用 `/ui-cases {component-name}`。

**组件优先级：**
1. 导航（影响全局）
2. 按钮 + 表单控件（高频交互）
3. 数据展示（卡片、表格、列表）
4. 反馈（Toast、Modal、Loading）
5. 装饰性元素

每个组件：
1. 调用 `/ui-cases` → 生成 `{component}-cases.html`
2. 用户打开浏览器查看
3. 用户告知选择
4. 记录选择，继续下一个组件

**一次只做一个组件**，不要批量出全部 cases。用户逐一 review 避免信息过载。

### Step 5: Design Freeze

所有组件选择完毕后，调用 `/design-freeze`：

1. Spec Auditor 检查完整性和一致性
2. 如果有缺口 → 补充缺失的 cases
3. 如果有冲突 → 与用户讨论解决
4. 生成 `design-spec.md`
5. 用户最终确认 → **设计冻结**

### Step 6: Implementation

**设计冻结后才开始写代码。**

强制要求：
- **必须使用 `impeccable:frontend-design` skill** 指导所有前端代码
- 严格按 `design-spec.md` 实现，不得自行"改进"设计
- 实现顺序：design tokens → 基础组件 → 复合组件 → 页面布局 → 页面内容
- 如果发现技术困难需要调整设计 → **先与用户沟通**

### Step 7: Code Review + Visual Review

实现完成后，双重验收：

1. **代码质量**：调用 `/code-review` 审核实现代码
2. **视觉一致性**：截图/预览，与 cases 中选定方案对比
3. 用户确认通过

如果不通过 → 修正 → 重新 review。

## Anti-Patterns

| Anti-Pattern | What To Do Instead |
|---|---|
| 跳过 cases 直接写代码 | 永远先出 cases，用户没选择就不写代码 |
| Cases 只做 2 种 | 至少 5 种，方向差异要大 |
| 不用 impeccable | 所有前端代码（cases + 正式代码）都用 impeccable |
| 实现时偷偷改设计 | 严格按冻结 spec，有问题先沟通 |
| 一次出全部组件 cases | 一个组件一轮 review，避免信息过载 |
| 没有 .impeccable.md 就开始 | 先跑 teach-impeccable |
| 跳过 design-freeze | 不冻结 = 没标准 = 实现时随意发挥 |
