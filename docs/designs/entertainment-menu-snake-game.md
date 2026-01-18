# 功能设计: 娱乐菜单与贪吃蛇游戏

## 📋 需求概述

在 1611 值日系统中添加娱乐菜单,首个子功能为贪吃蛇小游戏,为用户提供工作之余的休闲娱乐。

### 核心需求

- 在侧边栏菜单中添加"娱乐中心"菜单项
- 实现经典贪吃蛇游戏
- 延续项目现有的现代化渐变色设计风格
- 所有登录用户均可访问

---

## 🎨 设计方案

### 1. 菜单结构设计

#### 更新后的菜单层级

```
侧边栏菜单:
├── 值日安排 📅 (所有用户)
├── 员工管理 👥 (仅管理员)
├── 值日顺序 🔄 (仅管理员)
├── 娱乐中心 🎮 ← 新增 (所有用户)
│   └── 贪吃蛇 🐍
└── 修改密码 🔑 (所有用户)
```

#### 菜单项配置

```typescript
{
  path: "/entertainment/snake",
  name: "娱乐中心",
  icon: "🎮",
  requiresAuth: true,
  requiresAdmin: false
}
```

---

### 2. 贪吃蛇游戏设计

#### 2.1 视觉设计

**设计风格**: 现代简约,延续项目渐变色主题

**色彩方案**:

- **蛇身**: 粉橙渐变 `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`
- **蛇头**: 紫色渐变 `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **食物**: 绿色渐变 `linear-gradient(135deg, #10B981 0%, #3B82F6 100%)`
- **背景**: 深色网格 `#0f0f1e` + 半透明网格线
- **UI 元素**: 与项目主题一致的卡片和按钮样式

**画布尺寸**: 600x600px (30x30 网格,每格 20px)

#### 2.2 游戏界面布局

```
┌─────────────────────────────────────────┐
│  🎮 贪吃蛇游戏                          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │                 │  │  得分: 0     │ │
│  │                 │  │  最高分: 120 │ │
│  │   游戏画布      │  │              │ │
│  │   600x600       │  │  [开始游戏]  │ │
│  │                 │  │  [暂停]      │ │
│  │                 │  │  [重新开始]  │ │
│  │                 │  │              │ │
│  │                 │  │  难度: 中等  │ │
│  │                 │  │  ○ 简单      │ │
│  │                 │  │  ● 中等      │ │
│  └─────────────────┘  │  ○ 困难      │ │
│                       │              │ │
│                       │  操作说明:   │ │
│                       │  ↑↓←→ 移动  │ │
│                       │  Space 暂停  │ │
│                       └──────────────┘ │
└─────────────────────────────────────────┘
```

#### 2.3 游戏功能

**核心功能** (第一版必须实现):

- ✅ 经典贪吃蛇玩法
  - 蛇身移动(上下左右)
  - 吃食物后蛇身变长
  - 碰撞检测(墙壁、自身)
- ✅ 得分系统
  - 每吃一个食物 +10 分
  - 实时显示当前得分
- ✅ 游戏控制
  - 开始游戏
  - 暂停/继续
  - 重新开始
- ✅ 最高分记录
  - 使用 LocalStorage 存储
  - 显示历史最高分

**进阶功能** (可选,后续迭代):

- 🟡 难度选择
  - 简单: 速度 150ms/格
  - 中等: 速度 100ms/格
  - 困难: 速度 50ms/格
- 🟡 速度递增
  - 每吃 5 个食物,速度提升 10%
- 🟡 音效
  - 吃食物音效
  - 游戏结束音效
- 🟡 排行榜(需要后端支持)

#### 2.4 游戏控制

**键盘控制**:

- `↑` / `W` - 向上移动
- `↓` / `S` - 向下移动
- `←` / `A` - 向左移动
- `→` / `D` - 向右移动
- `Space` - 暂停/继续
- `Enter` - 开始/重新开始

**移动端支持** (可选):

- 触摸滑动控制方向

---

## 🏗️ 技术实现方案

### 3.1 前端架构

#### 文件结构

```
frontend/src/
├── views/
│   └── entertainment/
│       └── SnakeGame.vue         # 贪吃蛇游戏页面
├── components/
│   └── game/
│       ├── SnakeCanvas.vue       # 游戏画布组件
│       ├── GameControls.vue      # 游戏控制面板
│       └── GameStats.vue         # 游戏统计信息
├── composables/
│   └── useSnakeGame.ts           # 游戏逻辑 Composable
├── types/
│   └── game.ts                   # 游戏类型定义
└── router/
    └── index.ts                  # 路由配置(更新)
```

#### 技术选型

**游戏渲染**: HTML5 Canvas API

- 原生实现,无需额外依赖
- 性能优秀,支持 60 FPS
- 完全可控

**状态管理**: Vue 3 Composition API

- 使用 `ref` 和 `reactive` 管理游戏状态
- 使用 `composable` 封装游戏逻辑
- 无需引入 Pinia (游戏状态不需要全局共享)

**数据持久化**: LocalStorage

- 存储最高分记录
- 存储难度偏好
- 简单可靠,无需后端支持

### 3.2 核心数据结构

```typescript
// types/game.ts

/** 坐标点 */
interface Point {
  x: number;
  y: number;
}

/** 方向 */
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

/** 游戏难度 */
type Difficulty = "EASY" | "MEDIUM" | "HARD";

/** 游戏状态 */
type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

/** 游戏配置 */
interface GameConfig {
  gridSize: number; // 网格大小 (30)
  cellSize: number; // 单元格大小 (20px)
  initialSpeed: number; // 初始速度 (100ms)
  difficulty: Difficulty; // 难度
}

/** 游戏状态 */
interface GameState {
  snake: Point[]; // 蛇身坐标数组
  food: Point; // 食物坐标
  direction: Direction; // 当前方向
  nextDirection: Direction; // 下一步方向(防止快速按键导致反向)
  score: number; // 当前得分
  highScore: number; // 最高分
  status: GameStatus; // 游戏状态
  speed: number; // 当前速度
}
```

### 3.3 核心算法

#### 移动逻辑

```typescript
function moveSnake(state: GameState): void {
  // 1. 根据方向计算新的蛇头位置
  const head = state.snake[0];
  const newHead = getNextPosition(head, state.direction);

  // 2. 检查碰撞
  if (isCollision(newHead, state.snake)) {
    state.status = "GAME_OVER";
    return;
  }

  // 3. 检查是否吃到食物
  if (isEatingFood(newHead, state.food)) {
    state.score += 10;
    state.snake.unshift(newHead); // 蛇头添加新位置
    state.food = generateFood(state.snake); // 生成新食物
    updateHighScore(state);
  } else {
    state.snake.unshift(newHead); // 蛇头添加新位置
    state.snake.pop(); // 蛇尾移除
  }
}
```

#### 碰撞检测

```typescript
function isCollision(head: Point, snake: Point[]): boolean {
  // 检查是否撞墙
  if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 30) {
    return true;
  }

  // 检查是否撞到自己
  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
}
```

#### 食物生成

```typescript
function generateFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * 30),
      y: Math.floor(Math.random() * 30),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));

  return food;
}
```

### 3.4 渲染优化

**使用 requestAnimationFrame**:

- 确保 60 FPS 流畅渲染
- 自动适应屏幕刷新率

**Canvas 优化**:

- 每帧清空画布重绘
- 使用渐变色缓存
- 避免频繁创建对象

---

## 📝 实现步骤

### 阶段 1: 路由和菜单 (15 分钟)

1. **更新路由配置** (5 分钟)
   - 在 `router/index.ts` 添加娱乐中心路由
   - 配置路由守卫(需要登录)

2. **更新侧边栏菜单** (5 分钟)
   - 在 `Layout.vue` 的 `menuItems` 添加娱乐中心
   - 添加 🎮 图标

3. **创建游戏页面骨架** (5 分钟)
   - 创建 `views/entertainment/SnakeGame.vue`
   - 基础布局和样式

### 阶段 2: 游戏核心逻辑 (TDD) (60 分钟)

4. **创建类型定义** (5 分钟)
   - 创建 `types/game.ts`
   - 定义所有接口和类型

5. **编写游戏逻辑测试** (RED) (15 分钟)
   - 创建 `composables/__tests__/useSnakeGame.spec.ts`
   - 测试移动、碰撞、吃食物等逻辑

6. **实现游戏逻辑** (GREEN) (25 分钟)
   - 创建 `composables/useSnakeGame.ts`
   - 实现核心游戏逻辑
   - 确保所有测试通过

7. **重构优化** (REFACTOR) (15 分钟)
   - 提取辅助函数
   - 优化代码结构
   - 添加注释

### 阶段 3: 游戏渲染 (45 分钟)

8. **实现游戏画布组件** (25 分钟)
   - 创建 `components/game/SnakeCanvas.vue`
   - Canvas 渲染逻辑
   - 绘制蛇身、食物、网格

9. **实现控制面板** (10 分钟)
   - 创建 `components/game/GameControls.vue`
   - 开始、暂停、重启按钮
   - 难度选择

10. **实现统计面板** (10 分钟)
    - 创建 `components/game/GameStats.vue`
    - 得分显示
    - 最高分显示
    - 操作说明

### 阶段 4: 集成和优化 (30 分钟)

11. **组件集成** (15 分钟)
    - 在 `SnakeGame.vue` 中组装所有组件
    - 事件绑定和状态同步

12. **键盘控制** (10 分钟)
    - 监听键盘事件
    - 方向控制逻辑
    - 防止反向移动

13. **LocalStorage 持久化** (5 分钟)
    - 保存/读取最高分
    - 保存/读取难度偏好

### 阶段 5: 测试和优化 (20 分钟)

14. **手动测试** (10 分钟)
    - 测试所有游戏功能
    - 测试边界情况
    - 测试不同难度

15. **性能优化** (5 分钟)
    - 检查帧率
    - 优化渲染性能

16. **样式调整** (5 分钟)
    - 响应式适配
    - 细节美化

---

## ✅ 验收标准

### 功能验收

- [ ] 侧边栏显示"娱乐中心 🎮"菜单项
- [ ] 点击菜单进入贪吃蛇游戏页面
- [ ] 游戏可以正常开始、暂停、重启
- [ ] 蛇可以通过方向键/WASD 控制移动
- [ ] 吃到食物后蛇身变长,得分增加
- [ ] 撞墙或撞到自己时游戏结束
- [ ] 最高分正确保存和显示
- [ ] 难度选择功能正常(可选)

### 视觉验收

- [ ] 游戏界面延续项目渐变色风格
- [ ] 蛇身、食物、背景色彩协调美观
- [ ] 游戏控制面板布局合理
- [ ] 响应式设计在不同屏幕尺寸下正常

### 性能验收

- [ ] 游戏运行流畅,无明显卡顿
- [ ] 帧率稳定在 60 FPS
- [ ] 键盘响应灵敏

### 代码质量验收

- [ ] 核心游戏逻辑有单元测试覆盖
- [ ] 代码符合 ESLint 规范
- [ ] 组件职责清晰,可维护性好
- [ ] 有必要的注释和文档

---

## ⚠️ 风险和挑战

### 风险 1: Canvas 渲染性能

**描述**: 在低性能设备上可能出现卡顿

**缓解措施**:

- 使用 `requestAnimationFrame` 优化渲染
- 避免频繁创建对象
- 缓存渐变色对象
- 提供性能模式(关闭渐变,使用纯色)

### 风险 2: 快速按键导致反向移动

**描述**: 用户快速连续按键可能导致蛇反向移动(如从向右快速按左)

**缓解措施**:

- 使用 `nextDirection` 缓冲下一步方向
- 在移动前验证方向合法性
- 限制按键响应频率

### 风险 3: 移动端适配

**描述**: 移动端没有键盘,需要触摸控制

**缓解措施**:

- 第一版暂不支持移动端(PC 优先)
- 后续迭代添加虚拟方向键
- 或使用滑动手势控制

---

## 📊 预计工作量

| 阶段               | 预计时间                   |
| ------------------ | -------------------------- |
| 路由和菜单         | 15 分钟                    |
| 游戏核心逻辑 (TDD) | 60 分钟                    |
| 游戏渲染           | 45 分钟                    |
| 集成和优化         | 30 分钟                    |
| 测试和优化         | 20 分钟                    |
| **总计**           | **170 分钟 (约 2.8 小时)** |

---

## 🎯 后续迭代计划

### 第二版: 增强功能

- [ ] 难度选择功能
- [ ] 速度递增机制
- [ ] 音效支持
- [ ] 更多游戏主题/皮肤

### 第三版: 社交功能

- [ ] 后端排行榜 API
- [ ] 全局排行榜显示
- [ ] 分享得分功能

### 第四版: 更多游戏

- [ ] 俄罗斯方块
- [ ] 扫雷
- [ ] 2048
- [ ] 打砖块

---

**设计批准时间**: 待定
**设计者**: AI (Superpowers 工作流)
**审阅者**: 用户
