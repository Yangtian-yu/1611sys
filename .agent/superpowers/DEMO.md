# Superpowers 实战演示

## 🎯 演示场景: 为 1611 值日系统添加"邮件通知"功能

让我们通过一个完整的实战案例,演示如何使用 Superpowers 工作流开发新功能。

---

## 📋 场景背景

**需求**: 实现每周五下午 4 点自动发送邮件提醒下周值日人员

**当前状态**:

- ✅ 基础值日系统已完成
- ✅ 用户登录和查看功能正常
- ❌ 没有邮件通知功能

---

## 🚀 完整开发流程

### 阶段 1: 需求澄清 (使用 /brainstorm)

#### 用户输入:

```
我想添加邮件通知功能
```

#### AI 应该提问:

**1. 邮件发送时机**

- Q: 是定时发送(如每周五)还是事件触发(如值日调整时)?
- A: 定时发送,每周五下午 4 点

**2. 邮件内容**

- Q: 需要包含哪些信息?
- A: 值日人员姓名、下周日期、值日注意事项

**3. 收件人**

- Q: 只发给值日人员,还是也发给管理员?
- A: 只发给下周值日人员

**4. SMTP 配置**

- Q: 使用哪个邮件服务商?
- A: QQ 邮箱

**5. 错误处理**

- Q: 如果邮件发送失败,需要重试吗?
- A: 需要,最多重试 3 次

#### AI 提出设计方案:

```markdown
# 设计方案: 邮件通知功能

## 架构设计

### 后端

1. 新增 `mail` 模块
   - MailService: 封装邮件发送逻辑
   - 使用 @nestjs-modules/mailer

2. 新增 `scheduler` 模块
   - DutySchedulerService: 定时任务服务
   - 使用 @nestjs/schedule

3. 修改 `duty` 模块
   - 添加 getNextWeekDuty() 方法

### 技术选型

- 邮件库: @nestjs-modules/mailer + nodemailer
- 定时任务: @nestjs/schedule
- 理由: NestJS 官方推荐,与现有技术栈一致

### 实现步骤

1. 安装依赖
2. 创建邮件模块 (TDD)
3. 创建定时任务模块 (TDD)
4. 配置 SMTP
5. 集成测试
6. 部署验证

### 风险和挑战

- 风险 1: SMTP 认证失败
  - 缓解: 提供详细的配置文档和错误提示
- 风险 2: 邮件被标记为垃圾邮件
  - 缓解: 使用企业邮箱,配置 SPF/DKIM

## 验收标准

- [ ] 每周五下午 4 点自动发送邮件
- [ ] 邮件内容正确
- [ ] 发送失败自动重试
- [ ] 有发送日志记录
```

#### 用户审阅: ✅ 批准

#### 保存设计文档:

```bash
docs/designs/email-notification.md
```

---

### 阶段 2: 任务规划 (使用 /plan)

#### 创建详细任务计划:

````markdown
# 功能计划: 邮件通知

## 任务列表

### 阶段 1: 准备工作 (10 分钟)

#### 任务 1.1: 安装邮件依赖

- **预计时间**: 2 分钟
- **命令**:
  ```bash
  cd backend
  pnpm add @nestjs-modules/mailer nodemailer
  pnpm add -D @types/nodemailer
  ```
````

- **验证**:
  - [ ] package.json 更新
  - [ ] 依赖安装成功

#### 任务 1.2: 安装定时任务依赖

- **预计时间**: 2 分钟
- **命令**:
  ```bash
  pnpm add @nestjs/schedule
  ```
- **验证**:
  - [ ] 依赖安装成功

#### 任务 1.3: 创建模块文件结构

- **预计时间**: 3 分钟
- **操作**: 创建以下文件

  ```
  backend/src/modules/mail/
  ├── mail.module.ts
  ├── mail.service.ts
  └── mail.service.spec.ts

  backend/src/modules/scheduler/
  ├── scheduler.module.ts
  ├── duty-scheduler.service.ts
  └── duty-scheduler.service.spec.ts
  ```

- **验证**:
  - [ ] 文件结构创建成功

#### 任务 1.4: 配置环境变量

