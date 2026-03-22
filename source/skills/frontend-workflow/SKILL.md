---
name: frontend-workflow
description: >
  Design-first frontend development workflow. Enforces establishing UI/UX direction,
  generating component design cases for user selection, and freezing design specs
  before any production code is written. Use when: (1) starting any frontend feature,
  (2) user says /frontend-workflow or "build the UI", (3) implementing pages/components/views.
  All design and code work uses impeccable skill for quality. Triggers on: "build frontend",
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

## Core Concepts

### 风格体系（Style System）

一次前端设计可以有**一个或多个风格体系**，每个体系下的所有组件共享同一设计语言。

```
单风格（默认）：
  所有组件只出一套 cases（5+ variant）

多风格（用户要求时）：
  每个组件出 N 套 cases，每套对应一个风格体系
  例如：Original（科技极客）、DaisyUI（圆润友好）、Minimal（极简）
```

用户可能：
- 一开始就指定要多套风格对比
- 看了第一套后要求"再来一套 XX 风格的"
- 从不同风格体系中混搭组件

### Cases 文件层级

```
{cases-dir}/
├── index.html                              # 对比工具（自动生成/更新）
├── {component}-cases.html                  # 单风格时
├── {component}-{style}-cases.html          # 多风格时
│   例如：
│   ├── app-header-cases.html               # 仅一套风格
│   ├── program-card-original-cases.html    # 风格 A
│   └── program-card-daisy-cases.html       # 风格 B
```

### 对比工具 index.html

当有 2+ 个 cases 文件时，**必须生成/更新 index.html**。

交互设计：
- **全屏对比模式** — 左右分屏，iframe 撑满，最大化展示面积
- **顶部极窄工具栏** — 组件 tab + 风格标签，不浪费空间
- **键盘快捷键** — 数字键切组件、方向键切上/下个、F/G 全屏左/右、Esc 恢复
- **单风格时** — 只显示一个全屏 iframe，无分屏
- **多风格时** — 默认双栏对比，toolbar 显示左右风格标签

必须使用 `ui-cases/index-template.md` 中定义的模板生成。

## The Flow

```
┌──────────────────────────────────────────┐
│ 1. Design Context                        │
│    确保 .impeccable.md 存在              │
│    否则 → impeccable:teach-impeccable    │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 2. Component List                        │
│    列出所有需要设计的组件                │
│    确定风格体系数量（1 套 or N 套）      │
│    写入 frontend-design.md              │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 3. Generate Cases                        │
│    /ui-cases 批量或逐个生成             │
│    每生成一批 → 更新 index.html         │
│    用户可随时追加风格体系               │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 4. User Selection                        │
│    用户通过 index.html 对比选择         │
│    每个组件选定方案（可跨风格混搭）     │
│    记录到 design-spec.md               │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 5. Design Freeze                         │
│    /design-freeze 审核完整性/一致性      │
│    输出 design-spec.md（用户确认冻结）   │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 6. Implementation                        │
│    按 design-spec.md 写代码             │
│    必须使用 impeccable:frontend-design   │
│    不得偏离冻结的 spec                  │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 7. Code Review + Visual Review           │
│    /code-review 审代码质量              │
│    截图对比 cases 中选定的方案          │
│    用户确认视觉一致性                   │
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

### Step 2: Component List

在开始生成 cases 之前，先与用户对齐：

1. 列出所有需要设计的组件（写入 `frontend-design.md`）
2. 每个组件注明：名称、职责、所在页面、包含的状态
3. 确定风格体系：
   - 默认 1 套，用户要求时可追加
   - 例如："先出一套科技风，再出一套 DaisyUI 风"
4. 确定 cases 文件输出目录

### Step 3: Generate Cases

调用 `/ui-cases` 生成各组件的 cases：

- **可以并行**：多个组件的 cases 同时生成（dispatch 多个 agent）
- **多风格体系**：同一组件出多份 cases（每份标注风格名）
- **每次生成后**：更新 `index.html` 对比工具

**每个 cases.html 必须包含**：
- 5+ 种差异大的方案
- 日间/夜间两种模式预览
- 所有交互状态（hover、focus、active、disabled、loading）
- 方案名称 + 一句话描述 + 风格标签

**index.html 更新规则**：
- 第一个 cases 文件生成后就创建 index.html
- 后续每个新 cases 文件都追加到 index.html 的 tab 列表中
- 多风格时自动开启分屏对比模式

### Step 4: User Selection

1. 告知用户打开 `index.html`（给完整路径）
2. 用户通过对比工具浏览所有方案
3. 用户告知每个组件的选择（可以混搭风格）
4. 记录到 `design-spec.md`

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
| 没有 .impeccable.md 就开始 | 先跑 teach-impeccable |
| 跳过 design-freeze | 不冻结 = 没标准 = 实现时随意发挥 |
| 多风格时不提供对比工具 | 有 2+ cases 文件就必须有 index.html |
| index.html 占太多空间 | 工具栏极窄，把空间全给 cases iframe |
