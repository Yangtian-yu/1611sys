# Superpowers 快速参考卡

## 🚀 核心工作流

| 命令          | 用途                | 何时使用           |
| ------------- | ------------------- | ------------------ |
| `/brainstorm` | 需求澄清 + 设计方案 | 开发新功能前       |
| `/plan`       | 任务分解 + 时间估算 | 复杂功能开发       |
| `/worktree`   | 创建隔离开发环境    | 大改动、实验性开发 |

## 🔄 TDD 循环

```
🔴 RED    → 写失败的测试
🟢 GREEN  → 写最小代码使测试通过
🔵 REFACTOR → 在测试保护下重构
```

## 📋 完整开发流程

```bash
# 1. 需求澄清
/brainstorm

# 2. 任务规划
/plan

# 3. 隔离环境
/worktree feature/name

# 4. TDD 开发
# RED → GREEN → REFACTOR

# 5. 检查完整度
/check

# 6. 合并代码
git merge feature/name
```

## 🛠️ Git Worktree 常用命令

```bash
# 创建 worktree
git worktree add -b feature/name ../1611sys-feature

# 列出 worktrees
git worktree list

# 删除 worktree
git worktree remove ../1611sys-feature

# 清理已删除的 worktrees
git worktree prune
```

## 📊 任务分解原则

- ✅ 每个任务 2-5 分钟
- ✅ 明确验证步骤
- ✅ 遵循 TDD 流程
- ✅ 标注依赖关系

## 💡 核心原则

1. **Design Before Implementation** - 先设计后实现
2. **Test-Driven Development** - 测试驱动开发
3. **Isolated Development** - 隔离开发
4. **Small Tasks** - 小任务原则
5. **Evidence Over Claims** - 证据驱动

## 🚫 常见陷阱

- ❌ 跳过设计直接编码
- ❌ 在主分支直接大改
- ❌ 先写代码再补测试
- ❌ 任务粒度太大

## 📚 文档位置

- **技能**: `.agent/superpowers/`
- **工作流**: `.agent/workflows/`
- **设计文档**: `docs/designs/`
- **任务计划**: `docs/plans/`

## 🎯 何时使用什么?

### 新功能开发

```
/brainstorm → /plan → /worktree → /dev
```

### Bug 修复

```
/worktree → TDD (RED-GREEN-REFACTOR)
```

### 大规模重构

```
/brainstorm → /plan → /worktree → 分批合并
```

### 小改动

```
直接 /dev (无需 worktree)
```

## 📞 获取帮助

```bash
# 查看所有工作流
/help

# 查看技能文档
cat .agent/superpowers/README.md

# 查看具体技能
cat .agent/superpowers/git-worktrees.md
cat .agent/superpowers/tdd-workflow.md
cat .agent/superpowers/task-planning.md
```

---

**记住**: Superpowers 让 AI 从"工具"变成"协作伙伴"! 🚀