- **预计时间**: 3 分钟
- **文件**: `backend/.env`
- **内容**:
  ```env
  SMTP_HOST=smtp.qq.com
  SMTP_PORT=587
  SMTP_USER=your-email@qq.com
  SMTP_PASS=your-smtp-password
  ```
- **验证**:
  - [ ] 环境变量添加成功

### 阶段 2: 邮件模块开发 (TDD) (20 分钟)

#### 任务 2.1: 编写邮件服务测试 (RED)

- **预计时间**: 4 分钟
- **文件**: `backend/src/modules/mail/mail.service.spec.ts`
- **代码**: [见完整代码]
- **验证**:
  - [ ] 运行测试失败 ❌ (RED)

#### 任务 2.2: 实现邮件服务 (GREEN)

- **预计时间**: 5 分钟
- **文件**: `backend/src/modules/mail/mail.service.ts`
- **代码**: [见完整代码]
- **验证**:
  - [ ] 运行测试通过 ✅ (GREEN)

#### 任务 2.3: 重构邮件服务 (REFACTOR)

- **预计时间**: 3 分钟
- **操作**: 提取邮件模板、添加错误处理
- **验证**:
  - [ ] 测试仍然通过 ✅

#### 任务 2.4: 创建邮件模块

- **预计时间**: 3 分钟
- **文件**: `backend/src/modules/mail/mail.module.ts`
- **验证**:
  - [ ] 模块创建成功
  - [ ] 编译无错误

### 阶段 3: 定时任务模块开发 (TDD) (15 分钟)

#### 任务 3.1: 编写定时任务测试 (RED)

...

#### 任务 3.2: 实现定时任务 (GREEN)

...

#### 任务 3.3: 重构定时任务 (REFACTOR)

...

### 阶段 4: 集成和测试 (10 分钟)

#### 任务 4.1: 注册模块到 AppModule

...

#### 任务 4.2: 手动测试邮件发送

...

#### 任务 4.3: 集成测试

...

## 预计总时间: 55 分钟

````

#### 保存任务计划:
```bash
docs/plans/email-notification-plan.md
````

---

### 阶段 3: 创建隔离环境 (使用 /worktree)

#### 执行命令:

```bash
# 1. 检查当前状态
git status
# 确保主分支干净

# 2. 创建 worktree
git worktree add -b feature/email-notification ../1611sys-email

# 3. 进入 worktree
cd ../1611sys-email

# 4. 安装依赖
cd backend && pnpm install
cd ../frontend && pnpm install

# 5. 运行测试验证基线
cd backend && pnpm test
# 所有测试应该通过 ✅
```

#### 验证清单:

- [x] Worktree 创建成功
- [x] 依赖安装完成
- [x] 基线测试通过

---

### 阶段 4: TDD 开发

#### 任务 2.1: 编写邮件服务测试 (RED)

**文件**: `backend/src/modules/mail/mail.service.spec.ts`

```typescript
import { Test } from "@nestjs/testing";
import { MailService } from "./mail.service";
import { MailerService } from "@nestjs-modules/mailer";

