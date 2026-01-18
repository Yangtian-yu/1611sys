import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSnakeGame } from "../useSnakeGame";
import type { GameConfig } from "../../types/game";

describe("useSnakeGame", () => {
  const config: GameConfig = {
    gridSize: 30,
    cellSize: 20,
    initialSpeed: 100,
    difficulty: "MEDIUM",
  };

  beforeEach(() => {
    // 清理 LocalStorage
    localStorage.clear();
    // 模拟计时器
    vi.useFakeTimers();
  });

  it("应该正确初始化游戏状态", () => {
    const { state } = useSnakeGame(config);
    expect(state.score).toBe(0);
    expect(state.status).toBe("IDLE");
    expect(state.snake).toHaveLength(3);
    expect(state.direction).toBe("UP");
  });

  it("开始游戏后状态应该是 PLAYING", () => {
    const { state, startGame } = useSnakeGame(config);
    startGame();
    expect(state.status).toBe("PLAYING");
  });

  it("蛇应该能够向上移动", () => {
    const { state, startGame } = useSnakeGame(config);
    startGame();

    // 初始头部位置是 {x: 15, y: 15}
    const initialHead = { ...state.snake[0] };

    // 触发一次移动 (100ms)
    vi.advanceTimersByTime(100);

    expect(state.snake[0].y).toBe(initialHead.y - 1);
    expect(state.snake[0].x).toBe(initialHead.x);
  });

  it("应该能够改变方向", () => {
    const { state, startGame, changeDirection } = useSnakeGame(config);
    startGame();

    changeDirection("RIGHT");
    vi.advanceTimersByTime(100);

    expect(state.direction).toBe("RIGHT");
    expect(state.snake[0].x).toBe(16);
  });

  it("不应该允许反向移动", () => {
    const { state, startGame, changeDirection } = useSnakeGame(config);
    startGame(); // 默认向上

    // 尝试向下移动(反向)
    changeDirection("DOWN");
    vi.advanceTimersByTime(100);

    // 应该仍然向上移动
    expect(state.direction).toBe("UP");
    expect(state.nextDirection).toBe("UP");
  });

  it("撞墙时应该游戏结束", () => {
    const { state, resumeGame } = useSnakeGame(config);

    // 手动设置状态而不使用会重置一切的 startGame()
    state.snake = [{ x: 0, y: 0 }];
    state.direction = "LEFT";
    state.nextDirection = "LEFT";
    state.status = "PLAYING";

    resumeGame(); // 启动定时器

    // 触发一次移动
    vi.advanceTimersByTime(100);

    expect(state.status).toBe("GAME_OVER");
  });

  it("吃掉食物时得分应该增加且蛇身增长", () => {
    const { state, startGame } = useSnakeGame(config);
    startGame();

    // 强制设置食物位置在蛇头正上方
    state.food = { x: 15, y: 14 };
    state.direction = "UP";
    state.nextDirection = "UP";

    const initialLength = state.snake.length;

    vi.advanceTimersByTime(100);

    expect(state.score).toBe(10);
    expect(state.snake.length).toBe(initialLength + 1);
  });
});
