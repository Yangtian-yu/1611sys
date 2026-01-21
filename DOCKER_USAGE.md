# Docker 环境使用说明

## 📦 简介

本项目支持使用 Docker 一键启动完整的开发/生产环境，无需手动配置数据库、依赖等。

## 🚀 快速开始

### 本地开发环境

```bash
# 启动本地开发环境
docker-compose --env-file .env.local up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 生产环境

```bash
# 首次部署前，请务必修改 .env.production 中的敏感信息
# 1. 修改数据库密码 POSTGRES_PASSWORD
# 2. 修改 JWT 密钥 JWT_SECRET
# 3. 修改邮件服务配置 MAIL_USER 和 MAIL_PASS

# 启动生产环境
docker-compose --env-file .env.production up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📋 环境配置说明

### .env.local (本地开发)

```env
NODE_ENV=development
POSTGRES_PASSWORD=postgres123
JWT_SECRET=your-secret-key-change-in-production-1611-local
DB_SEED=true  # 首次启动会自动导入测试数据
```

### .env.production (生产环境)

```env
NODE_ENV=production
POSTGRES_PASSWORD=CHANGE_ME_IN_PRODUCTION_STRONG_PASSWORD  # 务必修改！
JWT_SECRET=CHANGE_ME_IN_PRODUCTION_STRONG_SECRET_KEY       # 务必修改！
DB_SEED=false  # 生产环境建议关闭自动种子数据
```

## 🔧 关键配置项

| 配置项 | 说明 | 本地建议 | 生产建议 |
|--------|------|----------|----------|
| `DB_SEED` | 是否自动导入种子数据 | `true` | `false` |
| `POSTGRES_PASSWORD` | 数据库密码 | 简单密码 | 强密码(16位+) |
| `JWT_SECRET` | JWT 密钥 | 任意字符串 | 强密钥(32位+) |
| `MAIL_USER` | 邮件账号 | 测试邮箱 | 生产邮箱 |

## 📊 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| Frontend | 80 | 前端页面 |
| Backend | 3000 | 后端 API |
| PostgreSQL | 5432 | 数据库 |

访问地址：
- 前端: http://localhost
- 后端 API: http://localhost:3000
- 数据库: localhost:5432

## 🛠️ 常用命令

### 查看运行状态
```bash
docker-compose ps
```

### 查看实时日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 只查看后端日志
docker-compose logs -f backend

# 只查看数据库日志
docker-compose logs -f postgres
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 只重启后端
docker-compose restart backend
```

### 完全清理
```bash
# 停止并删除所有容器、网络
docker-compose down

# 同时删除数据卷（会清空数据库数据）
docker-compose down -v
```

### 重新构建
```bash
# 重新构建并启动（当代码有更新时）
docker-compose --env-file .env.local up -d --build
```

## 🔍 故障排查

### 1. 数据库连接失败
```bash
# 检查数据库容器是否健康
docker-compose ps

# 查看数据库日志
docker-compose logs postgres

# 进入数据库容器检查
docker exec -it duty-system-db psql -U postgres -d duty_system
```

### 2. 后端启动失败
```bash
# 查看后端详细日志
docker-compose logs backend

# 常见问题：
# - 数据库未就绪：等待一会儿，entrypoint 脚本会自动重试
# - 环境变量错误：检查 .env.local 或 .env.production 配置
```

### 3. 前端无法访问
```bash
# 检查前端容器状态
docker-compose logs frontend

# 检查端口是否被占用
lsof -i :80  # macOS/Linux
netstat -ano | findstr :80  # Windows
```

### 4. 重置数据库
```bash
# 方法1：删除数据卷重新启动（会丢失所有数据）
docker-compose down -v
docker-compose --env-file .env.local up -d

# 方法2：进入容器手动操作
docker exec -it duty-system-backend sh
pnpm prisma:deploy
pnpm prisma:seed
```

## 🎯 首次部署检查清单

### 本地开发
- [ ] 确认 `.env.local` 文件存在
- [ ] 执行 `docker-compose --env-file .env.local up -d`
- [ ] 访问 http://localhost 检查前端
- [ ] 访问 http://localhost:3000 检查后端 API

### 生产部署
- [ ] 修改 `.env.production` 中的 `POSTGRES_PASSWORD` 为强密码
- [ ] 修改 `.env.production` 中的 `JWT_SECRET` 为强密钥
- [ ] 修改 `.env.production` 中的邮件配置
- [ ] 确认 `DB_SEED=false`（避免生产环境导入测试数据）
- [ ] 执行 `docker-compose --env-file .env.production up -d`
- [ ] 检查所有服务状态 `docker-compose ps`
- [ ] 查看日志确认无错误 `docker-compose logs`

## 💡 进阶技巧

### 后台运行
```bash
# -d 参数让容器在后台运行
docker-compose --env-file .env.local up -d
```

### 只启动部分服务
```bash
# 只启动数据库和后端
docker-compose --env-file .env.local up -d postgres backend
```

### 进入容器内部
```bash
# 进入后端容器
docker exec -it duty-system-backend sh

# 进入数据库容器
docker exec -it duty-system-db sh
```

### 导出/导入数据
```bash
# 导出数据
docker exec duty-system-db pg_dump -U postgres duty_system > backup.sql

# 导入数据
docker exec -i duty-system-db psql -U postgres duty_system < backup.sql
```

## 📝 自动初始化流程

后端容器启动时会自动执行以下步骤（由 `docker-entrypoint.sh` 控制）：

1. ⏳ 等待数据库完全就绪
2. 📦 执行数据库迁移 (`prisma migrate deploy`)
3. 🌱 如果 `DB_SEED=true`，导入种子数据
4. ✨ 启动后端应用

无需手动执行任何初始化命令，一切都是自动化的！

## ⚠️ 注意事项

1. **首次启动较慢**：需要下载镜像、构建应用，大约需要 5-10 分钟
2. **端口占用**：确保 80、3000、5432 端口未被占用
3. **数据持久化**：数据库数据存储在 Docker volume 中，`docker-compose down` 不会删除数据
4. **生产环境安全**：务必修改默认密码和密钥
5. **资源占用**：Docker 容器会占用一定的 CPU 和内存资源

## 📞 获取帮助

如遇到问题，请提供以下信息：
1. 完整的错误日志：`docker-compose logs`
2. 容器状态：`docker-compose ps`
3. 系统信息：`docker version` 和 `docker-compose version`
