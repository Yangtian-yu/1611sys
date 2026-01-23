# Docker 部署说明

## 服务架构

本项目使用 Docker Compose 编排以下三个服务：

1. **postgres** - PostgreSQL 16 数据库
2. **backend** - Nest.js 后端服务
3. **frontend** - Vue 3 前端（Nginx 提供服务）

## 快速启动

### Windows 用户

双击运行 `start.bat` 或在命令行执行：

```cmd
start.bat
```

### Linux/Mac 用户

```bash
chmod +x start.sh
./start.sh
```

## 服务端口

- **前端**：http://localhost (端口 80)
- **后端 API**：http://localhost:3000/api
- **数据库**：localhost:5432

## Docker 配置说明

### docker-compose.yml

定义了三个服务及其依赖关系：

- `postgres`: 数据库服务，使用持久化卷存储数据
- `backend`: 后端服务，依赖数据库启动
- `frontend`: 前端服务，使用 Nginx 提供静态文件和 API 代理

### 后端 Dockerfile

- 多阶段构建，优化镜像大小
- 第一阶段：构建应用（安装依赖、生成 Prisma Client、编译 TypeScript）
- 第二阶段：生产运行（只包含必要的生产依赖和构建产物）

### 前端 Dockerfile

- 多阶段构建
- 第一阶段：构建 Vue 应用
- 第二阶段：使用 Nginx 提供静态文件服务

### Nginx 配置

- 处理 Vue Router 的 history 模式
- 代理 `/api` 请求到后端服务
- 启用 Gzip 压缩
- 静态资源缓存优化

## 常用命令

### 启动服务

```bash
docker-compose up -d
```

### 停止服务

```bash
docker-compose down
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 重新构建

```bash
docker-compose build

# 重新构建特定服务
docker-compose build backend
docker-compose build frontend
```

### 重启服务

```bash
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

### 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入数据库容器
docker-compose exec postgres psql -U postgres -d duty_system
```

### 清理数据

```bash
# 停止并删除容器、网络
docker-compose down

# 同时删除数据卷（会清空数据库）
docker-compose down -v
```

## 环境变量

### 数据库配置

在 `docker-compose.yml` 中配置：

```yaml
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres123
POSTGRES_DB: duty_system
```

### 后端配置

```yaml
DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/duty_system
JWT_SECRET: your-secret-key-change-in-production-1611
PORT: 3000
```

**⚠️ 生产环境请务必修改密码和密钥！**

## 数据持久化

数据库数据存储在 Docker 卷 `postgres_data` 中，即使容器删除，数据也不会丢失。

查看数据卷：

```bash
docker volume ls
```

删除数据卷（会清空所有数据）：

```bash
docker-compose down -v
```

## 故障排查

### 端口被占用

如果 80、3000 或 5432 端口被占用，修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:80" # 前端改为 8080
  - "3001:3000" # 后端改为 3001
  - "5433:5432" # 数据库改为 5433
```

### 数据库连接失败

检查数据库是否已启动：

```bash
docker-compose ps
```

查看数据库日志：

```bash
docker-compose logs postgres
```

### 后端启动失败

查看后端日志：

```bash
docker-compose logs backend
```

常见问题：

- 数据库未就绪：等待数据库健康检查通过
- Prisma 迁移失败：检查数据库连接配置

### 前端无法访问

1. 检查 Nginx 配置是否正确
2. 查看前端日志：`docker-compose logs frontend`
3. 确认后端服务已启动

## 性能优化

### 镜像大小优化

- 使用 Alpine Linux 基础镜像
- 多阶段构建，只保留必要文件
- 使用 `.dockerignore` 排除不必要的文件

### 构建缓存

Docker 会缓存每一层，修改代码后重新构建会更快。

### 生产部署建议

1. 使用环境变量管理敏感信息
2. 配置 HTTPS（使用 Let's Encrypt）
3. 设置资源限制（CPU、内存）
4. 配置健康检查
5. 使用 Docker Swarm 或 Kubernetes 进行编排
