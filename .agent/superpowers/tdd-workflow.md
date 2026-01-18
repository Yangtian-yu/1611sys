---
name: TDD 测试驱动开发
description: 强制执行 RED-GREEN-REFACTOR 循环,确保代码质量和测试覆盖
category: superpowers
---

# TDD 测试驱动开发技能

## 🎯 技能目标

通过测试驱动开发(TDD)方法,确保代码质量、功能正确性和可维护性。

## 🔴🟢🔵 RED-GREEN-REFACTOR 循环

### 🔴 RED - 编写失败的测试

**原则**: 先写测试,确保测试会失败

```typescript
// 示例: 为新功能编写测试 (backend/src/modules/duty/duty.service.spec.ts)
describe("DutyService", () => {
  it("应该正确计算下周值日人员", async () => {
    // Arrange
    const service = new DutyService();
    const currentWeek = new Date("2026-01-13");

    // Act
    const nextWeek = await service.getNextWeekDuty(currentWeek);

    // Assert
    expect(nextWeek.dutyUsers).toHaveLength(2);
    expect(nextWeek.weekStartDate).toBe("2026-01-20");
  });
});
```

**运行测试,确认失败**:

```bash
cd backend
pnpm test
# 应该看到测试失败 ❌
```

### 🟢 GREEN - 编写最小代码使测试通过

**原则**: 只写足够让测试通过的代码,不要过度设计

```typescript
// backend/src/modules/duty/duty.service.ts
export class DutyService {
  async getNextWeekDuty(currentWeek: Date) {
    // 最简单的实现
    const nextWeekDate = new Date(currentWeek);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);

    return {
      weekStartDate: nextWeekDate.toISOString().split("T")[0],
      dutyUsers: await this.getNextTwoUsers(),
    };
  }
}
```

**运行测试,确认通过**:

```bash
pnpm test
# 应该看到测试通过 ✅
```

### 🔵 REFACTOR - 重构优化

**原则**: 在测试通过的基础上优化代码,保持测试绿色

```typescript
// 重构: 提取日期计算逻辑
export class DutyService {
  async getNextWeekDuty(currentWeek: Date) {
    const nextWeekDate = this.calculateNextMonday(currentWeek);

    return {
      weekStartDate: this.formatDate(nextWeekDate),
      dutyUsers: await this.getNextTwoUsers(),
    };
  }

  private calculateNextMonday(date: Date): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + 7);
    return result;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}
```

**再次运行测试,确认仍然通过**:

```bash
pnpm test
# 测试应该仍然通过 ✅
```

## 📋 TDD 工作流检查清单

### 开始新功能前

- [ ] 明确功能需求
- [ ] 确定测试场景(正常/异常/边界)
- [ ] 准备测试数据

### 编写测试时

- [ ] 测试命名清晰(应该...when...then...)
- [ ] 使用 AAA 模式(Arrange-Act-Assert)
- [ ] 一个测试只验证一个行为
- [ ] 先运行测试,确认失败

### 编写实现时

- [ ] 只写足够通过测试的代码
- [ ] 避免过度设计
- [ ] 保持函数简单

### 重构时

- [ ] 每次重构后运行测试
- [ ] 提取重复代码
- [ ] 改善命名
- [ ] 优化性能

## 🎯 在 1611 值日系统中应用 TDD

### 后端 TDD 示例

#### 场景 1: 新增"手动调整值日"功能

```typescript
// 1. RED - 编写测试
describe('DutyService - 手动调整', () => {
  it('应该允许管理员手动调整本周值日人员', async () => {
    const service = new DutyService();
    const newDutyUserIds = ['user-id-1', 'user-id-3'];

    const result = await service.manualAdjustDuty('2026-01-13', newDutyUserIds);

    expect(result.isManual).toBe(true);
    expect(result.dutyUserIds).toEqual(newDutyUserIds);
  });
});

// 2. GREEN - 实现功能
async manualAdjustDuty(weekStartDate: string, userIds: string[]) {
  return await this.prisma.dutySchedule.create({
    data: {
      weekStartDate: new Date(weekStartDate),
      dutyUserIds: userIds,
      isManual: true
    }
  });
}

// 3. REFACTOR - 优化(添加验证)
async manualAdjustDuty(weekStartDate: string, userIds: string[]) {
  if (userIds.length !== 2) {
    throw new BadRequestException('必须选择2个值日人员');
  }

  return await this.prisma.dutySchedule.upsert({
    where: { weekStartDate: new Date(weekStartDate) },
    update: { dutyUserIds: userIds, isManual: true },
    create: {
      weekStartDate: new Date(weekStartDate),
      dutyUserIds: userIds,
      isManual: true
    }
  });
}
```

### 前端 TDD 示例

#### 场景 2: 测试 Pinia Store

```typescript
// 1. RED - 编写测试 (frontend/src/stores/__tests__/duty.spec.ts)
import { setActivePinia, createPinia } from "pinia";
import { useDutyStore } from "../duty";

describe("DutyStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("应该正确加载本周值日数据", async () => {
    const store = useDutyStore();

    await store.fetchCurrentDuty();

    expect(store.currentDuty).toBeDefined();
    expect(store.currentDuty.dutyUsers).toHaveLength(2);
  });
});

// 2. GREEN - 实现
export const useDutyStore = defineStore("duty", () => {
  const currentDuty = ref(null);

  async function fetchCurrentDuty() {
    const response = await dutyApi.getCurrentDuty();
    currentDuty.value = response.data;
  }

  return { currentDuty, fetchCurrentDuty };
});

// 3. REFACTOR - 添加错误处理
async function fetchCurrentDuty() {
  try {
    const response = await dutyApi.getCurrentDuty();
    currentDuty.value = response.data;
  } catch (error) {
    console.error("加载值日数据失败:", error);
    throw error;
  }
}
```

## 🔧 测试工具配置

### 后端 (Jest)

```json
// backend/package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

### 前端 (Vitest)

```json
// frontend/package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 📊 测试覆盖率目标

- **核心业务逻辑**: 90%+
- **API 接口**: 80%+
- **工具函数**: 100%
- **UI 组件**: 60%+

## 💡 最佳实践

1. **测试优先**: 永远先写测试
2. **小步前进**: 每次只添加一个小功能
3. **快速反馈**: 使用 watch 模式持续运行测试
4. **保持绿色**: 不要在红色状态下提交代码
5. **重构勇气**: 有测试保护,放心重构

## 🚫 常见陷阱

1. ❌ 先写代码再补测试
2. ❌ 测试过于复杂
3. ❌ 测试依赖外部服务(应使用 mock)
4. ❌ 忽略边界条件
5. ❌ 测试实现细节而非行为

## 🔗 与现有工作流集成

可以在以下工作流中强制执行 TDD:

- `/dev` - 开发时自动运行测试
- `/check` - 检查测试覆盖率
- 新增 `/tdd` - 专门的 TDD 工作流

## 📚 参考资源

- [Jest 文档](https://jestjs.io/)
- [Vitest 文档](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
