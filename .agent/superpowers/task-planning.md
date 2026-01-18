---
name: 任务规划与分解
description: 将复杂任务分解为 2-5 分钟的小任务,详细规划实现步骤
category: superpowers
---

# 任务规划与分解技能

## 🎯 技能目标

将复杂的开发任务分解为可管理的小任务,每个任务预计耗时 2-5 分钟,确保开发过程可控、可验证。

## 📋 规划模板

### 任务分解格式

````markdown
# 功能: [功能名称]

## 总体目标

[简要描述要实现的功能]

## 前置条件

- [ ] 条件 1
- [ ] 条件 2

## 任务列表

### 任务 1: [任务名称]

- **预计时间**: 3 分钟
- **文件**: `path/to/file.ts`
- **操作**: 创建/修改/删除
- **内容**:
  ```typescript
  // 具体代码
  ```
````

- **验证**:
  - [ ] 运行测试通过
  - [ ] 编译无错误

### 任务 2: [任务名称]

...

## 验收标准

- [ ] 所有测试通过
- [ ] 功能符合需求
- [ ] 代码审查通过

````

## 🎯 实战示例: 为 1611 值日系统添加"邮件通知"功能

### 功能: 邮件通知系统

#### 总体目标
实现每周五下午 4 点自动发送邮件提醒下周值日人员

#### 前置条件
- [x] 后端项目已运行
- [x] 数据库已配置
- [ ] SMTP 服务器信息已准备

#### 任务分解

