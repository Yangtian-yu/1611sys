# 数据库切换和 Docker 配置修复指南

## 📋 概述

本次更新将系统从 Mock 数据模式切换为真实的 PostgreSQL 数据库,并修复了 Docker 环境的构建问题。

## ✅ 已完成的修改

### 1. 配置文件修改

- ✅ [backend/.env](backend/.env) - 添加 `DATABASE_URL`,移除 `USE_MOCK`
- ✅ [backend/package.json](backend/package.json) - Prisma 版本改为精确版本 `5.9.0`
- ✅ [.env.docker](.env.docker) - 新创建的 Docker 环境配置
- ✅ [docker-compose.yml](docker-compose.yml) - 添加 env_file,修改启动命令
- ✅ [backend/Dockerfile](backend/Dockerfile) - 添加 openssl,固定 pnpm 版本

### 2. 辅助脚本

- ✅ [init-local.sh](init-local.sh) - 本地开发环境一键初始化脚本
- ✅ [test-docker.sh](test-docker.sh) - Docker 环境测试脚本

## 🚀 使用方法

### 方式一:本地开发环境(推荐用于开发)

1. **启动 Docker Desktop**

2. **运行初始化脚本**:
   ```bash
   ./init-local.sh
   ```

   这个脚本会自动:
   - 创建并启动本地 PostgreSQL 容器
   - 安装后端依赖
   - 生成 Prisma Client
   - 创建数据库表
   - 初始化数据(创建管理员和测试账号)

3. **启动后端开发服务器**:
   ```bash
   cd backend
   pnpm start:dev
   ```

4. **访问应用**:
   - 后端 API: http://localhost:3000/api
   - 管理员账号: `admin` / `Admin@1611`

### 方式二:Docker 完整环境(推荐用于测试和部署)

1. **启动 Docker Desktop**

2. **运行测试脚本**:
   ```bash
   ./test-docker.sh
   ```

   这个脚本会自动:
   - 清理旧容器
   - 构建 Docker 镜像
   - 启动所有服务(数据库、后端、前端)
   - 执行自动化测试

3. **访问应用**:
   - 前端: http://localhost
   - 后端 API: http://localhost:3000/api
   - 管理员账号: `admin` / `Admin@1611`

4. **查看日志**:
   ```bash
   docker-compose logs -f backend
   ```

5. **停止服务**:
   ```bash
   docker-compose down
   ```

## 📊 验证步骤

### 验证本地开发环境

1. **检查数据库**:
   ```bash
   docker exec -it duty-system-db-local psql -U postgres -d duty_system -c "SELECT username, role FROM users;"
   ```
   应该看到 5 个用户(1个管理员 + 4个员工)

2. **测试登录 API**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"Admin@1611"}'
   ```
   应返回包含 JWT token 的 JSON

### 验证 Docker 环境

1. **检查容器状态**:
   ```bash
   docker-compose ps
   ```
   所有服务应该是 `Up` 状态

2. **检查后端日志**:
   ```bash
   docker-compose logs backend | grep -E "(prisma|seed|启动)"
   ```
   应该看到:
   - ✅ Prisma migrate deploy 成功
   - ✅ Seed 执行成功
   - ✅ 服务启动成功

3. **测试完整链路**:
   ```bash
   # 测试后端
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"Admin@1611"}'

   # 测试前端
   curl http://localhost
   ```

## 🔧 问题排查

### 问题1: Docker 未运行
```
错误: Cannot connect to the Docker daemon
解决: 启动 Docker Desktop
```

### 问题2: 端口被占用
```
错误: Port 5432 is already in use
解决:
  # 查看占用端口的进程
  lsof -i :5432
  # 停止占用的服务或修改 docker-compose.yml 中的端口映射
```

### 问题3: Prisma 版本冲突
```
错误: Prisma Client version mismatch
解决:
  cd backend
  pnpm install
  pnpm prisma:generate
```

### 问题4: 数据库连接失败
```
错误: Can't reach database server
解决:
  # 检查数据库容器是否运行
  docker ps | grep postgres

  # 如果未运行,启动容器
  docker start duty-system-db-local

  # 等待 10 秒让数据库完全启动
  sleep 10
```

### 问题5: Docker 构建失败
```
错误: bcrypt compilation error
解决: 已在 Dockerfile 中添加必要的编译工具和 openssl
  如果仍然失败:
  docker-compose build --no-cache
```

## 📝 关键变更说明

### 1. Mock 数据切换逻辑

**文件**: `backend/src/prisma/prisma.module.ts:5`

```typescript
const useMock = !process.env.DATABASE_URL || process.env.USE_MOCK === 'true' || process.env.NODE_ENV === 'test';
```

**修改前**: `.env` 中 `USE_MOCK=true`,即使配置了 `DATABASE_URL` 也会使用 Mock

**修改后**: 移除 `USE_MOCK`,添加 `DATABASE_URL`,系统自动切换到真实数据库

### 2. Docker 启动流程

**修改前**:
```bash
pnpm start:prod
```

**修改后**:
```bash
pnpm prisma:deploy &&  # 应用数据库迁移
pnpm prisma:seed &&    # 创建初始数据
node dist/src/main.js  # 启动应用
```

### 3. Prisma 版本锁定

**修改前**: `"prisma": "^5.9.0"` (可能安装 5.22.0)

**修改后**: `"prisma": "5.9.0"` (精确版本,避免冲突)

### 4. 敏感信息管理

**修改前**: 所有敏感信息硬编码在 docker-compose.yml

**修改后**: 使用 `.env.docker` 文件统一管理

## 🔐 初始账号信息

### 管理员账号
- 用户名: `admin`
- 密码: `Admin@1611`
- 角色: `ADMIN`

### 测试员工账号(4个)
- 李明: 密码 `123456`
- 王芳: 密码 `123456`
- 张三: 密码 `123456`
- 李四: 密码 `123456`

## ⚠️ 安全提示

1. **生产环境务必修改**:
   - 数据库密码(当前: `postgres123`)
   - JWT 密钥(在 `.env.docker` 中)
   - 管理员密码(首次登录后修改)

2. **不要提交到 Git**:
   - `.env.local`
   - 任何包含真实密钥的文件

3. **建议使用**:
   - 环境变量管理工具
   - Docker Secrets(生产环境)
   - 密钥管理服务

## 🔄 回滚方案

如果遇到问题需要回滚到 Mock 模式:

```bash
# 修改 backend/.env
cd backend
echo "USE_MOCK=true" >> .env

# 注释掉 DATABASE_URL
# DATABASE_URL="postgresql://..."

# 重启后端
pnpm start:dev
```

## 📚 相关文档

- [Prisma 文档](https://www.prisma.io/docs/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

## 🎉 总结

所有配置已完成!现在你可以:

1. ✅ 使用真实的 PostgreSQL 数据库
2. ✅ 在 Docker 环境中正常运行
3. ✅ 自动初始化管理员账号
4. ✅ 通过脚本一键启动开发/测试环境

如有任何问题,请参考上面的"问题排查"章节或查看日志。
