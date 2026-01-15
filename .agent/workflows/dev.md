---
description: 基于 Product-Spec.md 开始开发项目代码
---

# DEV 工作流：项目开发

本工作流将激活"全栈开发工程师"技能，根据产品规格文档进行完整的项目开发。

## 前置条件

- ✅ 必须存在 `_Product-Spec.md` 文件

## 执行步骤

1. **读取产品规格文档**

   - 自动读取 `_Product-Spec.md`
   - 理解功能需求和技术约束

2. **激活全栈开发工程师技能**

   - 使用 `fullstack-engineer` 技能
   - 遵循项目规则文件中的技术栈规范

3. **项目初始化**（如果是新项目）

   - 创建 Vue 3 + Vite 前端项目
   - 创建 Nest.js 后端项目
   - 配置 Tailwind CSS 和 Element Plus
   - 配置 Prisma/TypeORM 数据库

4. **数据库设计**

   - 根据需求设计数据库 Schema
   - 创建 Prisma schema 或 TypeORM entities
   - 生成数据库迁移文件

5. **后端开发**（按优先级）

   - 创建核心模块（auth, users 等）
   - 实现 RESTful API
   - 添加输入验证（class-validator）
   - 实现认证和权限控制

6. **前端开发**（按优先级）

   - 创建页面组件（views）
   - 创建可复用组件（components）
   - 实现状态管理（Pinia stores）
   - 配置路由（Vue Router）
   - 对接后端 API

7. **功能迭代顺序**

   - P0 功能：核心功能 + 基础 UI
   - P1 功能：重要增强功能
   - P2 功能：锦上添花功能

8. **代码质量保证**
   - 遵循命名规范
   - 添加 TypeScript 类型定义
   - 编写必要的注释
   - 实现错误处理

## 开发过程中的检查点

- [ ] 数据库 Schema 设计完成
- [ ] 后端 API 核心接口完成
- [ ] 前端页面路由配置完成
- [ ] 用户认证流程完成
- [ ] 核心功能可运行

## 输出物

- 完整的前后端项目代码
- 数据库迁移文件
- README.md（包含启动说明）
