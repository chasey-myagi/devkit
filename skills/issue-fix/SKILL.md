---
name: issue-fix
description: >
  TDD-driven issue/bug fix workflow. Enforces writing a regression test BEFORE fixing the bug,
  then reviewing both. Use when: (1) fixing bugs found in code review, (2) user says /issue-fix,
  (3) fixing reported issues/bugs, (4) addressing code review findings. Ensures every fix has
  a test proving the bug existed and is now resolved. Triggers on: "fix this bug", "fix the issue",
  "address review findings", "fix code review issues", or any bug/issue fix context.
---

# Issue Fix

TDD 驱动的 bug/issue 修复流程。核心原则：**没有回归测试的修复不算修复。**

## Why This Matters

不写测试就修 bug = 未来同样的 bug 会再次出现。回归测试是修复的证明——它先证明 bug 存在，再证明 bug 被消灭。

## Participants

| 角色 | Skill/Agent | 职责 |
|------|-------------|------|
| **Session Leader** | 你自己 | 协调流程 |
| **Regression Test Writer** | `issue-fix` 内部 Agent | 为每个 issue 写回归测试 |
| **Test Reviewer** | `test-review` | 审核回归测试质量 |
| **Code Reviewer** | `code-review` | 审核修复代码质量 |

## The Flow

```
┌──────────────────────────────────────────┐
│ 1. Triage — 分析 issues，确定优先级     │
│    Critical > Important > Minor          │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 2. Reproduce — 为每个 issue 写回归测试   │
│    测试必须 FAIL（证明 bug 存在）        │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 3. Fix — 写最小修复代码                  │
│    回归测试变 PASS                        │
│    已有测试不能 BREAK                     │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 4. Verify — 全量测试通过                 │
│    回归测试 PASS + 已有测试 PASS          │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│ 5. Review — code-review 审修复代码       │
│    确认修复正确、无副作用                 │
└──────────────┬───────────────────────────┘
               ▼
             Done ✅
```

## Step-by-Step

### Step 1: Triage

整理所有待修复的 issues，按严重级别排序：

```markdown
## Issue 清单

| # | 级别 | 描述 | 文件位置 |
|---|------|------|---------|
| 1 | Important | FileBroker 内存泄露 | gate.rs:94 |
| 2 | Important | multipart 跳过 schema 校验 | gate.rs:431 |
| 3 | Minor | 未使用的 multer 依赖 | Cargo.toml |
```

Critical 先修，Important 次之，Minor 最后。

### Step 2: Reproduce — 写回归测试

**对每个 issue，先写一个测试来证明 bug 存在。**

回归测试的命名规范：`test_fix_{issue_description}`

```rust
// 例：验证 FileBroker 在 complete_request 后确实释放了内存
#[test]
fn test_fix_file_broker_cleans_up_files_on_complete() {
    let broker = FileBroker::new();
    let file_id = broker.store("test.txt".into(), "text/plain".into(), data, "req-1");
    broker.complete_request("req-1");
    assert!(broker.get(&file_id).is_none(), "file should be removed after complete");
    // 也验证内部状态确实被清理
}
```

**关键要求：**
- 回归测试在修复前必须 **FAIL**（证明 bug 存在）
- 测试名以 `test_fix_` 开头，描述被修复的行为
- 测试应该是精准的——只测 bug 本身，不夹带其他场景

运行测试确认 FAIL：
```bash
cargo test test_fix_ -- --no-capture
```

### Step 3: Fix — 最小修复

写**最小的代码改动**来让回归测试通过。

原则：
- **不要顺手重构**：修 bug 就修 bug，不要"顺便"改别的
- **不要改测试**：如果回归测试需要改才能通过，说明测试写错了，回到 Step 2
- **最小改动**：能改一行就不改三行

### Step 4: Verify

```bash
cargo test --workspace  # 全量测试
```

必须满足：
- 新的回归测试 PASS
- 所有已有测试 PASS
- 如果有测试 FAIL → 修复引入了回归，需要调整

### Step 5: Review

对修复代码跑 `/code-review`。重点关注：
- 修复是否真正解决了根因（不是绕过症状）
- 是否引入新问题
- 是否有副作用

## 批量修复模式

当有多个 issues 需要修复时：

```
所有 issues → 逐个写回归测试（先全部 FAIL）
           → 逐个修复（每修一个跑一次全量测试）
           → 全部修完 → 统一 code-review
```

**不要**一次性改完所有 issue 再测。逐个修、逐个验证，保证每一步都稳。

## Anti-Patterns

| Anti-Pattern | What To Do Instead |
|---|---|
| 不写测试直接修 | 先写回归测试证明 bug 存在 |
| 回归测试在修复前就 PASS | 说明测试没有真正覆盖 bug |
| 顺手重构 | 修 bug 就修 bug，重构另开 PR |
| 改测试让它通过 | 回到 Step 2 重新分析 |
| 一次改完所有 issue | 逐个修，逐个验证 |
