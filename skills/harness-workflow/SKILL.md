---
name: harness-workflow
description: >
  基于 Anthropic「Harness 设计」论文的多 Agent 编排框架，通过 AgentTeam 实现
  Planner→Generator→Evaluator 的迭代反馈循环。适用于任何需要高质量产出的开发任务——
  前端、后端、全栈。每个角色作为独立 Teammate 运行，天然上下文隔离。
  Use when: (1) 构建完整功能或应用, (2) 用户说 /harness 或 "用 harness 模式",
  (3) 需要高质量迭代产出的复杂任务, (4) 全栈开发。
  Triggers on: "harness", "高质量构建", "full harness", "用 harness",
  "build with quality", 或任何明确需要多 agent 协作的复杂开发任务。
---

# Harness Workflow

基于 GAN 对抗思想的多 Agent 编排框架。核心理念：**生成与评估分离，通过迭代反馈循环驱动质量收敛。**

## Why This Matters

单 Agent 开发有两个致命问题：

1. **上下文丢失** — 随着上下文填满，模型失去连贯性，甚至过早收尾
2. **自我评估偏差** — Agent 总是自信地夸赞自己的产出，即使质量平庸

AgentTeam 天然解决这两个问题：每个 Teammate 拥有独立 200k 上下文（无污染），Evaluator 与 Generator 是不同进程（无偏差）。

> "Every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing."
> — Prithvi Rajasekaran, Anthropic Labs

## Participants

| 角色 | Teammate 提示词 | 职责 |
|------|-----------------|------|
| **Lead** | 你自己 | 创建团队、协调流程、与用户交互 |
| **Planner** | `planner.md` | 将简短需求扩展为完整产品规格 |
| **Backend Generator** | `backend/generator.md` | TDD 方式实现后端功能 |
| **Backend Evaluator** | `backend/evaluator.md` | 测试质量 + 代码质量双重评审 |
| **Frontend Generator** | `frontend/generator.md` | 设计驱动实现前端界面 |
| **Frontend Evaluator** | `frontend/evaluator.md` | 浏览器交互测试 + 四维结构化评分 |

## 按任务类型组合

| 任务类型 | Teammates | 预估迭代 |
|----------|-----------|----------|
| 后端/API | Planner + Backend Generator + Backend Evaluator | 1-3 轮 |
| 前端/UI | Planner + Frontend Generator + Frontend Evaluator | 3-5 轮 |
| 全栈 | Planner + 全部 Generator + 全部 Evaluator | 3-5 轮 |

## The Flow

```
Phase 0: 初始化
┌──────────────────────────────────────────┐
│ TeamCreate("harness-{task-type}")        │
│ 根据任务类型决定创建哪些 Teammates       │
└──────────────┬───────────────────────────┘
               ▼
Phase 1: 规划
┌──────────────────────────────────────────┐
│ Spawn Planner teammate                   │
│ SendMessage → Planner: 用户需求          │
│ Planner 输出 harness-spec.md            │
│ Planner → SendMessage → Lead: spec 完成  │
│ Lead → 展示给用户确认/调整               │
└──────────────┬───────────────────────────┘
               ▼
Phase 2: 生成-评估迭代循环
┌──────────────────────────────────────────┐
│ Spawn Generator + Evaluator teammates    │
│ SendMessage → Generator: 按 spec 实现    │
│                                          │
│  ┌── 迭代循环（max N 轮）──────────┐    │
│  │ Generator → 实现功能             │    │
│  │ Generator → Evaluator: "请评估"  │    │
│  │ Evaluator → 独立评估             │    │
│  │                                  │    │
│  │ PASS → Evaluator → Lead: 终报告  │    │
│  │ FAIL → Evaluator → Generator:    │    │
│  │        结构化反馈 → 继续循环     │    │
│  │ 超限 → Evaluator → Lead: 需介入  │    │
│  └──────────────────────────────────┘    │
└──────────────┬───────────────────────────┘
               ▼
Phase 3: 完成
┌──────────────────────────────────────────┐
│ Lead → 汇总最终报告 → 展示用户           │
│ TeamDelete 清理                          │
└──────────────────────────────────────────┘
```

## Step-by-Step

### Phase 0: 初始化

1. 判断任务类型：`backend` / `frontend` / `fullstack`
2. 创建团队：

```
TeamCreate("harness-{task-type}")
```

### Phase 1: 规划

1. 读取 `skills/harness-workflow/planner.md` 的完整内容
2. Spawn Planner teammate，将 planner.md 内容作为 system prompt 的一部分：

