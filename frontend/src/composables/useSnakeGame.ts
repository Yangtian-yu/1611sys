import { reactive, onUnmounted } from "vue";
import type {
  Point,
  Direction,
  GameState,
  GameConfig,
} from "../types/game";

export function useSnakeGame(config: GameConfig) {
  const state = reactive<GameState>({
    snake: [
      { x: 15, y: 15 },
      { x: 15, y: 16 },
      { x: 15, y: 17 },
    ],
    food: { x: 5, y: 5 },
    direction: "UP",
    nextDirection: "UP",
    score: 0,
    highScore: parseInt(localStorage.getItem("snake_highscore") || "0"),
    status: "IDLE",
    speed: config.initialSpeed,
  });

  let gameInterval: number | null = null;

  /** 生成随机食物坐标 */
  function generateFood(): Point {
    let newFood: Point;
    const isOccupied = (p: Point) =>
      state.snake.some((s) => s.x === p.x && s.y === p.y);

    do {
      newFood = {
        x: Math.floor(Math.random() * config.gridSize),
        y: Math.floor(Math.random() * config.gridSize),
      };
    } while (isOccupied(newFood));

    return newFood;
  }

  /** 开始游戏 */
  function startGame() {
    resetGame();
    state.status = "PLAYING";
    state.food = generateFood();
    resumeGame();
  }

  /** 重置游戏状态 */
  function resetGame() {
    state.snake = [
      { x: 15, y: 15 },
      { x: 15, y: 16 },
      { x: 15, y: 17 },
    ];
    state.direction = "UP";
    state.nextDirection = "UP";
    state.score = 0;
    state.status = "IDLE";
    stopGameInterval();
  }

  /** 暂停游戏 */
  function pauseGame() {
    if (state.status === "PLAYING") {
      state.status = "PAUSED";
      stopGameInterval();
    }
  }

  /** 继续游戏 */
  function resumeGame() {
    if (state.status === "PAUSED" || state.status === "PLAYING") {
      state.status = "PLAYING";
      stopGameInterval();
      gameInterval = window.setInterval(moveStep, state.speed);
    }
  }

  /** 停止定时器 */
  function stopGameInterval() {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
  }

  /** 改变方向(带缓冲,防止反向) */
  function changeDirection(newDir: Direction) {
    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (newDir !== opposites[state.direction]) {
      state.nextDirection = newDir;
    }
  }

  /** 核心移动步进算法 */
  function moveStep() {
    state.direction = state.nextDirection;
    const head = state.snake[0];
    const newHead = { ...head };

    switch (state.direction) {
      case "UP":
        newHead.y -= 1;
        break;
      case "DOWN":
        newHead.y += 1;
        break;
      case "LEFT":
        newHead.x -= 1;
        break;
      case "RIGHT":
        newHead.x += 1;
        break;
    }

    // 1. 边界检测
    if (
      newHead.x < 0 ||
      newHead.x >= config.gridSize ||
      newHead.y < 0 ||
      newHead.y >= config.gridSize
    ) {
      gameOver();
      return;
    }

    // 2. 自身碰撞检测
    if (state.snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      gameOver();
      return;
    }

    // 3. 吃食物逻辑
    if (newHead.x === state.food.x && newHead.y === state.food.y) {
      state.score += 10;
      state.snake.unshift(newHead);
      state.food = generateFood();

      // 更新最高分
      if (state.score > state.highScore) {
        state.highScore = state.score;
        localStorage.setItem("snake_highscore", state.highScore.toString());
      }

      // 可选: 提速逻辑
      // if (state.score % 50 === 0 && state.speed > 50) {
      //   state.speed -= 5;
      //   resumeGame();
      // }
    } else {
      state.snake.unshift(newHead);
      state.snake.pop();
    }
  }

  /** 游戏结束 */
  function gameOver() {
    state.status = "GAME_OVER";
    stopGameInterval();
  }

  onUnmounted(() => {
    stopGameInterval();
  });

  return {
    state,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    changeDirection,
  };
}
