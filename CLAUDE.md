# DevKit

开发质量保障 skill 包。包含多个开发阶段的 SOP（标准操作流程）。

## Skills

### 后端/全栈

| Skill | 类型 | 说明 |
|-------|------|------|
| `tdd-workflow` | SOP | 测试驱动开发：分析 → 写测试 → test-review → 实现 → code-review → 验证 |
| `test-review` | Tool | 测试用例质量审核，6 维度打分 + 缺失场景清单 |
| `code-review` | Tool | 实现代码质量审核，6 维度打分 + Issues 分级清单 |

### 前端

| Skill | 类型 | 说明 |
|-------|------|------|
| `frontend-workflow` | SOP | 设计先行前端开发：设计上下文 → UI/UX cases → 组件 cases → 设计冻结 → 实现 |
| `ui-cases` | Tool | 为组件/页面生成 5+ 种设计方案 HTML，用户在浏览器中对比选择 |
| `design-freeze` | Tool | 汇总所有设计选择 → 完整性/一致性审核 → 冻结设计规范 |

## 使用

```
# 后端
/tdd-workflow              # TDD 完整流程
/test-review               # 审核测试质量
/code-review               # 审核代码质量

# 前端
/frontend-workflow         # 设计先行前端开发流程
/ui-cases button           # 为按钮生成设计方案
/design-freeze             # 冻结设计规范
```

## 与其他 plugin 的关系

- **superpowers**：管"怎么做"（brainstorm → plan → implement）
- **devkit**：管"做得好不好"（测试质量 → 代码质量 → 设计质量）
- **impeccable**：管"做得好看"（前端设计品质），devkit 的 frontend-workflow 强制使用 impeccable

推荐流程：
```
superpowers:brainstorming → superpowers:writing-plans → devkit:tdd-workflow / devkit:frontend-workflow
```
