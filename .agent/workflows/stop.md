---
description: 停止运行中的前后端服务
---

# STOP 工作流：停止服务

本工作流将停止所有正在运行的前后端服务。

## 执行步骤

// turbo

1. **查找运行中的进程**
   - 查找 Vite 开发服务器进程
   - 查找 Nest.js 开发服务器进程
   - 查找 Docker 容器（如果有）

// turbo 2. **停止前端服务**

```bash
# 查找并终止 Vite 进程
# Windows
taskkill /F /IM node.exe /FI "WINDOWTITLE eq vite*"

# Linux/Mac
pkill -f "vite"
```

// turbo 3. **停止后端服务**

```bash
# 查找并终止 Nest.js 进程
# Windows
taskkill /F /IM node.exe /FI "WINDOWTITLE eq nest*"

# Linux/Mac
pkill -f "nest"
```

// turbo 4. **停止数据库容器（可选）**

```bash
docker-compose down
```

5. **确认停止**

   ```
   ✅ 所有服务已停止

   - 前端服务：已停止
   - 后端服务：已停止
   - 数据库容器：已停止
   ```

## 注意事项

- 会强制终止所有相关进程
- 数据库容器默认不会停止，除非明确指定
