# The Autoresearch Pattern — 自主迭代范式设计文档

> 从 Karpathy 的 autoresearch 提炼第一性原理，泛化为三个 DevKit skill。

---

## 1. 灵感来源：Karpathy Loop

[karpathy/autoresearch](https://github.com/karpathy/autoresearch) 把 AI 自主研究压缩到了最简结构：

```
program.md (人写指令) → agent 修改 train.py → 跑 5 分钟 → 度量 val_bpb → keep/discard → 循环
```

三个关键文件，三个角色分工：

| 文件 | 角色 | 谁动它 |
|------|------|--------|
| `prepare.py` | 不可变的评估基座 | 没人动 |
| `train.py` | 唯一可变的目标 | Agent 改 |
| `program.md` | 实验指令 | 人类写 |

这个模式之所以能跑，不是因为 ML 训练有什么特殊性，而是因为它做到了**第一性原理的极致**：

1. **原子化** — 只有一个文件可以改，一个数字决定成败
2. **可度量** — 每次迭代有明确的 better/worse 判定
3. **可回滚** — Git commit + reset，零成本试错
4. **无限循环** — Agent 自主决策，人类去睡觉

**核心洞察：这不是一个 ML 训练技巧，这是一个通用的工作范式。**

---

## 2. 泛化：原子化自主迭代

任何复杂目标都可以被拆解为原子目标，每个原子目标都可以用 autoresearch 模式迭代：

```
复杂目标
  ↓ 第一性原理拆解
  ↓
原子目标 A ──→ Agent A: 修改 → 执行 → 度量 → keep/discard → 循环
原子目标 B ──→ Agent B: 修改 → 执行 → 度量 → keep/discard → 循环
原子目标 C ──→ Agent C: 修改 → 执行 → 度量 → keep/discard → 循环
  ↓
依赖图决定执行顺序（并行 / 串行 / 混合）
  ↓
汇聚结果
```

### 原子目标的结构约束

每个原子目标必须满足 autoresearch 的五要素（缺一不可）：

| 要素 | 含义 | 示例（代码） | 示例（写作） |
|------|------|-------------|-------------|
| **Target** | 可修改的范围 | 一个函数/文件 | 一段文案 |
| **Eval** | 评估方法 | 跑测试/benchmark | AI 评分/人类标准 |
| **Metric** | 度量指标 | 执行时间/通过率 | 可读性分/信息密度 |
| **Budget** | 单轮预算 | 2 分钟编译+测试 | 3 轮迭代上限 |
| **Direction** | 优化方向 | lower_is_better | higher_is_better |

### 原子目标之间的关系

原子目标之间存在三种关系：

- **并行（parallel）** — 互不依赖，可同时执行
- **串行（sequential）** — A 的输出是 B 的输入
- **条件（conditional）** — A 的结果决定是否执行 B

Skill 在拆解时自动识别依赖关系，构建 DAG（有向无环图）。

---

## 3. 通用流程：Harness Engineering

无论哪个 skill，都遵循同一套 Harness 流程：

```
Phase 1: DECOMPOSE（拆解）
  Agent 分析用户目标
  → 识别原子目标
  → 定义每个原子的五要素
  → 构建依赖 DAG
  → 呈现方案给用户

Phase 2: CONFIRM（确认）
  用户审阅拆解方案
  → 调整原子粒度
  → 确认度量标准
  → 批准执行

Phase 3: EXECUTE（执行）
  按 DAG 拓扑序调度
  → 每个原子目标分配给一个 Agent
  → Agent 自主运行 autoresearch 循环
  → 串行节点等上游完成后启动
  → 并行节点同时启动

Phase 4: CONVERGE（收敛）
  汇聚所有原子的最终结果
  → 端到端验证
  → 呈现给用户
  → 记录实验日志
```

### 每个原子内部的循环

```
LOOP:
  1. 修改 Target（基于上一轮反馈）
  2. 执行 Eval
  3. 读取 Metric
  4. 判断：metric 改善了？
     → YES: keep（保留修改，更新 baseline）
     → NO:  discard（回滚修改）
  5. 记录本轮结果到实验日志
  6. 判断：达到终止条件？
     → 达到 Budget 上限 → 停止
     → 连续 N 轮无改善 → 停止
     → Metric 达标 → 停止
     → 否则 → 继续 LOOP
```

---

## 4. 三个 Skill 设计

### Skill 1: `rune-autoforge` — Rune 开发的双生子

**触发词**: `/rune-autoforge`, `用 autoforge 开发`, `迭代 Caster`

**定位**: 用 autoresearch 模式开发 Rune 项目。Rune 的架构天然是原子化的——每个 Caster 就是一个原子单元，Flow 就是 DAG。这不是"把 autoresearch 套到 Rune 上"，而是它们本来就是双生子。

**为什么 Rune 和 autoresearch 是天作之合：**

| Autoresearch 概念 | Rune 对应 |
|-------------------|-----------|
| 原子目标 | Caster handler |
| 可修改的 Target | handler 实现代码 |
| 评估 | `rune call <name>` + 断言 |
| 依赖 DAG | Flow JSON |
| 并行执行 | Flow 并行节点 |
| 结果流转 | Flow input_mapping |

**流程**:

```
用户: "做一个文档翻译 Flow"

Phase 1 — DECOMPOSE:
  Agent 分析需求，拆解为：
  ├── Caster: detect-language
  │   Target: handler 实现
  │   Eval: 测试 10 种语言的检测准确率
  │   Metric: accuracy >= 95%
  │   Budget: 5 轮迭代
  │
  ├── Caster: translate-core  (depends on: detect-language)
  │   Target: handler 实现
  │   Eval: BLEU score on test set
  │   Metric: bleu >= 0.85
  │   Budget: 8 轮迭代
  │
  └── Caster: quality-check   (depends on: translate-core)
      Target: handler 实现
      Eval: 人工标注样本的一致性
      Metric: agreement >= 90%
      Budget: 5 轮迭代

Phase 2 — CONFIRM:
  用户确认拆解方案

Phase 3 — EXECUTE:
  每个 Caster 由独立 Agent 迭代：
  → 写 handler → rune call 测试 → 度量 → keep/discard → 循环
  → detect-language 达标后，translate-core 开始
  → translate-core 达标后，quality-check 开始

Phase 4 — CONVERGE:
  所有 Caster 达标 →
  → 自动生成 Flow JSON（DAG 定义）
  → rune flow register
  → 端到端测试整个 Flow
  → 交付
```

**产物**:
- 每个 Caster 的 handler 代码（迭代到 metric 达标）
- Flow JSON（DAG 定义）
- 实验日志（每个 Caster 的迭代记录）

---

### Skill 2: `auto-iterate` — 通用原子化迭代

**触发词**: `/auto-iterate`, `用迭代模式`, `autoresearch 模式`, `原子化执行`

**定位**: 把 autoresearch 模式应用到任何工作——写代码、写文章、做研究、收集信息、做 PPT、任何事情。

**核心思想**: 用户的任何目标，都可以被拆解为可度量的原子目标，每个原子目标都值得被迭代到最好。

**适用场景示例**:

| 场景 | Target | Eval | Metric |
|------|--------|------|--------|
| 写推文 | 推文文案 | AI 评分 engagement 预测 | predicted_engagement >= 8 |
| 写论文摘要 | abstract.md | 学术写作评分 | clarity + novelty >= 9 |
| 做 PPT | 某一页 slide | 视觉+信息密度评分 | design_score >= 8.5 |
| 小红书调研 | 收集到的数据集 | 覆盖度 + 质量 | coverage >= 目标话题数 |
| 优化 API 性能 | handler 代码 | benchmark | p99_latency < 50ms |
| Prompt 工程 | system prompt | eval suite | accuracy >= 90% |
| 写博客 | 文章 draft | 可读性 + SEO 评分 | readability >= 8 |

**流程**:

```
用户: "帮我写一篇关于 AI Agent 趋势的深度推文"

Phase 1 — DECOMPOSE:
  Agent 分析，拆解为：
  ├── 原子 A: 素材收集（并行）
  │   Target: research_notes.md
  │   Eval: 覆盖核心论点数量
  │   Metric: >= 5 个独立论点
  │   Budget: 3 轮
  │
  ├── 原子 B: 核心观点提炼（依赖 A）
  │   Target: thesis.md
  │   Eval: AI 评分（独特性 + 深度）
  │   Metric: uniqueness >= 8
  │   Budget: 3 轮
  │
  ├── 原子 C: 初稿撰写（依赖 B）
  │   Target: draft.md
  │   Eval: AI 评分（engagement + 信息密度）
  │   Metric: engagement_score >= 8
  │   Budget: 5 轮
  │
  └── 原子 D: 文案打磨（依赖 C）
      Target: final.md
      Eval: 可读性 + 节奏感 + 钩子强度
      Metric: polish_score >= 9
      Budget: 3 轮

Phase 2 — CONFIRM:
  用户审阅，可能调整：
  "B 和 C 可以合并" / "加一个原子：生成配图描述"

Phase 3 — EXECUTE:
  按 DAG 拓扑序，每个原子由 AgentTeam mate 迭代

Phase 4 — CONVERGE:
  汇聚最终推文 → 用户审阅
```

**度量方式的灵活性**:

不同场景的度量方式不同，skill 支持三种：

1. **自动度量** — 有可执行的评估脚本（测试、benchmark、eval suite）
2. **AI 度量** — 用 LLM 评分（写作质量、设计质量、信息密度）
3. **规则度量** — 简单规则判断（字数、覆盖度、格式合规）

Skill 在 DECOMPOSE 阶段为每个原子选择最合适的度量方式。

**产物**:
- 每个原子目标的最终输出
- 汇聚后的完整交付物
- 实验日志（每个原子的迭代记录）

---

### Skill 3: `autoresearch-lab` — 自主实验流水线生成器

**触发词**: `/autoresearch-lab`, `生成实验环境`, `搭建 autoresearch`, `自主实验`

**定位**: 输入实验配置，输出完整的、可执行的 autoresearch 环境。这是最 meta 的 skill——它不做实验，它**生成做实验的基础设施**。

**核心思想**: Karpathy 为 ML 训练手搓了一套 autoresearch 环境（prepare.py + train.py + program.md）。这个 skill 把"搭建实验环境"本身自动化，让任何领域都能 5 分钟启动自主实验。

**输入**: 实验配置（用户描述或结构化 config）

```yaml
# 示例：Prompt 工程实验
experiment:
  name: "optimize-system-prompt"
  domain: "prompt-engineering"

target:
  file: "system_prompt.md"
  description: "The system prompt to optimize"

eval:
  command: "python eval.py"
  description: "Run eval suite against 50 test cases"

metric:
  name: "accuracy"
  direction: "higher_is_better"
  baseline: null  # 第一次运行自动建立

budget:
  per_run: "2min"
  max_iterations: 50

constraints:
  - "Prompt must be under 2000 tokens"
  - "Must maintain safety guidelines"
  - "Do not use few-shot examples"
```

**输出**: 完整的实验目录

```
experiment-optimize-system-prompt/
├── program.md          # Agent 实验指令（autoresearch 格式）
├── eval.py             # 评估脚本（如果用户没有，skill 生成脚手架）
├── system_prompt.md    # 初始 Target（如果用户没有，skill 生成初版）
├── config.yaml         # 实验配置（归档）
├── results.tsv         # 实验结果记录（header only）
└── README.md           # 实验说明
```

**生成的 program.md 遵循 autoresearch 范式**:

```markdown
# Experiment: optimize-system-prompt

## Setup
1. Read this file and all experiment files
2. Create branch: experiment/<tag>
3. Run baseline: python eval.py → record to results.tsv
4. Confirm and go

## Experimentation
- You modify: system_prompt.md (ONLY this file)
- You run: python eval.py
- Metric: accuracy (higher is better)
- Budget: 2 min per run, 50 iterations max
- Constraints: [listed]

## The Loop
LOOP FOREVER:
1. Modify system_prompt.md with an idea
2. git commit
3. Run: python eval.py > run.log 2>&1
4. Read metric: grep "accuracy:" run.log
5. If improved → keep. If not → git reset
6. Log to results.tsv
7. NEVER STOP until interrupted
```

**进阶能力**:

1. **多文件实验** — Target 可以是多个文件，带各自的约束
2. **组合实验** — 生成多个并行实验环境，探索不同方向
3. **与 Rune 集成** — 为代码实验自动生成 Rune Caster + eval harness
4. **实验分析** — 读取 results.tsv，生成实验报告（调用 `/research-report`）

**产物**:
- 完整的实验目录，可直接启动
- 生成的 program.md 兼容任何 AI coding agent（Claude Code、Codex、Cursor 等）

---

## 5. 三者关系

```
                    autoresearch-lab (Skill 3)
                    "生成实验基础设施"
                    输入配置 → 输出可执行环境
                         ↑
                         | 可以为 Skill 1/2 生成执行环境
                         |
    rune-autoforge ←─── 共享核心 ───→ auto-iterate
    (Skill 1)           抽象层           (Skill 2)
    Rune 开发专用     原子化拆解        通用任务
    底层: Rune Flow   迭代循环          底层: AgentTeam
    产物: Casters     keep/discard      产物: 任意交付物
         + Flow       度量驱动
```

**共享的核心抽象**:

三个 skill 共享同一套核心逻辑，只是应用层不同：

| 层次 | 内容 |
|------|------|
| **核心抽象** | 原子目标结构（五要素）、迭代循环、keep/discard 策略、DAG 构建 |
| **Harness 流程** | DECOMPOSE → CONFIRM → EXECUTE → CONVERGE |
| **应用层** | Skill 1: Rune Caster / Skill 2: 通用 Agent / Skill 3: 环境生成 |

---

## 6. 设计原则

### 第一性原理驱动

每个原子目标必须回答：
- **什么可以改？**（Target）
- **怎么判断好坏？**（Eval + Metric）
- **什么时候停？**（Budget + Direction）

如果回答不了这三个问题，说明拆解粒度还不够。

### 度量至上

没有度量的迭代是盲目的。skill 在 DECOMPOSE 阶段必须为每个原子定义清晰的度量方式，即使是"AI 评分"这种软度量。

### 可回滚

每次迭代必须是可回滚的。代码场景用 git；非代码场景保留每轮版本。失败的代价必须接近零。

### 永不停止（EXECUTE 阶段）

一旦用户确认方案并启动执行，Agent 应该自主运行到终止条件，不主动询问。用户可以随时中断。

### 先推断后确认

Agent 负责推断拆解方案（包括原子目标、度量标准、依赖关系），用户负责确认。降低用户的认知负担，但保留用户的决策权。

---

## 7. 实现优先级

| 优先级 | Skill | 理由 |
|--------|-------|------|
| P0 | `auto-iterate` (Skill 2) | 最通用，核心抽象设计好了其他两个可以复用 |
| P1 | `rune-autoforge` (Skill 1) | Rune 开发的刚需，且是 auto-iterate 的最佳实践特化 |
| P1 | `autoresearch-lab` (Skill 3) | 最 meta，生成实验基础设施的能力可以赋能前两个 |

---

## 8. 开放问题

1. **度量标准的自动推断** — Agent 能否在不需要用户手动定义 eval 的情况下，自动推断合适的度量方式？对于代码场景（有测试），答案是 yes。对于写作场景（无客观标准），需要 AI 评分的校准策略。

2. **迭代深度 vs 广度** — 一个原子目标应该深度迭代（20 轮同一个方向）还是广度探索（5 个方向各 4 轮）？可能需要 exploration/exploitation 策略。

3. **跨原子的信息共享** — 并行执行的原子目标之间，一个的发现是否应该影响另一个的策略？autoresearch 原版没有这个问题（只有一个目标），但泛化后需要考虑。

4. **人类介入点** — 除了 CONFIRM 阶段，EXECUTE 过程中是否需要检查点让用户审阅中间结果？对于高风险场景可能需要。

5. **与现有 DevKit skill 的整合** — `auto-iterate` 在代码场景下，每个原子的迭代循环内部是否应该调用 `/tdd-workflow`？`rune-autoforge` 的 Evaluator 是否应该调用 `/code-review`？

---

*文档版本: v0.1 | 日期: 2026-03-31 | 作者: Chasey + Claude*