describe("MailService", () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  describe("sendDutyReminder", () => {
    it("应该成功发送值日提醒邮件", async () => {
      const mockData = {
        to: "test@example.com",
        username: "张三",
        weekStartDate: "2026-01-20",
      };

      jest.spyOn(mailerService, "sendMail").mockResolvedValue(null);

      const result = await service.sendDutyReminder(mockData);

      expect(result.success).toBe(true);
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: mockData.to,
        subject: "值日提醒 - 下周轮到您值日",
        html: expect.stringContaining(mockData.username),
      });
    });

    it("应该处理发送失败的情况", async () => {
      const mockData = {
        to: "test@example.com",
        username: "张三",
        weekStartDate: "2026-01-20",
      };

      jest
        .spyOn(mailerService, "sendMail")
        .mockRejectedValue(new Error("SMTP error"));

      const result = await service.sendDutyReminder(mockData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

**运行测试**:

```bash
cd backend
pnpm test mail.service.spec.ts
```

**预期结果**: ❌ 测试失败 (RED) - 因为 MailService 还不存在

---

#### 任务 2.2: 实现邮件服务 (GREEN)

**文件**: `backend/src/modules/mail/mail.service.ts`

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
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">值日提醒</h2>
            <p>您好,<strong>${data.username}</strong>!</p>
            <p>下周(<strong>${data.weekStartDate}</strong>)轮到您值日,请准时到岗。</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              此邮件由 1611 值日系统自动发送,请勿回复。
            </p>
          </div>
        `,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
```

**运行测试**:

```bash
pnpm test mail.service.spec.ts
```

**预期结果**: ✅ 测试通过 (GREEN)

---

#### 任务 2.3: 重构邮件服务 (REFACTOR)

**优化**: 提取邮件模板

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
        subject: this.getDutyReminderSubject(),
        html: this.getDutyReminderTemplate(data),
      });

      return { success: true };
    } catch (error) {
      console.error("邮件发送失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private getDutyReminderSubject(): string {
    return "值日提醒 - 下周轮到您值日";
  }

  private getDutyReminderTemplate(data: {
    username: string;
    weekStartDate: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">值日提醒</h2>
        <p>您好,<strong>${data.username}</strong>!</p>
        <p>下周(<strong>${data.weekStartDate}</strong>)轮到您值日,请准时到岗。</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          此邮件由 1611 值日系统自动发送,请勿回复。
        </p>
      </div>
    `;
  }
}
```

**运行测试**:

```bash
pnpm test mail.service.spec.ts
```

**预期结果**: ✅ 测试仍然通过

---

### 阶段 5: 完成开发

#### 所有任务完成后:

```bash
# 1. 运行所有测试
cd backend
pnpm test

# 2. 检查代码规范
pnpm lint

# 3. 提交代码
git add .
git commit -m "feat: 实现邮件通知功能

- 添加邮件模块 (MailService)
- 添加定时任务模块 (DutySchedulerService)
- 配置 SMTP 邮件发送
- 实现每周五下午 4 点自动发送提醒
- 测试覆盖率 > 85%
"

# 4. 返回主项目
cd ../../1611sys

# 5. 合并分支
git merge feature/email-notification

# 6. 运行测试确认
cd backend && pnpm test

# 7. 删除 worktree
git worktree remove ../1611sys-email

# 8. 删除分支 (可选)
git branch -d feature/email-notification
```

---

## 📊 开发总结

### 实际耗时

- 需求澄清: 10 分钟
- 任务规划: 15 分钟
- 环境准备: 5 分钟
- TDD 开发: 50 分钟
- 测试验证: 10 分钟
- **总计**: 90 分钟

### 交付物

- ✅ 邮件模块 (MailService)
- ✅ 定时任务模块 (DutySchedulerService)
- ✅ 单元测试 (覆盖率 > 85%)
- ✅ 集成测试
- ✅ 设计文档
- ✅ 任务计划文档

### 质量指标

- ✅ 所有测试通过
- ✅ 代码符合规范
- ✅ 功能符合需求
- ✅ 无已知 Bug

### 经验总结

**做得好的地方**:

1. ✅ 使用 `/brainstorm` 提前澄清需求,避免返工
2. ✅ 使用 `/plan` 详细分解任务,开发过程清晰
3. ✅ 使用 `/worktree` 隔离开发,主分支安全
4. ✅ 严格遵循 TDD,代码质量高

**可以改进的地方**:

1. 🟡 邮件模板可以更丰富
2. 🟡 可以添加邮件发送历史记录
3. 🟡 可以支持自定义邮件模板

---

## 🎯 关键收获

### 1. Brainstorm 的价值

- 提前发现需求不明确的地方
- 避免开发到一半才发现理解错误
- 设计文档成为重要的项目资产

### 2. Plan 的价值

- 任务分解让开发过程可控
- 时间估算帮助管理预期
- 验证步骤确保质量

### 3. Worktree 的价值

- 主分支始终保持稳定
- 可以随时切换回主分支处理紧急问题
- 失败了可以直接删除,无风险

### 4. TDD 的价值

- 测试先行确保功能正确
- 重构时有测试保护
- 代码质量和可维护性高

---

## 🚀 下一步

现在您已经看到了完整的 Superpowers 工作流,可以:

1. **实践**: 选择一个小功能,使用 Superpowers 工作流开发
2. **定制**: 根据团队需求调整工作流
3. **分享**: 将经验分享给团队成员
4. **优化**: 持续改进工作流程

**记住**: Superpowers 让 AI 从"工具"变成"协作伙伴"! 🚀
