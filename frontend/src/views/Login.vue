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
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 标题区域 -->
      <div class="login-header">
        <div class="logo-wrapper">
          <div class="logo-icon">1611</div>
        </div>
        <h1 class="title gradient-text">值日系统</h1>
        <p class="subtitle">办公室值日管理平台</p>
      </div>

      <!-- 表单区域 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            class="input"
            placeholder="请输入用户名"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            class="input"
            placeholder="请输入密码"
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary login-btn"
          :disabled="loading"
        >
          <span v-if="!loading">登录</span>
          <span v-else>登录中...</span>
        </button>
      </form>

      <!-- 测试账号提示 -->
      <div class="test-accounts">
        <p class="test-title">测试账号</p>
        <div class="test-items">
          <div class="test-item">
            <span class="test-label">管理员</span>
            <span class="test-value">admin / Admin@1611</span>
          </div>
          <div class="test-item">
            <span class="test-label">员工</span>
            <span class="test-value">李明 / password</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="footer">
      <p>© 2026 1611 值日系统 · 让办公更有序</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -10%;
  right: -10%;
  animation-delay: 5s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

/* 登录卡片 */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out;
}

/* 标题区域 */
.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-wrapper {
  display: inline-block;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.4);
  animation: glow 3s ease-in-out infinite;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 400;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* 表单区域 */
.login-form {
  animation: fadeInUp 0.8s ease-out 0.5s both;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.login-btn {
  width: 100%;
  margin-top: 1rem;
  font-size: 1.125rem;
  padding: 1rem;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 测试账号 */
.test-accounts {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.test-title {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  font-weight: 600;
}

.test-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.test-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.test-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.test-label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.test-value {
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-family: "Courier New", monospace;
}

/* 页脚 */
.footer {
  position: relative;
  z-index: 1;
  margin-top: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  animation: fadeInUp 0.8s ease-out 0.7s both;
}

/* 响应式 */
@media (max-width: 640px) {
  .login-card {
    padding: 2rem;
  }

  .title {
    font-size: 2rem;
  }

  .logo-icon {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }
}
</style>
