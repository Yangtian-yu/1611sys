<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Layout from "@/components/Layout.vue";
import SnakeCanvas from "@/components/game/SnakeCanvas.vue";
import GameStats from "@/components/game/GameStats.vue";
import GameControls from "@/components/game/GameControls.vue";
import { useSnakeGame } from "@/composables/useSnakeGame";
import type { GameConfig } from "@/types/game";

const config: GameConfig = {
  gridSize: 30,
  cellSize: 20,
  initialSpeed: 100,
  difficulty: "MEDIUM",
};

const {
  state: gameState,
  startGame,
  pauseGame,
  resumeGame,
  restartGame,
  changeDirection,
} = useSnakeGame(config);

const handleKeyDown = (e: KeyboardEvent) => {
  const { key } = e;

  // 防止页面滚动(在玩游戏时)
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
    e.preventDefault();
  }

  // 方向控制
  switch (key.toLowerCase()) {
    case "arrowup":
    case "w":
      changeDirection("UP");
      break;
    case "arrowdown":
    case "s":
      changeDirection("DOWN");
      break;
    case "arrowleft":
    case "a":
      changeDirection("LEFT");
      break;
    case "arrowright":
    case "d":
      changeDirection("RIGHT");
      break;
    case " ":
      if (gameState.status === "PLAYING") pauseGame();
      else if (gameState.status === "PAUSED") resumeGame();
      break;
    case "enter":
      if (gameState.status === "IDLE" || gameState.status === "GAME_OVER") {
        startGame();
      }
      break;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Layout>
    <div class="game-page">
      <header class="game-header">
        <h1 class="title">🎮 娱乐中心</h1>
        <p class="subtitle">欢迎来到 1611 休息室，享受一下轻松的贪吃蛇时光！</p>
      </header>

      <div class="game-layout">
        <!-- 左侧: 游戏区域 -->
        <div class="canvas-section">
          <SnakeCanvas :gameState="gameState" :config="config" />
        </div>

        <!-- 右侧: 面板区域 -->
        <aside class="sidebar-section">
          <GameStats :gameState="gameState" />
          <div class="spacer"></div>
          <GameControls
            :gameState="gameState"
            @start="startGame"
            @pause="pauseGame"
            @resume="resumeGame"
            @restart="startGame"
          />
        </aside>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.game-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.game-header {
  margin-bottom: 2rem;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
}

.game-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
}

.canvas-section {
  display: flex;
  justify-content: center;
}

.sidebar-section {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.spacer {
  height: 0.5rem;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .game-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-section {
    position: static;
  }

  .canvas-section {
    order: 2;
  }

  .sidebar-section {
    order: 1;
  }
}
</style>
