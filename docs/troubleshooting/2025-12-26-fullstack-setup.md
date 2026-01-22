# 全栈开发故障记录与解决方案 (2025-12-26)

本文件记录了在搭建 Vue 3 + Backend + PostgreSQL 全栈架构过程中遇到的核心问题及其解决方法。

---

## 1. TypeScript 编译错误 (Docker 构建阶段)

### 问题描述
在 `docker-compose build` 时，前端容器报错：
- `error TS1484: 'RouteRecordRaw' is a type and must be imported using a type-only import.`
- `error TS6133: 'from' is declared but its value is never read.`

### 根本原因
- 项目启用了 `verbatimModuleSyntax: true`，要求类型必须显式使用 `import type`。
- 启用了严格的未使用参数检查 (`noUnusedParameters: true`)。

### 解决方案
- 修改 `frontend/src/router/index.ts`：
    - `import { ..., type RouteRecordRaw } from 'vue-router';`
    - 将路由守卫中的 `from` 改为 `_from` 以忽略未使用检查。

---

## 2. Prisma 7 破坏性更新 (运行时)

### 问题描述
- 错误 1：`Module '@prisma/client' has no exported member 'PrismaClient'`。
- 错误 2：`PrismaClientInitializationError: PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions`。
- 错误 3：`datasources` 属性在类型中不存在。

### 根本原因
- **Prisma 7 强制驱动适配器**：移除了 Rust 引擎内置驱动，本地开发也必须使用适配器。
- **构建流缺失**：Dockerfile 中未执行 `prisma generate`。
- **构造函数变更**：不再支持在 `new PrismaClient()` 中直接传 `datasources.db.url`。

### 解决方案
1.  **修改 Dockerfile**：在 `pnpm build` 前运行 `npx prisma generate`。
2.  **引入驱动适配器**：安装 `pg` 和 `@prisma/adapter-pg`。
3.  **重构初始化逻辑**：
    ```typescript
    import { Pool } from 'pg';
    import { PrismaPg } from '@prisma/adapter-pg';
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    ```

---

## 3. 502 Bad Gateway / DNS 污染 (网络通信)

### 问题描述
Nginx 日志显示 `upstream: "http://198.18.3.0:3001..."`，并报错 `prematurely closed connection`。

### 根本原因
1.  **DNS 劫持**：本地代理软件（如 Clash/Surge）劫持了 Docker 内部域名（如 `backend`），返回了假 IP (`198.18.3.0`)。
2.  **监听地址错误**：容器内服务监听了 `localhost` 而非 `0.0.0.0`，导致容器间无法通过 IP 互访。

### 解决方案
1.  **Nginx 配置优化**：
    - 添加 `resolver 127.0.0.11` 显式指向 Docker DNS。
    - 使用变量 `set $upstream_backend backend:3001` 强制 Nginx 在请求时动态解析。
2.  **服务监听地址**：将 Backend 的监听地址改为 `0.0.0.0`。
3.  **代理策略**：建议在宿主机代理软件中将 `backend`, `postgres` 加入绕过列表。

---

## 4. 运行时缺失模块

### 问题描述
后端启动时报错 `Error: Cannot find module 'dotenv/config'`。

### 根本原因
`dotenv` 被代码引用但未在 `package.json` 的 `dependencies` 中声明，导致生产环境下镜像中不存在该模块。

### 解决方案
运行 `pnpm add dotenv` 并重新执行 Docker 构建。