```
Agent(
  description: "harness-planner",
  prompt: "[planner.md 完整内容]\n\n## 用户需求\n{user_request}",
  team_name: "harness-{task-type}"
)
```

3. Planner 将输出写入 `harness-spec.md`
4. Planner 通过 SendMessage 通知 Lead spec 完成
5. Lead 展示 spec 要点给用户，等待确认
6. 用户可调整 → Lead 通过 SendMessage 传达修改 → Planner 更新 spec

### Phase 2: 生成-评估迭代循环

**这是核心阶段。**

1. 读取对应的 Generator 和 Evaluator 提示词文件
2. Spawn Generator 和 Evaluator：

```
# 后端
Agent(
  description: "harness-backend-generator",
  prompt: "[backend/generator.md 内容]\n\n## 产品规格\n[harness-spec.md 内容]",
  team_name: "harness-backend"
)

Agent(
  description: "harness-backend-evaluator",
  prompt: "[backend/evaluator.md 内容]\n\n## 产品规格\n[harness-spec.md 内容]",
  team_name: "harness-backend"
)
```

3. Generator 开始实现，完成后通过 SendMessage 通知 Evaluator
4. Evaluator 独立评估，输出结构化评分报告
5. **反馈路由**：
   - **PASS** → Evaluator 发送最终报告给 Lead
   - **FAIL** → Evaluator 发送结构化反馈直接给 Generator（P2P）
   - **超过迭代上限** → Evaluator 通知 Lead 需要人类介入

#### 迭代上限

| 任务类型 | 最大迭代轮数 | 原因 |
|----------|-------------|------|
| 后端 | 3 轮 | 后端质量主要靠测试覆盖，收敛快 |
| 前端 | 5 轮 | 视觉/交互质量需要更多打磨 |
| 全栈 | 各 3/5 轮 | 后端先收敛，前端再迭代 |

#### 全栈场景的执行顺序

```
1. Planner → 输出完整 spec
2. Backend Generator + Evaluator → 先实现后端 API
3. 后端 PASS 后 → Frontend Generator + Evaluator → 基于已有 API 实现前端
4. 前端 PASS → 完成
```

后端先行，因为前端需要真实 API 端点来测试交互。

### Phase 3: 完成

1. 收集所有 Evaluator 的最终报告
2. 汇总展示给用户：
   - 各维度评分
   - 关键亮点
   - 已知局限
   - 迭代历程（几轮收敛，主要修了什么）
3. 清理团队：`TeamDelete("harness-{task-type}")`

## Evaluator → Generator 反馈格式

为确保反馈可操作，Evaluator 发给 Generator 的每条反馈必须遵循此结构：

```markdown
## 评估报告 — 第 {N} 轮

### 评分
| 维度 | 分数 | 阈值 | 状态 |
|------|------|------|------|
| ... | ... | ... | PASS/FAIL |

**总分**: X.XX / 10
**结果**: FAIL — 需要第 {N+1} 轮迭代

### 必须修复（Critical/Important）
1. **[文件:行号]** 问题描述 → 建议修复方式
2. ...

### 建议改进（Minor）
1. ...

### 本轮亮点
- ...
```

Generator 收到后：
1. 按优先级修复 Critical → Important
2. 参考 Minor 建议
3. 修复完成后再次通知 Evaluator

## Anti-Patterns

| Anti-Pattern | Why It's Bad | What To Do Instead |
|---|---|---|
| Lead 自己当 Evaluator | 自我评估偏差，失去对抗性 | 始终用独立 Evaluator teammate |
| 跳过 Planner 直接实现 | 需求模糊导致反复返工 | 让 Planner 先输出明确 spec |
| Evaluator 反馈先过 Lead | 增加延迟，Lead 可能过滤信息 | Evaluator → Generator 直接 P2P |
| 超限后继续迭代 | 说明方向有问题，更多迭代不会收敛 | 通知 Lead，由用户判断是调整 spec 还是接受现状 |
| Generator 修改 Evaluator 标准 | 破坏对抗性 | Evaluator 标准在 spawn 时固定，不可被修改 |
| 全栈场景前后端同时开工 | 前端没有真实 API，测试不可靠 | 后端先 PASS，前端再开始 |

## Notes

- AgentTeam 是实验性功能，需要设置 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- 每个 Teammate 约消耗 200k tokens 上下文，3 agent 团队 ≈ 4x 单 session 成本
- 如果 AgentTeam 不可用，可降级为 Agent subagent 模式（失去 P2P 通信，但核心流程不变）
- Teammate 提示词是**完全自包含的**——不引用其他 devkit skill，每个角色都是独立专家
