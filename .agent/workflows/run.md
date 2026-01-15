---
description: 本地运行项目（自动安装依赖并启动）
---

# RUN 工作流：本地运行项目

本工作流将自动安装依赖并启动前后端服务。

## 执行步骤

// turbo

1. **检查项目结构**
   - 检查是否存在前端项目（`package.json` 在根目录或 `/frontend`）
   - 检查是否存在后端项目（`package.json` 在 `/backend` 或 `/server`）

// turbo 2. **安装前端依赖**

```bash
cd frontend  # 或项目根目录
pnpm install
```

// turbo 3. **安装后端依赖**

```bash
cd backend  # 或 /server
pnpm install
```

// turbo 4. **启动数据库（如果需要）**

- 检查是否有 `docker-compose.yml`
- 如果有，运行：

```bash
docker-compose up -d
```

// turbo 5. **运行数据库迁移**

```bash
cd backend
pnpm prisma migrate dev
# 或
pnpm typeorm migration:run
```

// turbo 6. **启动后端服务**
在后台启动：

```bash
cd backend
pnpm start:dev
```

// turbo 7. **启动前端服务**
在后台启动：

```bash
cd frontend
pnpm dev
```

8. **输出访问信息**

   ```
   ✅ 项目已启动！

   前端地址：http://localhost:5173
   后端地址：http://localhost:3000
   API 文档：http://localhost:3000/api

   使用 /stop 停止服务
   使用 /status 查看运行状态
   ```

## 注意事项

- 所有命令都会在后台运行
- 输出日志会保存到终端
- 如果端口被占用，会自动提示
