<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getDutySchedule } from "@/api/duty";
import type { DutySchedule } from "@/types";
import { ElMessage } from "element-plus";

const router = useRouter();
const authStore = useAuthStore();
const dutyData = ref<DutySchedule | null>(null);
const loading = ref(false);

const weekEndDate = computed(() => {
  if (!dutyData.value) return "";
  const startDate = new Date(dutyData.value.weekStartDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4); // 周五
  return endDate.toISOString().split("T")[0];
});

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

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

onMounted(() => {
  fetchDuty();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-bold text-blue-600">1611值日系统</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-600">{{ authStore.user?.username }}</span>
          <el-button size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <div class="max-w-4xl mx-auto mt-8 px-4">
      <el-card v-loading="loading">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold">本周值日安排</h2>
            <span class="text-sm text-gray-500">
              {{ dutyData?.weekStartDate }} - {{ weekEndDate }}
            </span>
          </div>
        </template>

        <div v-if="dutyData" class="flex justify-center gap-8 py-8">
          <div
            v-for="user in dutyData.dutyUsers"
            :key="user.id"
            class="text-center"
          >
            <el-avatar :size="80" class="mb-4 bg-blue-500">
              {{ user.username.charAt(0) }}
            </el-avatar>
            <div class="text-lg font-bold">{{ user.username }}</div>
            <div class="text-sm text-gray-500">{{ user.email }}</div>
          </div>
        </div>

        <div class="text-center text-gray-500 mt-4">值日时间：本周五下午</div>
      </el-card>
    </div>
  </div>
</template>
