<script setup lang="ts">
import { ref } from "vue";
import { changePassword, type ChangePasswordData } from "@/api/auth";
import { ElMessage } from "element-plus";
import Layout from "@/components/Layout.vue";

const form = ref<ChangePasswordData>({
  oldPassword: "",
  newPassword: "",
});

const confirmPassword = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  // 验证表单
  if (!form.value.oldPassword) {
    ElMessage.warning("请输入旧密码");
    return;
  }

  if (!form.value.newPassword) {
    ElMessage.warning("请输入新密码");
    return;
  }

  if (form.value.newPassword.length < 6) {
    ElMessage.warning("新密码至少6位");
    return;
  }

  if (form.value.newPassword !== confirmPassword.value) {
    ElMessage.warning("两次输入的新密码不一致");
    return;
  }

  loading.value = true;
  try {
    await changePassword(form.value);
    ElMessage.success("密码修改成功");
    // 重置表单
    form.value = {
      oldPassword: "",
      newPassword: "",
    };
    confirmPassword.value = "";
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "密码修改失败");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Layout>
    <div class="change-password-page">
      <div class="page-header">
        <h2 class="page-title gradient-text">修改密码</h2>
        <p class="page-subtitle">为了账号安全，请定期修改密码</p>
      </div>

      <div class="password-card">
        <form @submit.prevent="handleSubmit" class="password-form">
          <div class="form-group">
            <label class="form-label">旧密码</label>
            <input
              v-model="form.oldPassword"
              type="password"
              class="input"
              placeholder="请输入当前密码"
              autocomplete="current-password"
            />
          </div>

          <div class="form-group">
            <label class="form-label">新密码</label>
            <input
              v-model="form.newPassword"
              type="password"
              class="input"
              placeholder="请输入新密码（至少6位）"
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <label class="form-label">确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="input"
              placeholder="请再次输入新密码"
              autocomplete="new-password"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="!loading">确认修改</span>
              <span v-else>修改中...</span>
            </button>
          </div>
        </form>

        <div class="password-tips">
          <h3 class="tips-title">💡 密码安全建议</h3>
          <ul class="tips-list">
            <li>密码长度至少6位</li>
            <li>建议包含字母、数字和特殊字符</li>
            <li>不要使用过于简单的密码</li>
            <li>定期更换密码以保障账号安全</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.change-password-page {
  padding: 3rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.password-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  animation: fadeInUp 0.6s ease-out;
}

.password-form {
  margin-bottom: 2.5rem;
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

.form-actions {
  margin-top: 2rem;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-tips {
  padding: 1.5rem;
  background: rgba(255, 221, 61, 0.1);
  border: 1px solid rgba(255, 221, 61, 0.2);
  border-radius: 16px;
}

.tips-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  position: relative;
}

.tips-list li::before {
  content: "•";
  position: absolute;
  left: 0.5rem;
  color: #ffd93d;
  font-weight: bold;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .change-password-page {
    padding: 2rem 1rem;
  }

  .password-card {
    padding: 1.5rem;
  }
}
</style>
