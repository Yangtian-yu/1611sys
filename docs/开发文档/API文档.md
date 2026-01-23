# API 接口文档

1611 值日系统后端 API 接口说明。

**Base URL**: `http://localhost:3000/api` (开发环境)

---

## 🔐 认证说明

除了登录接口，其他接口都需要在请求头中携带 JWT Token：

```
Authorization: Bearer {token}
```

---

## 📋 接口列表

### 认证模块 (Auth)

#### POST /auth/login

用户登录

**请求体**：

```json
{
  "username": "admin",
  "password": "Admin@1611"
}
```

**响应**：

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

#### POST /auth/change-password

修改当前用户密码（需要认证）

**请求头**：
```
Authorization: Bearer {token}
```

**请求体**：

```json
{
  "oldPassword": "Admin@1611",
  "newPassword": "NewPassword@123"
}
```

**响应**：

```json
{
  "success": true,
  "message": "密码修改成功"
}
```

---

### 值日模块 (Duty)

#### GET /duty/current

获取本周值日安排（需要认证）

**请求头**：
```
Authorization: Bearer {token}
```

**响应**：

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

---

### 用户模块 (Users)

#### GET /users

获取所有用户列表（需要管理员权限）

**请求头**：
```
Authorization: Bearer {token}
```

**响应**：

```json
[
  {
    "id": "uuid",
    "username": "李明",
    "email": "liming@qq.com",
    "role": "EMPLOYEE",
    "orderIndex": 1,
    "isActive": true,
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z"
  }
]
```

#### POST /users

创建新用户（需要管理员权限）

**请求头**：
```
Authorization: Bearer {token}
```

**请求体**：

```json
{
  "username": "张三",
  "password": "123456",
  "email": "zhangsan@qq.com"
}
```

**响应**：

```json
{
  "id": "uuid",
  "username": "张三",
  "email": "zhangsan@qq.com",
  "role": "EMPLOYEE",
  "orderIndex": 16,
  "isActive": true,
  "createdAt": "2026-01-23T10:00:00.000Z"
}
```

#### PUT /users/:id

更新用户信息（需要管理员权限）

**请求头**：
```
Authorization: Bearer {token}
```

**请求体**：

```json
{
  "username": "李明",
  "email": "liming@qq.com",
  "isActive": true
}
```

**响应**：

```json
{
  "id": "uuid",
  "username": "李明",
  "email": "liming@qq.com",
  "role": "EMPLOYEE",
  "orderIndex": 1,
  "isActive": true,
  "updatedAt": "2026-01-23T10:00:00.000Z"
}
```

#### DELETE /users/:id

删除用户（需要管理员权限）

**请求头**：
```
Authorization: Bearer {token}
```

**响应**：

```json
{
  "success": true,
  "message": "用户删除成功"
}
```

#### POST /users/:id/reset-password

重置用户密码（需要管理员权限）

**请求头**：
```
Authorization: Bearer {token}
```

**请求体**：

```json
{
  "newPassword": "123456"
}
```

**响应**：

```json
{
  "success": true,
  "message": "密码重置成功"
}
```

#### PUT /users/reorder/batch

批量调整用户值日顺序（需要管理员权限）

**请求头**：
```
Authorization: Bearer {token}
```

**请求体**：

```json
{
  "userIds": ["uuid1", "uuid2", "uuid3", ...]
}
```

**响应**：

```json
{
  "success": true,
  "message": "顺序调整成功"
}
```

---

### 健康检查

#### GET /health

检查服务健康状态（无需认证）

**响应**：

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  }
}
```

---

## 🔢 数据库 Schema

### users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| username | String | 用户名（唯一） |
| password | String | 密码（bcrypt 加密） |
| email | String | 邮箱 |
| role | Enum | 角色（ADMIN / EMPLOYEE） |
| orderIndex | Integer | 值日顺序 |
| isActive | Boolean | 是否激活 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### duty_schedules 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| weekStartDate | DateTime | 周一日期 |
| dutyUserIds | String[] | 值日人员 ID 数组 |
| isManual | Boolean | 是否手动调整 |
| createdAt | DateTime | 创建时间 |

---

## 🧮 排班逻辑

系统采用**轮流制**自动排班：

1. 每周一自动生成本周排班
2. 按员工的 `orderIndex` 顺序轮流
3. 每周取 2 个员工值日
4. 示例（假设有 15 个员工）：
   - 第 1 周：员工 1 + 员工 2
   - 第 2 周：员工 3 + 员工 4
   - ...
   - 第 8 周：员工 15 + 员工 1（循环）

---

## ⚠️ 错误码说明

| HTTP 状态码 | 说明 |
|------------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或 Token 无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

**错误响应示例**：

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## 🧪 测试示例

### 使用 curl

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@1611"}'

# 获取值日安排（需要先登录获取 token）
curl -X GET http://localhost:3000/api/duty/current \
  -H "Authorization: Bearer YOUR_TOKEN"

# 健康检查
curl http://localhost:3000/api/health
```

### 使用 JavaScript (Axios)

```javascript
import axios from 'axios';

// 登录
const login = async () => {
  const response = await axios.post('http://localhost:3000/api/auth/login', {
    username: 'admin',
    password: 'Admin@1611'
  });
  return response.data.data.accessToken;
};

// 获取值日安排
const getDuty = async (token) => {
  const response = await axios.get('http://localhost:3000/api/duty/current', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};
```

---

## 📚 相关文档

- [快速开始](./快速开始.md) - 搭建开发环境
- [产品规格](./产品规格.md) - 业务需求和设计
- [贡献指南](./贡献指南.md) - 参与项目开发
