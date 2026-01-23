# CI/CD 自动化部署指南

## 📋 概述

本项目使用 GitHub Actions 实现 CI/CD 自动化：

- **CI（持续集成）**：每次推送代码或创建 PR 时，自动运行构建和测试
- **CD（持续部署）**：创建版本标签时，自动部署到生产服务器

---

## 🚀 快速开始

### 1. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

**路径**：Settings → Secrets and variables → Actions → New repository secret

需要添加的 Secrets：

| 名称 | 值 | 说明 |
|------|----|----|
| `SERVER_HOST` | `47.95.43.38` | 服务器 IP 地址 |
| `SERVER_USER` | `root` | SSH 用户名 |
| `SSH_PRIVATE_KEY` | `你的私钥` | SSH 私钥（见下方） |

### 2. 生成 SSH 密钥对（如果还没有）

在**本地电脑**执行：

```bash
# 生成新的密钥对
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy

# 查看公钥（添加到服务器）
cat ~/.ssh/github_deploy.pub

# 查看私钥（添加到 GitHub Secrets）
cat ~/.ssh/github_deploy
```

### 3. 在服务器上添加公钥

登录服务器，执行：

```bash
# 添加公钥到授权列表
echo "你的公钥内容" >> ~/.ssh/authorized_keys

# 设置权限
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 4. 测试 SSH 连接

在本地测试连接：

```bash
ssh -i ~/.ssh/github_deploy root@47.95.43.38
```

如果能正常连接，说明配置成功。

---

## 📦 使用方式

### 自动构建（CI）

每次推送代码到 `main` 分支时，会自动：

1. ✅ 检出代码
2. ✅ 安装依赖
3. ✅ 构建后端
4. ✅ 构建前端
5. ✅ 检查构建产物

**查看构建状态**：
- 仓库首页的 Actions 标签
- 提交记录旁的 ✅ 或 ❌ 图标

### 自动部署（CD）

创建版本标签时，会自动部署到服务器：

```bash
# 1. 确保代码已提交并推送
git add .
git commit -m "feat: 新功能完成"
git push origin main

# 2. 创建版本标签
git tag v1.0.1

# 3. 推送标签（触发部署）
git push origin v1.0.1
```

**部署流程**：
1. 📦 备份当前版本
2. ⬇️ 拉取最新代码
3. 💾 备份数据库
4. 🛑 停止现有服务
5. 🔨 构建 Docker 镜像
6. ▶️ 启动服务
7. 🏥 健康检查
8. 🧹 清理旧镜像

**部署时间**：约 3-5 分钟

---

## 🔍 监控部署状态

### GitHub Actions 页面

访问：`https://github.com/你的用户名/1611sys/actions`

可以看到：
- 所有工作流运行记录
- 实时构建/部署日志
- 成功/失败状态

### 部署失败处理

如果部署失败：

1. **查看 GitHub Actions 日志**
   - 点击失败的 workflow
   - 展开失败的 step
   - 查看错误信息

2. **常见问题**：

   **问题 1: SSH 连接失败**
   ```
   Error: Permission denied (publickey)
   ```

   解决：检查 GitHub Secrets 中的 `SSH_PRIVATE_KEY` 是否正确

   **问题 2: 健康检查失败**
   ```
   ❌ 服务健康检查失败！
   ```

   解决：登录服务器查看日志
   ```bash
   cd ~/1611sys
   docker compose logs backend
   ```

   **问题 3: 构建失败**
   ```
   Error: Command failed: pnpm build
   ```

   解决：本地测试构建
   ```bash
   cd backend
   pnpm build
   ```

3. **手动回滚**

   如果部署失败，可以回滚到上一个版本：

   ```bash
   # 在服务器上执行
   cd ~/1611sys

   # 查看可用标签
   git tag -l

   # 回滚到指定版本
   git checkout v1.0.0
   docker compose down
   docker compose up -d
   ```

---

## 🎯 版本管理规范

### 版本号格式

使用语义化版本：`v主版本.次版本.修订号`

- **主版本**：重大功能更新、架构变更
- **次版本**：新功能、向后兼容
- **修订号**：Bug 修复、小改进

示例：
- `v1.0.0` - 首次发布
- `v1.0.1` - 修复 Bug
- `v1.1.0` - 添加新功能
- `v2.0.0` - 重大更新

### 发布流程

```bash
# 1. 完成开发和测试
git add .
git commit -m "feat: 添加邮件测试功能"

# 2. 推送到 main（触发 CI）
git push origin main

# 3. 等待 CI 通过

# 4. 创建并推送 tag（触发 CD）
git tag v1.0.1
git push origin v1.0.1

# 5. 在 GitHub Actions 查看部署进度

# 6. 部署完成后，访问网站测试
```

---

## 📝 工作流配置文件

### CI 工作流（`.github/workflows/ci.yml`）

- **触发条件**：push 到 main 或创建 PR
- **作用**：验证代码可以正常构建
- **运行时间**：约 2-3 分钟

### CD 工作流（`.github/workflows/deploy.yml`）

- **触发条件**：推送 tag（v*.*.*）
- **作用**：自动部署到生产服务器
- **运行时间**：约 3-5 分钟

---

## 🛠️ 高级配置

### 添加测试步骤

编辑 `.github/workflows/ci.yml`，在构建后添加：

```yaml
- name: Run tests
  working-directory: ./backend
  run: pnpm test
```

### 添加部署通知

安装 Slack/钉钉/企业微信通知（需要额外配置）

### 多环境部署

创建不同的工作流：
- `deploy-staging.yml` - 部署到测试环境
- `deploy-production.yml` - 部署到生产环境

---

## ✅ 检查清单

部署前确认：

- [ ] GitHub Secrets 已配置
- [ ] SSH 密钥已添加到服务器
- [ ] 服务器脚本有执行权限（`chmod +x scripts/*.sh`）
- [ ] 健康检查接口正常（`/api/health`）
- [ ] 数据库备份脚本可用
- [ ] 本地构建成功

---

## 📞 支持

如有问题：
1. 查看 GitHub Actions 日志
2. 查看服务器日志：`docker compose logs`
3. 查看部署文档：`docs/deployment.md`
