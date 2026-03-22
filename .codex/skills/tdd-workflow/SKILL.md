---
name: tdd-workflow
description: >
  Test-Driven Development workflow that enforces writing tests BEFORE implementation. Use
  when: (1) starting any feature implementation, (2) user says /tdd or "use TDD", (3)
  implementing a planned task from a spec or plan document, (4) any coding task where
  quality matters. This SOP ensures tests are written first, reviewed for quality via
  test-review, and only then does implementation begin. Even simple features benefit from
  this discipline. Triggers on: "implement", "build", "develop", "code this", "start
  coding", "write the feature", or any context where code is about to be written.
---

# TDD Workflow

A strict Test-Driven Development SOP. Tests are written first, reviewed for quality, and only after passing the quality gate does implementation begin.

## Why This Matters

Writing tests after implementation is fundamentally backwards — you end up testing what you built rather than building what you specified. This workflow flips that: tests ARE the specification. If you can't write a test for it, you don't understand the requirement well enough to implement it.

The quality gate (test-review) prevents the common trap of writing thin, happy-path-only tests that give false confidence.

## The Flow

```
┌─────────────────────────────────────┐
│ 1. Analyze — understand the feature │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 2. Design Tests — write test cases  │
│    Think about WHAT, not HOW        │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 3. Quality Gate — /test-review      │
│    All dimensions ≥ 7.5             │
│    Final score ≥ 8.0                │
└──────────┬──────────┬───────────────┘
           │          │
        PASS ✅    FAIL ❌
           │          │
           │          ▼
           │    ┌─────────────────────┐
           │    │ Fix gaps from the   │
           │    │ missing scenarios   │
           │    │ list, re-review     │
           │    └─────────┬───────────┘
           │              │
           │◄─────────────┘
           ▼
┌─────────────────────────────────────┐
│ 4. Implement — write minimal code   │
│    to make tests pass               │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 5. Verify — run tests, all green    │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│ 6. Code Review — /code-review       │
│    All dimensions ≥ 7.0             │
│    Final score ≥ 7.5                │
│    No Critical issues               │
└──────────┬──────────┬───────────────┘
           │          │
        PASS ✅    FAIL ❌
           │          │
           │          ▼
           │    ┌─────────────────────┐
           │    │ Fix issues from the │
           │    │ review report,      │
           │    │ re-review           │
           │    └─────────┬───────────┘
           │              │
           │◄─────────────┘
           ▼
┌─────────────────────────────────────┐
│ 7. Refactor — clean up, keep green  │
└──────────────┬──────────────────────┘
               ▼
             Done ✅
```

## Step-by-Step

### Step 1: Analyze

Before writing anything, understand what you're building:

1. Read the spec/plan/requirements
2. Identify the module's public interface — what functions/methods/endpoints will exist?
3. List the behaviors: "when X happens, Y should result"
4. Identify data types, state transitions, error conditions
5. Note integration points with other modules

Output: a mental (or written) list of behaviors to test. Not code yet — just scenarios.

### Step 2: Design and Write Tests

Now write the test code. The key mindset shift: **you are specifying behavior, not testing an implementation.**

Guidelines:

- **Name tests after scenarios**, not functions: `test_revoked_key_fails_auth` not `test_verify_key`
- **Each test = one scenario**: don't cram multiple assertions about different behaviors
- **Think in categories**:
  - Happy path (normal usage)
  - Alternative paths (different valid inputs)
  - Boundary cases (empty, huge, special chars, type limits)
  - Error cases (invalid input, resource failures, timeouts)
  - State transitions (lifecycle, concurrent access)
  - Integration (how components interact)
- **Target 5:1 to 10:1 test-to-implementation ratio** — more tests than code is normal and good
- **Tests should compile but fail** — they reference functions/types that don't exist yet

When working with subagents/teammates:
- Assign test writing to a subagent with clear context about the feature
- The subagent should write tests ONLY, no implementation
- Provide: spec/plan docs, public interface design, related existing code

