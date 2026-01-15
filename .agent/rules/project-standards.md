# 项目开发规范与标准

本规则文件定义了项目的技术栈、代码规范和工作流程，确保开发的一致性和高质量。

## 技术栈

### 前端

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite 5+
- **语言**：TypeScript 5+
- **样式**：Tailwind CSS
- **UI 组件库**：Element Plus
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **表单处理**：VeeValidate + Zod
- **数据请求**：TanStack Query (Vue Query) 或 Axios

### 后端

- **运行时**：Node.js 20+
- **框架**：Nest.js 10+
- **数据库**：PostgreSQL (主库) + Redis (缓存)
- **ORM**：Prisma 或 TypeORM
- **认证**：Passport.js + JWT

### DevOps

- **包管理器**：pnpm
- **代码检查**：ESLint + Prettier
- **类型检查**：TypeScript strict mode
- **测试**：Vitest (单元) + Playwright (E2E)
- **部署**：Vercel (优先) 或 Railway

## 代码规范

### 命名约定

- **文件名**：kebab-case（如 `user-profile.tsx`）
- **组件名**：PascalCase（如 `UserProfile`）
- **函数/变量**：camelCase（如 `fetchUserData`）
- **常量**：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **类型/接口**：PascalCase（如 `UserData`）

### 目录结构

#### 前端目录结构 (Vue 3 + Vite)

```
/src
  /views            # 页面组件
    /auth           # 认证相关页面
    /dashboard      # 仪表盘页面
  /components       # 可复用组件
    /common         # 通用组件
    /features       # 功能组件
  /composables      # 组合式函数 (Composables)
  /stores           # Pinia 状态管理
  /router           # Vue Router 配置
  /api              # API 请求封装
  /utils            # 工具函数
  /types            # TypeScript 类型定义
  /assets           # 静态资源
  App.vue           # 根组件
  main.ts           # 入口文件
/public             # 公共静态资源
```

#### 后端目录结构 (Nest.js)

```
/src
  /modules          # 功能模块
    /auth           # 认证模块
    /users          # 用户模块
  /common           # 公共模块
    /guards         # 守卫
    /interceptors   # 拦截器
    /decorators     # 装饰器
  /config           # 配置文件
  /database         # 数据库相关
  main.ts           # 入口文件
```

### TypeScript 规范

- **严格模式**：启用 `strict: true`
- **类型优先**：优先使用 `interface` 定义对象类型，`type` 用于联合类型
- **避免 any**：使用 `unknown` 或具体类型
- **Props 类型**：所有组件必须定义 Props 接口

```typescript
// ✅ 推荐
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onEdit?: () => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  // ...
}

// ❌ 避免
export function UserCard(props: any) {
  // ...
}
```

### Vue 组件规范

- **Composition API**：优先使用 Composition API（`<script setup>`）
- **组件拆分**：单个组件不超过 200 行，复杂逻辑提取为 Composable
- **Props 定义**：使用 `defineProps` 和 TypeScript 类型
- **命名导出**：页面组件使用默认导出

```vue
<!-- ✅ 页面组件 -->
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div>Dashboard</div>
</template>

<!-- ✅ 可复用组件 -->
<script setup lang="ts">
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

defineProps<ButtonProps>();
</script>

<template>
  <el-button @click="onClick">{{ label }}</el-button>
</template>
```

### 样式规范

- **Tailwind 优先**：使用 Tailwind 实用类
- **Element Plus 主题**：通过 CSS 变量自定义 Element Plus 主题
- **响应式**：移动优先，使用 `sm:`, `md:`, `lg:` 断点
- **暗色模式**：使用 `dark:` 前缀支持暗色主题

```vue
<script setup lang="ts">
import { computed } from "vue";

interface CardProps {
  className?: string;
}

const props = defineProps<CardProps>();

const cardClass = computed(() => [
  "rounded-lg border bg-white p-6 shadow-sm",
  "dark:bg-gray-800 dark:border-gray-700",
  props.className,
]);
</script>

<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>
```

## 数据库规范

### Prisma Schema 约定

- **模型名**：单数形式，PascalCase（如 `User`, `Post`）
- **字段名**：camelCase（如 `createdAt`, `userId`）
- **关系字段**：使用有意义的名称（如 `author` 而非 `user`）
- **时间戳**：所有表必须包含 `createdAt` 和 `updatedAt`

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
```

### 查询优化

- **选择字段**：使用 `select` 只查询需要的字段
- **关联查询**：使用 `include` 预加载关联数据，避免 N+1 问题
- **分页**：使用 `skip` 和 `take` 实现分页
- **索引**：为常用查询字段添加索引

## API 设计规范

### RESTful 约定

- **GET**：获取资源（幂等）
- **POST**：创建资源
- **PUT/PATCH**：更新资源
- **DELETE**：删除资源

### 响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": { /* 实际数据 */ }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { /* 详细错误信息 */ }
  }
}
```

### 错误处理

- **输入验证**：使用 class-validator 和 class-transformer 验证 DTO
- **错误码**：定义统一的错误码常量
- **日志记录**：使用 Nest.js 内置 Logger 记录所有服务器错误

```typescript
// dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}

// users.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { success: true, data: user };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Something went wrong",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
```

## Git 工作流

### 分支策略

- **main**：生产环境分支，受保护
- **develop**：开发分支
- **feature/\***：功能分支（如 `feature/user-auth`）
- **fix/\***：修复分支（如 `fix/login-bug`）

### 提交规范（Conventional Commits）

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)：**

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具配置

**示例：**

```
feat(auth): add Google OAuth login

Implement Google OAuth 2.0 authentication using NextAuth.js.
Users can now sign in with their Google accounts.

Closes #123
```

## 性能优化原则

1. **代码分割**：使用 Vue Router 的懒加载和动态导入
2. **图片优化**：使用现代图片格式（WebP）和懒加载
3. **组件懒加载**：使用 `defineAsyncComponent` 延迟加载非关键组件
4. **缓存策略**：合理使用 Vue Query 缓存和 Redis
5. **Bundle 分析**：使用 `rollup-plugin-visualizer` 检查包体积

## 安全规范

- **环境变量**：敏感信息存储在 `.env`，不提交到 Git
- **CSRF 保护**：使用 Nest.js 的 CSRF 中间件
- **XSS 防护**：Vue 3 默认转义输出，避免使用 `v-html` 处理不可信内容
- **SQL 注入**：使用 Prisma/TypeORM 参数化查询
- **权限控制**：实现基于角色的访问控制 (RBAC)，使用 Nest.js Guards

## 测试策略

### 单元测试（Vitest）

- 测试纯函数和工具函数
- 测试 Composables 和 Pinia stores
- 覆盖率目标：核心业务逻辑 > 80%

### E2E 测试（Playwright）

- 测试关键用户流程（注册、登录、核心功能）
- 在 CI/CD 中自动运行

## 部署检查清单

- [ ] 环境变量已配置
- [ ] 数据库迁移已执行
- [ ] 类型检查通过 (`pnpm tsc --noEmit`)
- [ ] Lint 检查通过 (`pnpm lint`)
- [ ] 构建成功 (`pnpm build`)
- [ ] E2E 测试通过
- [ ] 性能指标达标（Lighthouse > 90）
