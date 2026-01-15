# 1611 值日系统 - 项目开发历程

**项目名称**：1611 值日系统  
**开发时间**：2026-01-16  
**开发模式**：AI 辅助全栈开发

---

## 📋 项目概述

1611 值日系统是一个办公室值日管理系统，旨在解决传统 Excel 表格管理方式下员工容易忘记值日、人员变动时排班混乱等问题。通过自动化排班和邮件提醒，确保值日工作有序进行。

**核心价值：**

- 自动轮流制排班，公平公正
- 邮件自动提醒，不再遗忘
- 员工管理便捷，拖拽调整顺序

---

## 🎯 开发历程

### 第一阶段：需求收集（使用 ruthless-pm 技能）

**时间**：2026-01-16 01:32

**过程：**
用户提出想做一个值日管理系统，我激活了"毒舌产品经理"技能，通过深度追问收集需求细节。

**关键问题与回答：**

1. **排班规则？**

   - 轮流制，员工顺序可编辑
   - 每周 2 人值日
   - 支持临时调整（如 4 人大扫除）

2. **通知方式？**

   - 最初计划微信通知，后改为邮件发送
   - 每周五下午 4 点发送给所有人
   - 通知文案可编辑

3. **用户权限？**

   - 初始管理员账号（admin）
   - 管理员可创建员工账号、调整排班
   - 普通员工可查看所有人的排班

4. **技术约束？**
   - 使用云服务器（已购买）
   - 仅支持桌面端访问
   - 预算不限

**输出物：**

- `_Product-Spec.md` - 完整的产品规格文档

---

### 第二阶段：UI 设计（使用 ui-prompt-designer 技能）

**时间**：2026-01-16 01:50

**过程：**
基于产品规格文档，激活"UI 提示词设计师"技能，设计了 4 个核心页面的原型图。

**设计的页面：**

1. **登录页**

   - 简洁的登录界面
   - 系统标题 + 用户名密码输入框
   - Element Plus 风格

2. **值日排班查看页（员工视图）**

   - 顶部导航栏（系统名称、用户信息、退出登录）
   - 侧边栏菜单（值日安排、修改密码）
   - 主内容区：本周值日人员卡片

3. **员工管理页（管理员视图）**

   - 数据表格展示员工信息
   - 拖拽排序功能
   - 操作按钮：编辑、重置密码、删除

4. **邮件模板编辑页（管理员视图）**
   - 大文本框编辑邮件内容
   - 支持变量：{值日人员}、{日期}
   - 保存和测试发送按钮

**设计规范：**

- 配色：Element Plus 蓝（#409EFF）+ 白色 + 浅灰
- 字体：Sans-serif
- 风格：简洁专业的企业级应用

**输出物：**

- `UI-Prompts.md` - UI 提示词文档
- 4 张原型图（使用 Nano Banana Pro 生成）

---

### 第三阶段：技术方案设计（使用 fullstack-engineer 技能）

**时间**：2026-01-16 01:56

**过程：**
激活"全栈开发工程师"技能，确定技术栈和开发策略。

**技术栈选型：**

**前端：**

- Vue 3 + Composition API
- Vite 5（构建工具）
- TypeScript 5
- Tailwind CSS（样式）
- Element Plus（UI 组件库）
- Pinia（状态管理）
- Vue Router 4（路由）
- Axios（HTTP 请求）

**后端：**

- Nest.js 10
- Prisma（ORM）
- PostgreSQL（数据库）
- JWT（认证）
- bcrypt（密码加密）

**部署：**

- Docker + Docker Compose
- Nginx（前端静态文件服务）

**开发策略：**

- 方案 B：核心功能优先
- 先实现登录 + 值日查看
- 后续迭代添加员工管理、邮件通知

**输出物：**

- `implementation_plan.md` - 实施计划文档

---

### 第四阶段：代码实现

**时间**：2026-01-16 02:02 - 02:09

**实现内容：**

#### 后端开发（17 个文件）

**配置文件：**

- `package.json` - 项目依赖
- `.env` - 环境变量
- `tsconfig.json` - TypeScript 配置
- `nest-cli.json` - Nest CLI 配置

**数据库：**

- `prisma/schema.prisma` - 数据库 Schema
  - users 表：用户信息 + 值日顺序
  - duty_schedules 表：每周排班记录
- `prisma/seed.ts` - 种子数据（管理员 + 测试账号）

**认证模块（Auth）：**

- `auth.module.ts` - 模块定义
- `auth.service.ts` - 登录验证、JWT 生成
- `auth.controller.ts` - 登录接口
- `dto/login.dto.ts` - 登录数据验证
- `strategies/jwt.strategy.ts` - JWT 策略
- `guards/jwt-auth.guard.ts` - 路由守卫