### Step 3: Quality Gate

Invoke the **test-review** skill to evaluate test quality.

```
/test-review [path-to-test-files]
```

Or if in an automated workflow, dispatch a test-review subagent:

```
Subagent prompt:
"Review the tests at [paths] using the test-review skill.
Feature description: [brief].
Related spec: [path].
Output the full scoring report."
```

**Gate criteria:**
- Every dimension ≥ 7.5
- Final score ≥ 8.0

**If FAIL:**
1. Read the "Missing Scenarios" section of the report
2. Add the missing tests
3. Re-run `/test-review`
4. Repeat until PASS

**Do NOT skip this step.** The entire point of this SOP is the quality gate. Without it, TDD degenerates into "write a few tests and call it done."

### Step 4: Implement

Only after tests PASS the quality gate:

1. Write the **minimal code** to make the first test pass
2. Run tests — confirm that test passes, others still fail (as expected)
3. Write code for the next test
4. Repeat until all tests pass

Key principles:
- **Minimal implementation** — don't write code that isn't demanded by a test
- **Don't change tests to match implementation** — if a test is wrong, that's a design issue; fix the test as a test change, not as an implementation convenience
- **Commit frequently** — each test going green is a good commit point

When working with subagents/teammates:
- Implementation subagent gets: test files + spec + existing codebase context
- Instruction: "Make these tests pass. Do not modify the tests."

### Step 5: Verify

Run the full test suite:

```bash
cargo test --workspace   # Rust
pytest                    # Python
npm test                  # TypeScript
```

All tests must pass. If any test fails:
- Debug and fix the implementation (not the test)
- If you discover a test was genuinely wrong (testing the wrong behavior), fix the test but document why

### Step 6: Code Review

Invoke the **code-review** skill to evaluate implementation quality.

```
/code-review [git-range]
```

Or if in an automated workflow, dispatch a code-review subagent:

```
Subagent prompt:
"Review the code changes from [base_sha] to [head_sha] using the code-review skill.
Feature description: [brief].
Related plan: [path].
Output the full scoring report."
```

**Gate criteria:**
- Every dimension ≥ 7.0
- Final score ≥ 7.5
- No unresolved Critical issues

**If FAIL:**
1. Read the Issues section of the report
2. Fix Critical and Important issues
3. Re-run `/code-review`
4. Repeat until PASS

**Do NOT skip this step.** Test review ensures tests are good; code review ensures implementation is good. Both gates must pass.

### Step 7: Refactor

With all tests green and code review passed, clean up:

- Remove duplication in implementation
- Improve naming
- Simplify logic
- **Run tests after every change** — refactoring must not break tests

This step is optional but recommended. The tests give you confidence to refactor safely.

## Working with Agent Teams

When using AgentTeam for parallel development:

```
Test Writer Agent (per module):
  1. Read spec for assigned module
  2. Write comprehensive tests
  3. Run /test-review
  4. Iterate until PASS
  5. Report: "Tests ready, score X.XX"

Implementation Agent (per module, AFTER test writer passes):
  1. Receive test files
  2. Implement to make tests pass
  3. Run tests, verify all green
  4. Report: "Implementation complete, N/N tests passing"
```

Test writers and implementors should be **different agents** — the implementor should not have written the tests, ensuring tests truly specify behavior rather than describe implementation.

## Anti-Patterns

| Anti-Pattern | Why It's Bad | What To Do Instead |
|---|---|---|
| Writing tests after implementation | Tests describe what you built, not what you need | Write tests first, always |
| Skipping test-review | "Tests look fine to me" — bias | Always run the quality gate |
| Changing tests to pass | Masks design issues | Fix implementation, or deliberately redesign the test as a separate step |
| Testing implementation details | Tests break on refactor | Test behavior and public interface |
| One giant test function | Hard to diagnose failures | One scenario per test |
| Mocking everything | Tests pass but integration fails | Prefer real components, mock only external services |
