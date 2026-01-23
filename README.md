# 🗓️ 1611 值日系统

办公室值日管理系统 - 自动化排班与邮件提醒

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-47.4%25-blue)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-40.9%25-green)](https://vuejs.org/)

---

## ✨ 功能特性

- 🔐 **用户认证** - JWT 登录认证，管理员/员工角色
- 📅 **自动排班** - 按顺序轮流制，每周自动生成值日安排
- 👥 **员工管理** - CRUD 操作，拖拽调整值日顺序
- 📧 **邮件通知** - 每周最后一个工作日自动发送通知
- 🏥 **健康检查** - 服务健康监控接口
- 💾 **自动备份** - 数据库每天自动备份
- 🚀 **CI/CD** - 自动化构建和部署

---

## 🛠️ 技术栈

**前端**: Vue 3 + TypeScript + Vite + Element Plus + Tailwind CSS
**后端**: NestJS + Prisma + PostgreSQL + JWT
**部署**: Docker + Docker Compose + GitHub Actions

---

## 🚀 快速开始

### Docker 一键启动（推荐）

```bash
# 克隆项目
git clone https://github.com/Yangtian-yu/1611sys.git
cd 1611sys

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入数据库、邮箱等配置

# 启动服务
docker compose up -d

# 访问应用
# 前端：http://localhost
# 后端API：http://localhost:3000/api
```

### 本地开发模式

**前置要求**: Node.js 20+, pnpm, PostgreSQL

```bash
# 安装依赖
cd backend && pnpm install
cd ../frontend && pnpm install

# 配置数据库（编辑 backend/.env）
DATABASE_URL="postgresql://user:password@localhost:5432/duty_system"

# 初始化数据库
cd backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed

# 启动服务
pnpm start:dev  # 后端
cd ../frontend && pnpm dev  # 前端
```

---

## 🔑 测试账号

**管理员**: `admin` / `Admin@1611`
**员工**: `李明` / `123456`

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| [快速开始](./docs/开发文档/快速开始.md) | 详细的安装和开发指南 |
| [API 文档](./docs/开发文档/API文档.md) | 接口文档和使用说明 |
| [部署指南](./docs/部署文档/部署日志-2026-01-22.md) | 生产环境部署记录 |
| [运维手册](./docs/运维文档/运维总览.md) | 备份、监控、CI/CD 配置 |
| [产品规格](./docs/开发文档/产品规格.md) | 功能需求和设计文档 |

完整文档导航：[📚 文档中心](./docs/README.md)

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

详见：[贡献指南](./docs/开发文档/贡献指南.md)

---

## 📄 开源协议

本项目采用 [MIT](./LICENSE) 协议开源。

---

## 📮 联系方式

- 项目地址：https://github.com/Yangtian-yu/1611sys
- 问题反馈：[GitHub Issues](https://github.com/Yangtianyu/1611sys/issues)

---

**Made with ❤️ by Yangtian-yu & Claude**
