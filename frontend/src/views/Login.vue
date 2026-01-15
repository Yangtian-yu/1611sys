<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ElMessage } from "element-plus";

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref({
  username: "",
  password: "",
});

const loading = ref(false);

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  loading.value = true;
  try {
    await authStore.login(loginForm.value);
    ElMessage.success("登录成功");
    router.push("/duty");
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "登录失败");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <el-card class="w-96">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-800">1611值日系统</h1>
          <p class="text-sm text-gray-500 mt-2">办公室值日管理系统</p>
        </div>
      </template>

      <el-form @submit.prevent="handleLogin">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>

      <div class="mt-4 text-center text-sm text-gray-500">
        <p>测试账号：admin / Admin@1611</p>
      </div>
    </el-card>
  </div>
</template>
