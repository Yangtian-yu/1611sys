# 📚 1611值日系统文档中心

欢迎来到1611值日系统的文档中心。本目录包含了项目的所有技术文档、部署指南和运维手册。

---

## 📑 文档导航

### 🚀 [部署文档](./deployment/)
生产环境部署相关的所有文档。

| 文档 | 说明 |
|------|------|
| [部署日志](./deployment/部署日志-2026-01-22.md) | 详细的生产环境部署记录 |
| [Docker配置](./deployment/DOCKER.md) | Docker容器化配置说明 |

### 🔧 [运维文档](./operations/)
系统运维、监控和维护相关文档。

| 文档 | 说明 |
|------|------|
| [运维指南](./operations/README.md) | 运维操作总览和快速入口 |
| [数据库备份](./operations/database-backup.md) | 自动备份和恢复指南 |
| [CI/CD配置](./operations/ci-cd-setup.md) | 自动化部署配置说明 |

### 💻 [开发文档](./development/)
产品需求、技术设计和开发指南。

| 文档 | 说明 |
|------|------|
| [产品规格](./development/_Product-Spec.md) | 产品需求和功能规格 |
| [逻辑演进](./development/Logic-Evolution.md) | 业务逻辑演进记录 |
| [UI提示词](./development/UI-Prompts.md) | UI设计提示词集合 |

### 🔍 [故障排查](./troubleshooting/)
常见问题和解决方案。

| 文档 | 说明 |
|------|------|
| [全栈环境搭建](./troubleshooting/2025-12-26-fullstack-setup.md) | 开发环境配置问题 |
| [Prisma 7升级](./troubleshooting/prisma-7-upgrade-guide.md) | Prisma版本升级指南 |

### 🎨 [设计文档](./designs/)
功能设计和架构设计文档。

| 文档 | 说明 |
|------|------|
| [娱乐菜单设计](./designs/entertainment-menu-snake-game.md) | 娱乐中心和贪吃蛇游戏设计 |

### 📦 [归档文档](./archives/)
历史文档和聊天记录存档。

---

## 🔑 安全提示

**重要**：所有文档中的敏感信息（如IP地址、密码、密钥等）均已替换为占位符：
- `<YOUR_SERVER_IP>` - 服务器IP地址
- `<YOUR_EMAIL>` - 邮箱地址
- `<YOUR_EMAIL_PASSWORD>` - 邮箱授权码
- `<YOUR_JWT_SECRET>` - JWT密钥

在实际使用时，请替换为真实的配置信息，但**切勿将真实信息提交到Git仓库**。

---

## 📌 快速链接

### 新手入门
1. [Docker部署指南](./deployment/DOCKER.md)
2. [部署日志示例](./deployment/部署日志-2026-01-22.md)
3. [产品功能说明](./development/_Product-Spec.md)

### 运维人员
1. [运维总览](./operations/README.md)
2. [数据库备份](./operations/database-backup.md)
3. [CI/CD自动化](./operations/ci-cd-setup.md)

### 开发人员
1. [产品规格](./development/_Product-Spec.md)
2. [业务逻辑](./development/Logic-Evolution.md)
3. [故障排查](./troubleshooting/)

---

## 📝 文档贡献

如需添加或更新文档，请遵循以下规范：
1. 使用清晰的 Markdown 格式
2. 添加必要的目录和导航
3. **移除所有敏感信息**
4. 归类到正确的文件夹
5. 更新本 README 的导航链接

---

## 📮 联系方式

如有问题或建议，请通过以下方式反馈：
- 提交 GitHub Issue
- 查看项目仓库：https://github.com/Yangtian-yu/1611sys
