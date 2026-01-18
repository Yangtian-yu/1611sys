/** 坐标点 */
export interface Point {
  x: number;
  y: number;
}

/** 方向 */
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

/** 游戏难度 */
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

/** 游戏状态 */
export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";

/** 游戏配置 */
export interface GameConfig {
  gridSize: number; // 网格大小 (30)
  cellSize: number; // 单元格大小 (20px)
  initialSpeed: number; // 初始速度 (100ms)
  difficulty: Difficulty; // 难度
}

/** 游戏状态数据结构 */
export interface GameState {
  snake: Point[]; // 蛇身坐标数组
  food: Point; // 食物坐标
  direction: Direction; // 当前方向
  nextDirection: Direction; // 下一步方向
  score: number; // 当前得分
  highScore: number; // 最高分
  status: GameStatus; // 游戏状态
  speed: number; // 当前速度
}