**值日模块（Duty）：**

- `duty.module.ts` - 模块定义
- `duty.service.ts` - 自动排班逻辑（轮流制算法）
- `duty.controller.ts` - 查询接口

**主应用：**

- `app.module.ts` - 主模块
- `main.ts` - 应用入口

#### 前端开发（18 个文件）

**配置文件：**

- `package.json` - 项目依赖
- `.env` - 环境变量
- `vite.config.ts` - Vite 配置
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.js` - Tailwind CSS 配置
- `postcss.config.js` - PostCSS 配置
- `index.html` - HTML 入口

**类型定义：**

- `types/index.ts` - TypeScript 接口定义

**API 层：**

- `api/client.ts` - Axios 实例（请求/响应拦截器）
- `api/auth.ts` - 认证 API
- `api/duty.ts` - 值日 API

**状态管理：**

- `stores/auth.ts` - Pinia Store（登录状态、Token 管理）

**路由：**

- `router/index.ts` - 路由配置 + 路由守卫

**页面组件：**

- `views/Login.vue` - 登录页
- `views/DutySchedule.vue` - 值日查看页

**应用入口：**

- `App.vue` - 根组件
- `main.ts` - 应用入口
- `style.css` - 全局样式

---

### 第五阶段：Docker 容器化

**时间**：2026-01-16 02:09

**实现内容：**

**Docker 配置文件：**

- `docker-compose.yml` - 编排前端、后端、数据库三个服务
- `backend/Dockerfile` - 后端镜像（多阶段构建）
- `frontend/Dockerfile` - 前端镜像（Nginx 提供服务）
- `frontend/nginx.conf` - Nginx 配置（路由处理 + API 代理）
- `.dockerignore` - 构建排除文件

**启动脚本：**

- `start.bat` - Windows 一键启动
- `start.sh` - Linux/Mac 一键启动

**特性：**

- 一键启动所有服务
- 自动数据库迁移和种子数据
- 数据持久化（PostgreSQL 数据卷）
- Nginx 反向代理和静态文件服务

**输出物：**

- `DOCKER.md` - Docker 部署文档

---

### 第六阶段：依赖安装

**时间**：2026-01-16 02:11 - 02:20

**安装内容：**

- 后端依赖：516 个包（6 分钟）
- 前端依赖：167 个包

**主要依赖：**

**后端：**

- @nestjs/core, @nestjs/common
- @prisma/client, prisma
- passport, passport-jwt
- bcrypt, class-validator

**前端：**

- vue, vue-router, pinia
- element-plus
- axios
- tailwindcss

---

## 🎨 核心技术亮点

### 1. 自动排班算法

```typescript
// 轮流制逻辑实现
private async generateWeeklySchedule(weekStartDate: Date) {
  // 1. 获取所有员工（按 orderIndex 排序）
  const allUsers = await this.prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    orderBy: { orderIndex: 'asc' },
  });

  // 2. 获取上周排班记录
  const lastSchedule = await this.prisma.dutySchedule.findFirst({
    where: { weekStartDate: lastWeek },
  });

  // 3. 找到上周最后一个值日人员的位置
  const lastIndex = allUsers.findIndex(u => u.id === lastDutyUserId);

  // 4. 从下一个位置开始取2人（循环处理）
  const nextIndex = (lastIndex + 1) % allUsers.length;
  const secondIndex = (lastIndex + 2) % allUsers.length;

  dutyUserIds = [allUsers[nextIndex].id, allUsers[secondIndex].id];
}
```

### 2. JWT 认证流程

```
用户登录 → 验证密码 → 生成 JWT Token → 前端存储
    ↓
前端请求 → 自动添加 Token → 后端验证 → 返回数据
    ↓
Token 过期/无效 → 401 响应 → 自动跳转登录页
```

### 3. 路由守卫

```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !authStore.isAuthenticated()) {
    next("/login"); // 未登录跳转登录页
  } else if (to.path === "/login" && authStore.isAuthenticated()) {
    next("/duty"); // 已登录跳转主页
  } else {
    next();
  }
});
```

### 4. Docker 多阶段构建

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build

# 生产阶段
FROM node:20-alpine
WORKDIR /app
RUN pnpm install --prod
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
```

---

## 📊 项目统计

### 代码文件统计

- **后端文件**：17 个
- **前端文件**：18 个
- **配置文件**：9 个
- **文档文件**：5 个
- **总计**：49 个文件

### 代码行数（估算）

- **后端代码**：~800 行
- **前端代码**：~600 行
- **配置文件**：~300 行
- **总计**：~1700 行

### 依赖包数量

