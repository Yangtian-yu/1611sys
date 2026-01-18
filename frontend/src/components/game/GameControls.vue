<script setup lang="ts">
import type { GameState } from "../../types/game";

const props = defineProps<{
  gameState: GameState;
}>();

defineEmits<{
  (e: "start"): void;
  (e: "pause"): void;
  (e: "resume"): void;
  (e: "restart"): void;
}>();
</script>

<template>
  <div class="controls-container">
    <button
      v-if="gameState.status === 'IDLE'"
      class="btn-primary"
      @click="$emit('start')"
    >
      开始游戏
    </button>

    <template v-if="gameState.status === 'PLAYING'">
      <button class="btn-secondary" @click="$emit('pause')">暂停游戏</button>
    </template>

    <template v-if="gameState.status === 'PAUSED'">
      <button class="btn-primary" @click="$emit('resume')">继续游戏</button>
    </template>

    <button
      v-if="gameState.status === 'GAME_OVER'"
      class="btn-primary"
      @click="$emit('restart')"
    >
      重新开始
    </button>

    <!-- 难度切换器未来可以加在这里 -->
  </div>
</template>

<style scoped>
.controls-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(250, 112, 154, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(250, 112, 154, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