##### 任务 1: 安装邮件依赖
- **预计时间**: 2 分钟
- **文件**: `backend/package.json`
- **操作**: 修改
- **命令**:
  ```bash
  cd backend
  pnpm add @nestjs-modules/mailer nodemailer
  pnpm add -D @types/nodemailer
````

- **验证**:
  - [ ] 依赖安装成功
  - [ ] package.json 更新

##### 任务 2: 创建邮件模块

- **预计时间**: 3 分钟
- **文件**: `backend/src/modules/mail/mail.module.ts`
- **操作**: 创建
- **内容**:

  ```typescript
  import { Module } from "@nestjs/common";
  import { MailerModule } from "@nestjs-modules/mailer";
  import { MailService } from "./mail.service";

  @Module({
    imports: [
      MailerModule.forRoot({
        transport: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      }),
    ],
    providers: [MailService],
    exports: [MailService],
  })
  export class MailModule {}
  ```

- **验证**:
  - [ ] 文件创建成功
  - [ ] 编译无错误

##### 任务 3: 编写邮件服务测试 (TDD - RED)

- **预计时间**: 4 分钟
- **文件**: `backend/src/modules/mail/mail.service.spec.ts`
- **操作**: 创建
- **内容**:

  ```typescript
  import { Test } from "@nestjs/testing";
  import { MailService } from "./mail.service";

  describe("MailService", () => {
    let service: MailService;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [MailService],
      }).compile();

      service = module.get<MailService>(MailService);
    });

    it("应该发送值日提醒邮件", async () => {
      const result = await service.sendDutyReminder({
        to: "test@example.com",
        username: "张三",
        weekStartDate: "2026-01-20",
      });

      expect(result.success).toBe(true);
    });
  });
  ```

- **验证**:
  - [ ] 测试文件创建
  - [ ] 运行测试失败 (RED) ✅

##### 任务 4: 实现邮件服务 (TDD - GREEN)

- **预计时间**: 5 分钟
- **文件**: `backend/src/modules/mail/mail.service.ts`
- **操作**: 创建
- **内容**:

  ```typescript
  import { Injectable } from "@nestjs/common";
  import { MailerService } from "@nestjs-modules/mailer";

  @Injectable()
  export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendDutyReminder(data: {
      to: string;
      username: string;
      weekStartDate: string;
    }) {
      try {
        await this.mailerService.sendMail({
          to: data.to,
          subject: "值日提醒 - 下周轮到您值日",
          html: `
            <h2>值日提醒</h2>
            <p>您好,${data.username}!</p>
            <p>下周(${data.weekStartDate})轮到您值日,请准时到岗。</p>
          `,
        });

        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }
  ```

- **验证**:
  - [ ] 运行测试通过 (GREEN) ✅
  - [ ] 编译无错误

##### 任务 5: 创建定时任务模块

- **预计时间**: 3 分钟
- **文件**: `backend/src/modules/scheduler/scheduler.module.ts`
- **操作**: 创建
- **命令**:
  ```bash
  pnpm add @nestjs/schedule
  ```
- **内容**:

  ```typescript
  import { Module } from "@nestjs/common";
  import { ScheduleModule } from "@nestjs/schedule";
  import { DutySchedulerService } from "./duty-scheduler.service";
  import { MailModule } from "../mail/mail.module";
  import { DutyModule } from "../duty/duty.module";

  @Module({
    imports: [ScheduleModule.forRoot(), MailModule, DutyModule],
    providers: [DutySchedulerService],
  })
  export class SchedulerModule {}
  ```

- **验证**:
  - [ ] 依赖安装成功
  - [ ] 模块创建成功

##### 任务 6: 实现定时任务服务

- **预计时间**: 5 分钟
- **文件**: `backend/src/modules/scheduler/duty-scheduler.service.ts`
- **操作**: 创建
- **内容**:

  ```typescript
  import { Injectable } from "@nestjs/common";
  import { Cron, CronExpression } from "@nestjs/schedule";
  import { MailService } from "../mail/mail.service";
  import { DutyService } from "../duty/duty.service";

  @Injectable()
  export class DutySchedulerService {
    constructor(
      private mailService: MailService,
      private dutyService: DutyService,
    ) {}

    // 每周五下午 4 点执行
    @Cron("0 16 * * 5")
    async sendWeeklyReminder() {
      const nextWeekDuty = await this.dutyService.getNextWeekDuty();

      for (const user of nextWeekDuty.dutyUsers) {
        await this.mailService.sendDutyReminder({
          to: user.email,
          username: user.username,
          weekStartDate: nextWeekDuty.weekStartDate,
        });
      }
    }
  }
  ```

- **验证**:
  - [ ] 编译无错误
  - [ ] Cron 表达式正确

##### 任务 7: 更新环境变量

- **预计时间**: 2 分钟
- **文件**: `backend/.env`
- **操作**: 修改
- **内容**:
  ```env
  # 邮件配置
  SMTP_HOST=smtp.qq.com
  SMTP_PORT=587
  SMTP_USER=your-email@qq.com
  SMTP_PASS=your-smtp-password
  ```
- **验证**:
  - [ ] 环境变量添加成功

##### 任务 8: 注册模块到 AppModule

- **预计时间**: 2 分钟
- **文件**: `backend/src/app.module.ts`
- **操作**: 修改
- **内容**:

  ```typescript
  import { SchedulerModule } from "./modules/scheduler/scheduler.module";

  @Module({
    imports: [
      // ... 其他模块
      SchedulerModule,
    ],
  })
  export class AppModule {}
  ```

- **验证**:
  - [ ] 编译无错误
  - [ ] 应用启动成功

##### 任务 9: 集成测试

- **预计时间**: 3 分钟
- **文件**: `backend/src/modules/scheduler/duty-scheduler.service.spec.ts`
- **操作**: 创建
- **内容**:

  ```typescript
  describe("DutySchedulerService", () => {
    it("应该在周五下午 4 点发送邮件", async () => {
      const service = new DutySchedulerService(mailService, dutyService);

      await service.sendWeeklyReminder();

      expect(mailService.sendDutyReminder).toHaveBeenCalledTimes(2);
    });
  });
  ```

- **验证**:
  - [ ] 测试通过
  - [ ] Mock 正确

##### 任务 10: 手动测试

- **预计时间**: 5 分钟
- **操作**: 手动触发
- **命令**:

  ```bash
  # 临时修改 Cron 为每分钟执行
  @Cron('* * * * *')

  # 启动服务观察日志
  pnpm start:dev
  ```

- **验证**:
  - [ ] 邮件成功发送
  - [ ] 收到邮件内容正确

#### 验收标准

- [ ] 所有单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试邮件发送成功
- [ ] 代码符合 ESLint 规范
- [ ] 已添加错误处理
- [ ] 已更新文档

#### 预计总时间

34 分钟 (10 个任务)

## 📊 任务分解原则

### 1. SMART 原则

- **Specific**: 任务具体明确
- **Measurable**: 可验证完成
- **Achievable**: 2-5 分钟可完成
- **Relevant**: 与目标相关
- **Time-bound**: 有明确时间限制

### 2. 依赖管理

- 按依赖顺序排列任务
- 标注任务间的依赖关系
- 优先完成基础任务

### 3. 验证优先

- 每个任务都有验证步骤
- 使用 TDD 确保质量
- 及时发现问题

## 💡 最佳实践

1. **小步快跑**: 任务越小越好
2. **频繁验证**: 每个任务完成后立即验证
3. **文档先行**: 先写计划再执行
4. **灵活调整**: 根据实际情况调整计划

## 🔗 与其他技能集成

- **TDD 工作流**: 每个任务遵循 RED-GREEN-REFACTOR
- **Git Worktrees**: 在隔离环境中执行任务
- **代码审查**: 任务完成后进行审查

## 📚 任务规划模板库

在 `.agent/superpowers/templates/` 目录下可以创建常用任务模板:

- `feature-template.md` - 新功能开发模板
- `bugfix-template.md` - Bug 修复模板
- `refactor-template.md` - 重构模板
- `api-template.md` - API 开发模板
