---
name: test-review
description: >
  Review test cases for quality, coverage, and rigor. Use when: (1) tests have been written
  and need quality validation, (2) user says /test-review, (3) in TDD workflows before implementation,
  (4) after a teammate/subagent writes tests and you need to verify quality. Acts as a quality gate —
  implementation should NOT proceed until this review passes. Triggers on: "review tests", "check test quality",
  "are these tests good enough", "test coverage", or any context where test adequacy is in question.
---

# Test Case Review

Review test suites for quality, coverage, and rigor. Acts as a quality gate — implementation should not begin until tests pass this review.

## Process

### Step 1: Discover Test Files

If no path is specified, automatically discover:

1. Check `git diff --name-only` for recently added/modified test files
2. Scan: `tests/`, `**/tests/`, `**/*_test.*`, `**/*_spec.*`, `**/test_*.*`
3. Show the user which files will be reviewed

If a path is given (e.g., `/test-review tests/store_test.rs`), use it directly.

### Step 2: Gather Context

Understand what the tests are supposed to cover:

1. Read test files thoroughly — every test function, every assertion
2. Look for related spec/design docs (check `docs/`, README, nearby markdown)
3. Read the source code being tested (if it exists)
4. If no implementation yet (pure TDD), infer feature scope from test names and assertions
5. Identify language, framework, and testing conventions

### Step 3: Score Across 6 Dimensions

Each dimension scored 1.0–10.0 (one decimal place).

---

#### Dimension 1: Quantity Adequacy — 15%

Does the test count match feature complexity?

- **1–3**: 1–2 tests for a complex feature
- **4–6**: Happy paths covered, many gaps
- **7–8**: Most scenarios covered, minor gaps
- **9–10**: Test count reflects full complexity. Ratio guideline: simple utility 3–5 tests, CRUD with validation 15–30, state machine or protocol 30–50+

**Don't reward padding** — 20 trivial tests checking the same thing score lower than 8 thoughtful tests covering different scenarios.

---

#### Dimension 2: Scenario Coverage — 20%

Are all logical scenarios represented?

- **1–3**: Only happy path
- **4–6**: Happy path + some error cases
- **7–8**: Happy + errors + edge cases + lifecycle flows
- **9–10**: Complete scenario matrix — every meaningful input/output/state combination

Checklist: happy path, alternative valid paths, error paths, lifecycle (create→use→update→delete), integration between components, empty/null/zero cases.

---

#### Dimension 3: Boundary Exploration — 20%

Are edge cases and boundaries thoroughly probed?

- **1–3**: No boundary testing
- **4–6**: Some obvious ones (empty string, zero)
- **7–8**: Good coverage including type limits, special characters
- **9–10**: Exhaustive — off-by-one, overflow, unicode, injection patterns, format edge cases

Checklist: empty/null, very large inputs, special characters (unicode, emoji, SQL-like, path traversal), type boundaries (MAX/MIN), format edge cases (trailing slashes, extra whitespace, missing fields), timing boundaries (zero timeout, very long timeout).

---

#### Dimension 4: Error Path Coverage — 15%

Are failure modes properly tested?

- **1–3**: No error testing
- **4–6**: Invalid input returns error
- **7–8**: Error types, messages, and recovery tested
- **9–10**: Error propagation, cascading failures, partial failures, cleanup after errors, idempotency under failure

Checklist: invalid input → correct error type, resource failures (file not found, DB locked), timeouts, partial failure (item 3 of 5 fails), error propagation chain, cleanup/rollback after error.

---

#### Dimension 5: State Combination — 15%

Are stateful interactions and transitions tested?

- **1–3**: Only isolated operations
- **4–6**: Some sequential operations
- **7–8**: State machine transitions, before/after relationships
- **9–10**: Full state matrix, invalid transitions rejected, concurrent state changes, interleaved operations

Checklist: every valid state transition, invalid transitions rejected, interleaved operations (A starts, B starts, A finishes), concurrent modifications, ordering dependencies, accumulated state over repeated operations.

---

#### Dimension 6: Test Quality — 15%

Are the tests themselves well-written?

- **1–3**: Unclear names, weak assertions, coupled tests
- **4–6**: Reasonable names, basic assertions
- **7–8**: Descriptive names, precise assertions, independent tests
- **9–10**: Self-documenting, single-responsibility, assertions verify behavior not implementation

Checklist: names describe scenario (not method), each test verifies ONE behavior, specific assertions (not just "is not null"), tests are independent and order-independent, no redundant tests, no testing of implementation details.

---

### Step 4: E2E Assessment (Bonus)

For multi-module features or user-facing workflows:

- **+0.5**: Excellent E2E tests covering full request paths with real components
- **0**: No E2E tests and none needed (single-module feature)
- **−0.5**: E2E tests clearly needed but missing (multi-module feature with no integration tests)

---

### Step 5: Output Report

Use this exact format:

```
## 🧪 Test Review Report

**Target**: [file paths]
**Feature**: [inferred feature description]
**Test Count**: [N tests across M files]
**Language**: [e.g., Rust/cargo test]

### Scores

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Quantity Adequacy | X.X | 15% | X.XX |
| Scenario Coverage | X.X | 20% | X.XX |
| Boundary Exploration | X.X | 20% | X.XX |
| Error Path Coverage | X.X | 15% | X.XX |
| State Combination | X.X | 15% | X.XX |
| Test Quality | X.X | 15% | X.XX |
| **Weighted Total** | | | **X.XX** |
| E2E Bonus | ±X.X | | |
| **Final Score** | | | **X.XX** |

### Result: PASS ✅ / FAIL ❌

Pass criteria: every dimension ≥ 7.5 AND final score ≥ 8.0

[If FAIL: which dimensions fell short and by how much]

### Missing Scenarios (must fix before implementation)

1. [Specific missing test with concrete example of what to test]
2. [Another missing scenario]
...

### Suggestions (nice-to-have, not blocking)

1. [Optional improvement]
...
```

---

### Step 6: Gate Decision

- **PASS**: All dimensions ≥ 7.5 AND final ≥ 8.0 → "Tests pass quality gate. Proceed to implementation."
- **FAIL**: Any dimension < 7.5 OR final < 8.0 → "Tests need improvement. Address the missing scenarios above, then run /test-review again."

On FAIL, do NOT proceed to implementation. The missing scenarios list gives clear direction.

## As Subagent

When dispatched as a subagent (e.g., from tdd-workflow), the reviewer should work with ONLY the test files and related docs — no implementation planning context. This keeps the review unbiased.
