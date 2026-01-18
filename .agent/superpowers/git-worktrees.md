---
name: Git Worktrees 管理
description: 使用 Git worktrees 创建隔离的开发环境,支持并行开发和零风险实验
category: superpowers
---

# Git Worktrees 管理技能

## 🎯 技能目标

使用 Git worktrees 为 AI 开发任务创建隔离的工作环境,确保主分支安全,支持并行开发。

## 📋 使用场景

- 开发新功能时需要隔离环境
- 进行大规模重构
- 并行开发多个功能
- AI 辅助开发时的风险控制

## 🔄 工作流程

### 阶段 1: 创建 Worktree

```bash
# 1. 确认当前分支状态
git status

# 2. 创建新分支并创建 worktree
git worktree add -b feature/new-feature ../1611sys-worktree-feature

# 3. 进入 worktree 目录
cd ../1611sys-worktree-feature
```

### 阶段 2: 在 Worktree 中开发

```bash
# 1. 安装依赖(如果需要)
cd backend && pnpm install
cd ../frontend && pnpm install

# 2. 运行测试验证基线
cd backend && pnpm test
cd ../frontend && pnpm test

# 3. 开始开发...
```

### 阶段 3: 完成开发

```bash
# 1. 提交更改
git add .
git commit -m "feat: 实现新功能"

# 2. 返回主项目
cd ../1611sys

# 3. 合并分支(如果满意)
git merge feature/new-feature

# 4. 删除 worktree
git worktree remove ../1611sys-worktree-feature
git branch -d feature/new-feature
```

## 🛡️ 安全检查清单

在创建 worktree 前:

- [ ] 确认主分支代码已提交
- [ ] 确认测试通过
- [ ] 确认有足够的磁盘空间

在删除 worktree 前:

- [ ] 确认代码已合并或不再需要
- [ ] 确认没有未提交的更改

## 💡 最佳实践

1. **命名规范**: 使用 `feature/`, `fix/`, `refactor/` 前缀
2. **定期清理**: 删除不再使用的 worktrees
3. **测试先行**: 在 worktree 中先运行测试
4. **小步提交**: 频繁提交,便于回滚

## 🔧 常用命令

```bash
# 列出所有 worktrees
git worktree list

# 查看 worktree 详情
git worktree list --porcelain

# 移除 worktree
git worktree remove <path>

# 修剪已删除的 worktrees
git worktree prune
```

## 📊 与现有工作流集成

可以与以下工作流配合使用:

- `/dev` - 在 worktree 中开始开发
- `/check` - 在 worktree 中检查代码完整度
- `/run` - 在 worktree 中运行项目

## ⚠️ 注意事项

1. **不要在 worktree 中切换分支**: 每个 worktree 对应一个分支
2. **共享 .git 目录**: 所有 worktrees 共享同一个 .git,注意冲突
3. **环境变量**: 确保 .env 文件在 worktree 中正确配置
4. **数据库**: 考虑使用不同的数据库实例避免冲突
