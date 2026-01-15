# 1611 值日系统

办公室值日管理系统 - 自动化排班与邮件提醒

## 项目简介

1611 值日系统是一个专为办公室值日管理设计的 Web 应用，支持自动轮流排班、值日查看等功能。

### 核心功能（第一版）

- ✅ 用户登录认证（JWT）
- ✅ 查看本周值日人员
- ✅ 自动轮流制排班
- ⏳ 员工管理（后续迭代）
- ⏳ 邮件通知（后续迭代）

## 技术栈

### 前端

- Vue 3 + TypeScript
- Vite 5
- Element Plus
- Tailwind CSS
- Pinia (状态管理)
- Vue Router 4
- Axios

### 后端

- Nest.js 10
- Prisma (ORM)
- PostgreSQL
- JWT 认证
- bcrypt (密码加密)

## 项目结构

```
testProject/
├── backend/                # 后端项目
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/      # 认证模块
│   │   │   └── duty/      # 值日模块
│   │   ├── prisma/        # Prisma 服务
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma  # 数据库 Schema
│   │   └── seed.ts        # 种子数据
│   ├── package.json
│   └── .env
│
└── frontend/               # 前端项目
    ├── src/
    │   ├── views/         # 页面组件
    │   ├── stores/        # Pinia stores
    │   ├── router/        # 路由配置
    │   ├── api/           # API 接口
    │   ├── types/         # TypeScript 类型
    │   ├── App.vue
    │   └── main.ts
    ├── package.json
    └── .env
```

## 快速开始

### 方式一：Docker 一键启动（推荐）

**前置要求：**

- Docker Desktop 已安装并运行

**启动步骤：**

```bash
# Windows 用户
start.bat

# Linux/Mac 用户
chmod +x start.sh
./start.sh
```

**访问应用：**

- 前端：http://localhost
- 后端 API：http://localhost:3000/api

**Docker 常用命令：**

```bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建
docker-compose build

# 重启服务
docker-compose restart
```

---

### 方式二：本地开发模式

### 前置要求

- Node.js 20+
- pnpm (推荐) 或 npm
- PostgreSQL 数据库

### 1. 安装依赖

```bash
# 安装后端依赖
cd backend
pnpm install

# 安装前端依赖
cd ../frontend
pnpm install
```

### 2. 配置数据库

编辑 `backend/.env` 文件：

```env
DATABASE_URL="postgresql://用户名:密码@localhost:5432/duty_system"
JWT_SECRET="your-secret-key-change-in-production-1611"
PORT=3000
```

### 3. 初始化数据库

```bash
cd backend

# 生成 Prisma Client
pnpm prisma:generate

# 运行数据库迁移
pnpm prisma:migrate

# 初始化种子数据（创建管理员和测试账号）
pnpm prisma:seed
```

### 4. 启动开发服务器

```bash
# 启动后端（在 backend 目录）
pnpm start:dev

# 启动前端（在 frontend 目录，新开一个终端）
cd ../frontend
pnpm dev
```

### 5. 访问应用

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000/api

## 测试账号

### 管理员账号

- 用户名：`admin`
- 密码：`Admin@1611`

### 普通员工账号

- 用户名：`李明` / `王芳` / `张三` / `李四`
- 密码：`123456`

## API 接口

### 认证接口

#### POST /api/auth/login

登录接口

**请求：**

```json
{
  "username": "admin",
  "password": "Admin@1611"
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "role": "ADMIN"
    }
  }
}
```

### 值日接口

#### GET /api/duty/current

获取本周值日安排（需要认证）

**请求头：**

```
Authorization: Bearer {token}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "weekStartDate": "2026-01-13",
    "dutyUsers": [
      {
        "id": "uuid1",
        "username": "李明",
        "email": "liming@qq.com"
      },
      {
        "id": "uuid2",
        "username": "王芳",
        "email": "wangfang@qq.com"
      }
    ]
  }
}
```

## 数据库 Schema

### users 表

- id: UUID (主键)
- username: String (唯一)
- password: String (bcrypt 加密)
- email: String
- role: Enum (ADMIN | EMPLOYEE)
- orderIndex: Integer (值日顺序)
- createdAt: DateTime
- updatedAt: DateTime

### duty_schedules 表

- id: UUID (主键)
- weekStartDate: DateTime (周一日期)
- dutyUserIds: String[] (值日人员 ID 数组)
- isManual: Boolean (是否手动调整)
- createdAt: DateTime

## 排班逻辑

系统采用**轮流制**自动排班：

1. 每周一自动生成本周排班
2. 按员工的 `orderIndex` 顺序轮流
3. 每周取 2 个员工值日
4. 示例（假设有 15 个员工）：
   - 第 1 周：员工 1 + 员工 2
   - 第 2 周：员工 3 + 员工 4
   - ...
   - 第 8 周：员工 15 + 员工 1（循环）

## 后续迭代计划

### 第二版：员工管理

- [ ] 员工 CRUD 功能
- [ ] 拖拽调整员工顺序
- [ ] 密码管理

### 第三版：邮件通知

- [ ] 邮件模板编辑
- [ ] 定时发送邮件（每周五下午 4 点）
- [ ] SMTP 配置

### 第四版：高级功能

- [ ] 手动调整本周值日
- [ ] 历史记录查看
- [ ] 数据统计

## 常见问题

### 1. 数据库连接失败？

检查 `backend/.env` 中的 `DATABASE_URL` 配置是否正确，确保 PostgreSQL 服务已启动。

### 2. 前端无法访问后端 API？

确保后端服务已启动（http://localhost:3000），检查 `frontend/.env` 中的 `VITE_API_BASE_URL` 配置。

### 3. 登录后提示 401 错误？

检查 JWT token 是否过期，尝试重新登录。

## 开发者

- 产品经理：ruthless-pm skill
- UI 设计师：ui-prompt-designer skill
- 全栈工程师：fullstack-engineer skill

## 许可证

MIT License
