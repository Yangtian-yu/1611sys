---
description: 创建 Git worktree 隔离开发环境
---

# Worktree - 创建隔离开发环境工作流

## 🎯 目标

为新功能开发创建独立的 Git worktree,确保主分支安全,支持并行开发。

## 📋 工作流步骤

### 1. 确认当前状态

// turbo

```bash
# 检查 Git 状态
git status

# 确认当前分支
git branch

# 查看现有 worktrees
git worktree list
```

### 2. 创建新分支和 Worktree

```bash
# 格式: git worktree add -b <branch-name> <path>
# 示例: 为"邮件通知"功能创建 worktree

git worktree add -b feature/email-notification ../1611sys-email-notification
```

**分支命名规范**:

- `feature/` - 新功能
- `fix/` - Bug 修复
- `refactor/` - 重构
- `docs/` - 文档更新

### 3. 进入 Worktree 目录

```bash
cd ../1611sys-email-notification
```

### 4. 安装依赖

// turbo

```bash
# 后端依赖
cd backend
pnpm install

# 前端依赖
cd ../frontend
pnpm install
```

### 5. 配置环境变量

```bash
# 复制环境变量文件
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 根据需要修改配置
```

### 6. 运行测试验证基线

// turbo

```bash
# 后端测试
cd backend
pnpm test

# 前端测试
cd ../frontend
pnpm test
```

**验证清单**:

- [ ] 所有测试通过 ✅
- [ ] 编译无错误
- [ ] 开发服务器可以启动

### 7. 开始开发

现在可以在隔离环境中安全开发:

```bash
# 启动后端
cd backend
pnpm start:dev

# 启动前端(新终端)
cd frontend
pnpm dev
```

### 8. 开发完成后的操作

#### 选项 A: 合并到主分支

```bash
# 1. 提交所有更改
git add .
git commit -m "feat: 实现邮件通知功能"

# 2. 返回主项目
cd ../1611sys

# 3. 合并分支
git merge feature/email-notification

# 4. 运行测试确认
cd backend && pnpm test
cd ../frontend && pnpm test

# 5. 删除 worktree
git worktree remove ../1611sys-email-notification

# 6. 删除分支(可选)
git branch -d feature/email-notification
```

#### 选项 B: 创建 Pull Request

```bash
# 1. 提交并推送
git add .
git commit -m "feat: 实现邮件通知功能"
git push origin feature/email-notification

# 2. 在 GitHub/GitLab 创建 PR

# 3. PR 合并后删除 worktree
cd ../1611sys
git worktree remove ../1611sys-email-notification
```

#### 选项 C: 放弃更改

```bash
# 如果开发不满意,直接删除 worktree
cd ../1611sys
git worktree remove ../1611sys-email-notification --force
git branch -D feature/email-notification
```

## 🛡️ 安全检查清单

### 创建 Worktree 前

- [ ] 主分支代码已提交
- [ ] 主分支测试通过
- [ ] 有足够的磁盘空间(约 500MB)
- [ ] 分支名称符合规范

### 开发过程中

- [ ] 定期提交代码
- [ ] 保持测试通过
- [ ] 不要在 worktree 中切换分支

### 合并前

- [ ] 所有测试通过
- [ ] 代码已审查
- [ ] 无冲突
- [ ] 功能符合需求

### 删除 Worktree 前

- [ ] 代码已合并或确认不需要
- [ ] 没有未提交的更改
- [ ] 已通知团队成员

## 💡 最佳实践

### 1. 命名规范

```bash
# 好的命名
git worktree add -b feature/user-management ../1611sys-user-mgmt
git worktree add -b fix/login-bug ../1611sys-fix-login

# 避免的命名
git worktree add -b test ../1611sys-test  # 太模糊
git worktree add -b abc ../1611sys-abc    # 无意义
```

### 2. 目录组织

```
parent-directory/
├── 1611sys/              # 主项目
├── 1611sys-email/        # 邮件功能 worktree
├── 1611sys-user-mgmt/    # 用户管理 worktree
└── 1611sys-refactor/     # 重构 worktree
```

### 3. 并行开发

```bash
# 可以同时在多个 worktrees 中开发
Terminal 1: cd 1611sys-email && pnpm start:dev
Terminal 2: cd 1611sys-user-mgmt && pnpm start:dev
Terminal 3: cd 1611sys (主分支继续工作)
```

### 4. 定期清理

```bash
# 列出所有 worktrees
git worktree list

# 删除不用的 worktrees
git worktree remove ../1611sys-old-feature

# 清理已删除的 worktrees
git worktree prune
```

## 🚫 常见错误

### 错误 1: 在 Worktree 中切换分支

```bash
# ❌ 不要这样做
cd ../1611sys-email
git checkout main  # 错误!

# ✅ 应该这样
# 每个 worktree 对应一个分支,不要切换
```

### 错误 2: 忘记安装依赖

```bash
# ❌ 直接运行
pnpm start:dev  # 可能失败

# ✅ 先安装依赖
pnpm install
pnpm start:dev
```

### 错误 3: 数据库冲突

```bash
# ❌ 多个 worktrees 使用同一个数据库
# 可能导致数据混乱

# ✅ 使用不同的数据库
# worktree 1: DATABASE_URL="postgresql://localhost:5432/duty_dev1"
# worktree 2: DATABASE_URL="postgresql://localhost:5432/duty_dev2"
```

## 📊 Worktree 状态管理

### 查看 Worktree 信息

```bash
# 列出所有 worktrees
git worktree list

# 详细信息
git worktree list --porcelain

# 示例输出:
# worktree /f/1611sys
# HEAD abc123...
# branch refs/heads/main
#
# worktree /f/1611sys-email
# HEAD def456...
# branch refs/heads/feature/email-notification
```

### 修复损坏的 Worktree

```bash
# 如果 worktree 目录被手动删除
git worktree prune

# 如果 worktree 状态异常
git worktree repair
```

## 🔗 与其他工作流集成

### 与 /brainstorm 集成

```bash
# 1. 先进行设计澄清
/brainstorm

# 2. 设计批准后创建 worktree
/worktree feature/new-feature

# 3. 在 worktree 中开发
```

### 与 /dev 集成

```bash
# 在 worktree 中使用 /dev 工作流
cd ../1611sys-email
/dev
```

### 与 /check 集成

```bash
# 在 worktree 中检查代码完整度
cd ../1611sys-email
/check
```

## 📚 参考资源

- [Git Worktree 官方文档](https://git-scm.com/docs/git-worktree)
- [Superpowers Git Worktrees 技能](../.agent/superpowers/git-worktrees.md)

## ⚠️ 重要提醒

1. **不要删除主项目**: 永远不要删除 `1611sys/` 主目录
2. **定期同步**: 定期从 main 分支拉取更新
3. **及时清理**: 功能完成后及时删除 worktree
4. **备份重要数据**: 删除前确认数据已保存
