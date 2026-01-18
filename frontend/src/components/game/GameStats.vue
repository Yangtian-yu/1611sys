<script setup lang="ts">
import type { GameState } from "../../types/game";

defineProps<{
  gameState: GameState;
}>();
</script>

<template>
  <div class="stats-container">
    <div class="stat-card score">
      <div class="stat-label">当前得分</div>
      <div class="stat-value">{{ gameState.score }}</div>
    </div>
    <div class="stat-card high-score">
      <div class="stat-label">最高得分</div>
      <div class="stat-value">{{ gameState.highScore }}</div>
    </div>

    <div class="instructions">
      <h3 class="instruction-title">⌨️ 操作说明</h3>
      <ul class="instruction-list">
        <li><span>↑↓←→</span> 或 <span>WASD</span> 移动</li>
        <li><span>Space</span> 暂停 / 继续</li>
        <li><span>Enter</span> 开始 / 重新开始</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.instructions {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.instruction-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1rem;
}

.instruction-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.instruction-list li {
  font-size: 0.875rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.instruction-list span {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e2e8f0;
  font-family: monospace;
}
</style>
