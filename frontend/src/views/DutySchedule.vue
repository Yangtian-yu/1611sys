<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getDutySchedule, updateDutySchedule } from "@/api/duty";
import type { DutySchedule } from "@/types";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import Layout from "@/components/Layout.vue";

const authStore = useAuthStore();
const dutyData = ref<DutySchedule | null>(null);
const loading = ref(false);
const adjustDialogVisible = ref(false);
const selectedDutyCount = ref(2); // 默认2人

const isAdmin = computed(() => authStore.user?.role === "ADMIN");

const weekEndDate = computed(() => {
  if (!dutyData.value) return "";
  const startDate = new Date(dutyData.value.weekStartDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4); // 周五
  return endDate.toISOString().split("T")[0];
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const formatDateWithWeek = (dateStr: string) => {
  const date = new Date(dateStr);
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${date.getMonth() + 1}月${date.getDate()}日（${
    weekDays[date.getDay()]
  }）`;
};

const fetchDuty = async () => {
  loading.value = true;
  try {
    const res = await getDutySchedule();
    dutyData.value = res.data.data;
  } catch (error: any) {
    ElMessage.error("获取值日信息失败");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openAdjustDialog = () => {
  // 默认选择当前人数
  selectedDutyCount.value = dutyData.value?.dutyUsers.length || 2;
  adjustDialogVisible.value = true;
};

const handleAdjust = async () => {
  try {
    await updateDutySchedule(selectedDutyCount.value);
    ElMessage.success(`已调整为${selectedDutyCount.value}人值日`);
    adjustDialogVisible.value = false;
    fetchDuty();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "调整失败");
  }
};

onMounted(() => {
  fetchDuty();
});
</script>

<template>
  <Layout>
    <div class="duty-page">
      <!-- 背景装饰 -->
      <div class="bg-decoration">
        <div class="grid-pattern"></div>
      </div>

      <!-- 值日卡片 -->
      <div class="duty-card" v-loading="loading">
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="header-content">
            <h2 class="card-title">本周值日安排</h2>
            <div class="header-actions">
              <div class="date-range" v-if="dutyData">
                <span class="date-icon">📅</span>
                <span
                  >{{ formatDate(dutyData.weekStartDate) }} -
                  {{ formatDate(weekEndDate) }}</span
                >
              </div>
              <button
                v-if="isAdmin"
                class="btn-adjust"
                @click="openAdjustDialog"
              >
                <span>调整值日</span>
              </button>
            </div>
          </div>
          <div class="header-decoration"></div>
        </div>

        <!-- 值日人员列表 -->
        <div class="duty-list" v-if="dutyData">
          <div
            v-for="(user, index) in dutyData.dutyUsers"
            :key="user.id"
            class="duty-person"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="person-avatar">
              <div class="avatar-inner">{{ user.username.charAt(0) }}</div>
              <div class="avatar-ring"></div>
            </div>
            <div class="person-info">
              <h3 class="person-name">{{ user.username }}</h3>
              <p class="person-email">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <!-- 值日提示 -->
        <div class="duty-note" v-if="dutyData">
          <div class="note-icon">⏰</div>
          <p>
            预计值日时间：<span class="highlight">{{
              formatDateWithWeek(dutyData.dutyDate)
            }}</span>
            下午 17:00 后
          </p>
        </div>
      </div>

      <!-- 装饰元素 -->
      <div class="floating-elements">
        <div class="float-circle float-1"></div>
        <div class="float-circle float-2"></div>
        <div class="float-circle float-3"></div>
      </div>
    </div>

    <!-- 调整值日对话框 -->
    <el-dialog
      v-model="adjustDialogVisible"
      title="调整本周值日人数"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="adjust-dialog">
        <p class="dialog-tip">请选择本周值日人数</p>
        <el-select
          v-model="selectedDutyCount"
          placeholder="请选择"
          size="large"
          style="width: 100%"
        >
          <el-option label="2人值日" :value="2" />
          <el-option label="3人值日" :value="3" />
          <el-option label="4人值日（大扫除）" :value="4" />
        </el-select>
        <p class="dialog-note">💡 系统将自动按员工顺序选择对应数量的人员</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button
            class="btn btn-secondary"
            @click="adjustDialogVisible = false"
          >
            取消
          </button>
          <button class="btn btn-primary" @click="handleAdjust">确定</button>
        </div>
      </template>
    </el-dialog>
  </Layout>
</template>

<style scoped>
.duty-page {
  padding: 3rem 2rem;
  position: relative;
  min-height: 100vh;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

/* 值日卡片 */
.duty-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out;
}

.card-header {
  margin-bottom: 3rem;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.date-icon {
  font-size: 1.25rem;
}

.header-decoration {
  position: absolute;
  bottom: -1rem;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 107, 107, 0.5) 50%,
    transparent 100%
  );
}

/* 值日人员列表 */
.duty-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.duty-person {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out both;
}

.duty-person:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 107, 107, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(255, 107, 107, 0.2);
}

.person-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-inner {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

.person-info {
  flex: 1;
  min-width: 0;
}

.person-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.person-email {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 值日提示 */
.duty-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 20px;
  color: var(--color-text-secondary);
  font-size: 1rem;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.highlight {
  color: #ffd93d;
  font-weight: 700;
  margin: 0 4px;
}

.note-icon {
  font-size: 1.5rem;
}

/* 浮动装饰元素 */
.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.float-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.1) 0%,
    rgba(255, 221, 61, 0.1) 100%
  );
  filter: blur(40px);
}

.float-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  right: 10%;
  animation: float 15s ease-in-out infinite;
}

.float-2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  left: 15%;
  animation: float 20s ease-in-out infinite reverse;
}

.float-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  animation: float 18s ease-in-out infinite;
  animation-delay: 5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .duty-page {
    padding: 2rem 1rem;
  }

  .duty-card {
    padding: 2rem 1.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .duty-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* 调整值日按钮 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-adjust {
  padding: 0.625rem 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 24px;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-adjust:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

/* 调整值日对话框 */
.adjust-dialog {
  padding: 1rem 0;
}

.dialog-tip {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.dialog-note {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 221, 61, 0.1);
  border-radius: 8px;
  border-left: 3px solid #ffd93d;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
