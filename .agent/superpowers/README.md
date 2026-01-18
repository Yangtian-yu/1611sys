# Superpowers AI 编码工作流集成指南

## 🎉 欢迎使用 Superpowers!

本项目已成功集成 **Superpowers AI 编码工作流系统**,将 AI 从代码补全工具升级为超级协作伙伴。

## 📦 已集成的功能

### ✅ 核心技能 (Skills)

位于 `.agent/superpowers/` 目录:

1. **Git Worktrees 管理** (`git-worktrees.md`)
   - 创建隔离开发环境
   - 支持并行开发
   - 零风险实验

2. **TDD 测试驱动开发** (`tdd-workflow.md`)
   - 强制 RED-GREEN-REFACTOR 循环
   - 确保代码质量
   - 提高测试覆盖率

3. **任务规划与分解** (`task-planning.md`)
   - 将复杂任务分解为 2-5 分钟小任务
   - 详细实现步骤
   - 明确验证标准

### ✅ 工作流 (Workflows)

位于 `.agent/workflows/` 目录:

1. **`/brainstorm`** - 交互式设计澄清
   - AI 主动提问理解需求
   - 提出设计方案
   - 保存设计文档

2. **`/plan`** - 创建详细任务计划
   - 功能分解
   - 时间估算
   - 风险识别

3. **`/worktree`** - 创建隔离开发环境
   - 自动创建 Git worktree
   - 安装依赖
   - 验证测试基线

## 🚀 快速开始

### 场景 1: 开发新功能

```bash
# 1. 需求澄清
/brainstorm
# AI 会主动提问,理解你的需求并提出设计方案

# 2. 创建任务计划
/plan
# AI 会将功能分解为详细的小任务

# 3. 创建隔离开发环境
/worktree feature/new-feature
# 在独立环境中开发,不影响主分支

# 4. 开始开发
/dev
# 按照计划执行开发任务

# 5. 检查完整度
/check
# 对照需求检查实现
```

### 场景 2: 修复 Bug

```bash
# 1. 在隔离环境中修复
/worktree fix/bug-name

# 2. 使用 TDD 方法
# - 先写复现 Bug 的测试 (RED)
# - 修复代码使测试通过 (GREEN)
# - 重构优化 (REFACTOR)

# 3. 验证修复
pnpm test

# 4. 合并到主分支
git merge fix/bug-name
```

### 场景 3: 大规模重构

```bash
# 1. 设计重构方案
/brainstorm

# 2. 创建详细计划
/plan

# 3. 在隔离环境中重构
/worktree refactor/module-name

# 4. 确保测试覆盖
# 重构前后测试都应该通过

# 5. 分批合并
# 将大重构分解为多个小 PR
```

## 🔄 完整开发工作流

```
用户需求
    ↓
/brainstorm (需求澄清 + 设计方案)
    ↓
设计批准
    ↓
/plan (任务分解 + 时间估算)
    ↓
/worktree (创建隔离环境)
    ↓
TDD 开发 (RED → GREEN → REFACTOR)
    ↓
/check (检查完整度)
    ↓
代码审查
    ↓
合并到主分支
    ↓
部署
```

## 💡 核心原则

### 1. Design Before Implementation

**先设计后实现**

- 使用 `/brainstorm` 澄清需求
- 提前识别风险和挑战
- 避免返工

### 2. Test-Driven Development

**测试驱动开发**

- RED: 先写失败的测试
- GREEN: 写最小代码使测试通过
- REFACTOR: 在测试保护下重构

### 3. Isolated Development

**隔离开发**

- 使用 Git worktrees 创建独立环境
- 并行开发多个功能
- 零风险实验

### 4. Small Tasks

**小任务原则**

- 每个任务 2-5 分钟
- 频繁验证
- 快速反馈

### 5. Evidence Over Claims

**证据驱动**

- 测试通过才算完成
- 可验证的交付物
- 不接受未经验证的声明

## 📊 与现有工作流的关系

### 现有工作流

- `/prd` - 生成产品规格文档
- `/ui` - 生成 UI 原型
- `/dev` - 开始开发
- `/run` - 运行项目
- `/check` - 检查代码完整度
- `/status` - 查看项目状态

### Superpowers 工作流

- `/brainstorm` - **补充** `/prd`,更深入的需求澄清
- `/plan` - **细化** `/dev`,详细任务分解
- `/worktree` - **增强** `/dev`,隔离开发环境

### 推荐组合使用

#### 方式 1: 完整流程

```bash
/prd          # 生成产品规格
/brainstorm   # 深入澄清需求
/ui           # 生成 UI 原型
/plan         # 详细任务规划
/worktree     # 创建隔离环境
/dev          # 开始开发
/check        # 检查完整度
```

#### 方式 2: 快速迭代

```bash
/brainstorm   # 需求澄清
/worktree     # 隔离环境
/dev          # 直接开发
```

#### 方式 3: 小改动

```bash
/dev          # 直接在主分支开发
```

## 🛠️ 技能使用指南

### 使用 Git Worktrees

```bash
# 查看技能文档
cat .agent/superpowers/git-worktrees.md

# 创建 worktree
git worktree add -b feature/name ../1611sys-feature

# 列出所有 worktrees
git worktree list

# 删除 worktree
git worktree remove ../1611sys-feature
```