- **后端依赖**：516 个包
- **前端依赖**：167 个包
- **总计**：683 个包

---

## 🚀 使用的 AI 技能

本项目开发过程中使用了三个专业 AI 技能：

### 1. ruthless-pm（毒舌产品经理）

**作用**：需求收集与细节追问  
**使用场景**：项目立项阶段  
**输出**：`_Product-Spec.md`

**特点：**

- 深度挖掘需求，追问细节
- 识别伪需求和潜在问题
- 确保需求明确、可执行

### 2. ui-prompt-designer（UI 提示词设计师）

**作用**：UI 原型图设计  
**使用场景**：需求明确后的设计阶段  
**输出**：`UI-Prompts.md` + 4 张原型图

**特点：**

- 将需求转化为精准的图像生成提示词
- 使用 Nano Banana Pro 生成高保真原型图
- 遵循 Element Plus 设计规范

### 3. fullstack-engineer（全栈开发工程师）

**作用**：前后端代码实现  
**使用场景**：设计完成后的开发阶段  
**输出**：完整的前后端代码

**特点：**

- 精通 Vue 3 + Nest.js 技术栈
- 遵循最佳实践和代码规范
- 实现核心功能优先策略

---

## 📝 生成的文档

### 产品文档

1. **\_Product-Spec.md** - 产品规格文档

   - 项目概述
   - 功能需求（P0/P1/P2）
   - 用户故事
   - 技术约束
   - 验收标准

2. **UI-Prompts.md** - UI 设计文档
   - 设计规范
   - 4 个页面的提示词
   - 原型图

### 技术文档

3. **implementation_plan.md** - 实施计划

   - 项目结构
   - 数据库设计
   - API 设计
   - 前端实现
   - 开发步骤

4. **README.md** - 项目说明

   - 快速开始（Docker + 本地开发）
   - API 接口文档
   - 测试账号
   - 常见问题

5. **DOCKER.md** - Docker 部署文档

   - 服务架构
   - 配置说明
   - 常用命令
   - 故障排查

6. **walkthrough.md** - 开发完成总结
   - 已完成的工作
   - 技术亮点
   - 下一步操作

---

## 🎯 项目成果

### 已实现的功能

- ✅ 用户登录认证（JWT）
- ✅ 密码加密存储（bcrypt）
- ✅ 查看本周值日安排
- ✅ 自动轮流制排班
- ✅ 路由权限保护
- ✅ Docker 一键部署

### 待实现的功能（后续迭代）

- ⏳ 员工管理（CRUD、拖拽排序）
- ⏳ 邮件通知（定时发送）
- ⏳ 手动调整排班
- ⏳ 历史记录查看
- ⏳ 数据统计

---

## 💡 开发心得

### 成功经验

1. **需求先行**

   - 通过深度追问，避免了需求模糊导致的返工
   - 明确了优先级（P0/P1/P2），聚焦核心功能

2. **设计驱动**

   - 先设计 UI 原型，再编码实现
   - 确保了前端页面符合预期

3. **核心功能优先**

   - 采用方案 B（核心功能优先）
   - 快速验证可行性，降低风险

4. **容器化部署**
   - Docker 一键启动，降低部署门槛
   - 环境一致性，避免"在我机器上能跑"问题

### 技术选型理由

1. **Vue 3 vs React**

   - 用户明确要求 Vue 3 全家桶
   - Composition API 更适合复杂状态管理

2. **Nest.js vs Express**

   - Nest.js 提供完整的企业级架构
   - 内置依赖注入、模块化设计
   - TypeScript 原生支持

3. **Prisma vs TypeORM**

   - Prisma 提供类型安全的查询
   - 自动生成 TypeScript 类型
   - 迁移管理更简单

4. **Element Plus vs Ant Design Vue**
   - Element Plus 是 Vue 3 生态的首选
   - 组件丰富、文档完善
   - 符合国内用户习惯

---

## 🔮 未来展望

### 短期计划（1-2 周）

1. 实现员工管理功能
2. 集成邮件通知
3. 添加单元测试

### 中期计划（1-2 月）

1. 手动调整排班功能
2. 历史记录查看
3. 数据导出（Excel）

### 长期计划（3-6 月）

1. 移动端适配
2. 暗色模式
3. 多语言支持
4. 性能优化

---

## 📞 联系方式

如有问题或建议，请参考以下文档：

- 使用说明：`README.md`
- Docker 部署：`DOCKER.md`
- 开发总结：`walkthrough.md`

---

**项目开发完成时间**：2026-01-16 02:20  
**总耗时**：约 50 分钟  
**开发模式**：AI 辅助全栈开发  
**AI 技能**：ruthless-pm + ui-prompt-designer + fullstack-engineer
