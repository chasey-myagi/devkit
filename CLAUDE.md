# DevKit

开发质量保障 skill 包。包含多个开发阶段的 SOP（标准操作流程）。

## Skills

| Skill | 类型 | 说明 |
|-------|------|------|
| `tdd-workflow` | SOP | 测试驱动开发完整流程：分析 → 写测试 → 质量门禁 → 实现 → 代码审核 → 验证 |
| `test-review` | Tool | 测试用例质量审核，6 维度打分 + 缺失场景清单 |
| `code-review` | Tool | 实现代码质量审核，6 维度打分 + Issues 分级清单 |

## 使用

```
/tdd-workflow          # 启动完整 TDD 流程
/test-review           # 单独审核测试质量
/test-review path/to/tests  # 审核指定测试文件
/code-review           # 单独审核代码质量
/code-review HEAD~3..HEAD  # 审核指定 git 范围
```

## 与 superpowers 的关系

superpowers 管"怎么做"（brainstorm → plan → implement → review），devkit 管"做得好不好"（测试质量 → 代码质量）。两者互补。

推荐流程：
```
superpowers:brainstorming → superpowers:writing-plans → devkit:tdd-workflow → superpowers:verification-before-completion
```