### 使用 TDD 工作流

```bash
# 查看技能文档
cat .agent/superpowers/tdd-workflow.md

# 开发流程
# 1. 编写测试 (应该失败)
pnpm test  # ❌ RED

# 2. 实现功能
# 编写代码...

# 3. 运行测试 (应该通过)
pnpm test  # ✅ GREEN

# 4. 重构优化
# 改进代码...

# 5. 再次测试 (应该仍然通过)
pnpm test  # ✅ 仍然 GREEN
```

### 使用任务规划

```bash
# 查看技能文档
cat .agent/superpowers/task-planning.md

# 创建计划文档
# 在 docs/plans/ 目录下创建
# 参考模板进行任务分解
```

## 📚 文档结构

```
.agent/
├── superpowers/              # Superpowers 技能库
│   ├── git-worktrees.md     # Git Worktrees 管理
│   ├── tdd-workflow.md      # TDD 工作流
│   └── task-planning.md     # 任务规划
│
├── workflows/                # 工作流定义
│   ├── brainstorm.md        # 需求澄清工作流
│   ├── plan.md              # 任务规划工作流
│   ├── worktree.md          # Worktree 工作流
│   ├── prd.md               # 产品规格工作流
│   ├── dev.md               # 开发工作流
│   ├── check.md             # 检查工作流
│   └── ...
│
└── skills/                   # 自定义技能
    ├── frontend-design/
    ├── fullstack-engineer/
    ├── ruthless-pm/
    └── ui-prompt-designer/

docs/
├── designs/                  # 设计文档 (brainstorm 输出)
├── plans/                    # 任务计划 (plan 输出)
└── Product-Spec.md          # 产品规格 (prd 输出)
```

## 🎯 最佳实践

### 1. 何时使用 Worktrees?

**推荐使用**:

- ✅ 开发新功能
- ✅ 大规模重构
- ✅ 实验性改动
- ✅ 并行开发多个任务

**不需要使用**:

- ❌ 修改文档
- ❌ 调整配置
- ❌ 小 Bug 修复 (< 10 行代码)

### 2. 何时使用 TDD?

**强烈推荐**:

- ✅ 核心业务逻辑
- ✅ 复杂算法
- ✅ API 接口
- ✅ 数据处理

**可选**:

- 🟡 UI 组件 (可以用快照测试)
- 🟡 配置文件
- 🟡 简单工具函数

### 3. 何时创建详细计划?

**需要计划**:

- ✅ 复杂功能 (> 30 分钟)
- ✅ 跨模块改动
- ✅ 团队协作任务
- ✅ 关键功能

**可以简化**:

- 🟡 简单功能 (< 15 分钟)
- 🟡 熟悉的改动
- 🟡 紧急修复

## 🚫 常见陷阱

### 陷阱 1: 跳过设计直接编码

```bash
# ❌ 错误
用户: 帮我添加邮件功能
AI: 好的,开始写代码...

# ✅ 正确
用户: 帮我添加邮件功能
AI: 让我先了解一些细节... (使用 /brainstorm)
```

### 陷阱 2: 在主分支直接大改

```bash
# ❌ 错误
直接在 main 分支进行大规模重构

# ✅ 正确
/worktree refactor/module-name
# 在隔离环境中重构
```

### 陷阱 3: 先写代码再补测试

```bash
# ❌ 错误
1. 写代码
2. 补测试

# ✅ 正确 (TDD)
1. 写测试 (RED)
2. 写代码 (GREEN)
3. 重构 (REFACTOR)
```

### 陷阱 4: 任务粒度太大

```bash
# ❌ 错误
任务: 实现整个用户管理模块 (预计 2 小时)

# ✅ 正确
任务 1: 创建用户 API (5 分钟)
任务 2: 编写用户 API 测试 (3 分钟)
任务 3: 实现用户列表页面 (5 分钟)
...
```

## 📈 成功指标

使用 Superpowers 后,您应该看到:

- ✅ **代码质量提升**: 测试覆盖率 > 80%
- ✅ **开发速度加快**: 清晰的任务分解
- ✅ **风险降低**: 隔离环境保护主分支
- ✅ **可维护性增强**: 完整的设计和计划文档
- ✅ **协作效率提高**: 标准化的工作流程

## 🔗 参考资源

### 官方资源

- [Superpowers GitHub](https://github.com/obra/superpowers)
- [Git Worktree 文档](https://git-scm.com/docs/git-worktree)
- [TDD 最佳实践](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

### 项目内资源

- [技能文档](.agent/superpowers/)
- [工作流文档](.agent/workflows/)
- [设计文档](docs/designs/)
- [任务计划](docs/plans/)

## 💬 获取帮助

如果遇到问题:

1. **查看文档**: 先查看相关技能和工作流文档
2. **使用 /help**: 查看所有可用工作流
3. **提问 AI**: 直接询问 AI 如何使用某个功能

## 🎉 开始使用

现在您已经了解了 Superpowers 的核心概念,可以开始使用了!

```bash
# 试试看!
/brainstorm
# 告诉 AI 你想实现什么功能,体验交互式需求澄清
```

祝您开发愉快! 🚀
