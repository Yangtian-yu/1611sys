<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { GameState, GameConfig } from "../../types/game";

const props = defineProps<{
  gameState: GameState;
  config: GameConfig;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

const initCanvas = () => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext("2d");
    draw();
  }
};

const draw = () => {
  if (!ctx || !canvasRef.value) return;

  const { gridSize, cellSize } = props.config;
  const { snake, food, status } = props.gameState;

  // 1. 清空背景
  ctx.fillStyle = "#0f0f1e";
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  // 2. 绘制网格(可选,增加视觉感)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridSize; i++) {
    // 垂直线
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvasRef.value.height);
    ctx.stroke();
    // 水平线
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvasRef.value.width, i * cellSize);
    ctx.stroke();
  }

  // 3. 绘制食物
  const foodX = food.x * cellSize + cellSize / 2;
  const foodY = food.y * cellSize + cellSize / 2;
  const foodGradient = ctx.createRadialGradient(
    foodX,
    foodY,
    2,
    foodX,
    foodY,
    cellSize / 2,
  );
  foodGradient.addColorStop(0, "#10B981");
  foodGradient.addColorStop(1, "#3B82F6");

  ctx.beginPath();
  ctx.arc(foodX, foodY, cellSize / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = foodGradient;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
  ctx.fill();
  ctx.shadowBlur = 0;

  // 4. 绘制蛇身
  snake.forEach((segment, index) => {
    const isHead = index === 0;
    const x = segment.x * cellSize;
    const y = segment.y * cellSize;
    const size = cellSize - 2;

    const gradient = ctx!.createLinearGradient(x, y, x + size, y + size);
    if (isHead) {
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
    } else {
      gradient.addColorStop(0, "#fa709a");
      gradient.addColorStop(1, "#fee140");
    }

    ctx!.fillStyle = gradient;
    // 绘制圆角矩形
    const radius = isHead ? 6 : 4;
    ctx!.beginPath();
    ctx!.roundRect(x + 1, y + 1, size, size, radius);
    ctx!.fill();
  });

  // 5. 绘制结束遮罩
  if (status === "GAME_OVER") {
    ctx.fillStyle = "rgba(15, 15, 30, 0.8)";
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);

    ctx.fillStyle = "#ff6b6b";
    ctx.font = "bold 40px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "游戏结束",
      canvasRef.value.width / 2,
      canvasRef.value.height / 2 - 20,
    );

    ctx.fillStyle = "#fff";
    ctx.font = "20px Inter, sans-serif";
    ctx.fillText(
      `得分: ${props.gameState.score}`,
      canvasRef.value.width / 2,
      canvasRef.value.height / 2 + 30,
    );
  }
};

// 监听游戏状态变化触发重绘
watch(() => props.gameState, draw, { deep: true });

onMounted(initCanvas);
</script>

<template>
  <div class="canvas-wrapper">
    <canvas
      ref="canvasRef"
      :width="config.gridSize * config.cellSize"
      :height="config.gridSize * config.cellSize"
      class="game-canvas"
    ></canvas>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.game-canvas {
  display: block;
  border-radius: 12px;
  cursor: crosshair;
}
</style>
