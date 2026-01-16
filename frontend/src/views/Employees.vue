<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  type User,
  type CreateUserData,
  type UpdateUserData,
} from "@/api/user";
import { ElMessage, ElMessageBox } from "element-plus";
import Layout from "@/components/Layout.vue";

const users = ref<User[]>([]);
const loading = ref(false);

// 对话框状态
const createDialogVisible = ref(false);
const editDialogVisible = ref(false);
const resetPasswordDialogVisible = ref(false);

// 表单数据
const createForm = ref<CreateUserData>({
  username: "",
  password: "",
  email: "",
});

const editForm = ref<UpdateUserData>({
  username: "",
  email: "",
});

const resetPasswordForm = ref({
  newPassword: "",
});

const currentEditUser = ref<User | null>(null);

// 计算属性：员工列表（排除管理员）
const employees = computed(() =>
  users.value.filter((u) => u.role === "EMPLOYEE")
);

// 获取员工列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await getUsers();
    users.value = res.data.data;
  } catch (error: any) {
    ElMessage.error("获取员工列表失败");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 打开创建对话框
const openCreateDialog = () => {
  createForm.value = {
    username: "",
    password: "",
    email: "",
  };
  createDialogVisible.value = true;
};

// 创建员工
const handleCreate = async () => {
  if (
    !createForm.value.username ||
    !createForm.value.password ||
    !createForm.value.email
  ) {
    ElMessage.warning("请填写完整信息");
    return;
  }

  try {
    await createUser(createForm.value);
    ElMessage.success("员工创建成功");
    createDialogVisible.value = false;
    fetchUsers();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "创建失败");
  }
};

// 打开编辑对话框
const openEditDialog = (user: User) => {
  currentEditUser.value = user;
  editForm.value = {
    username: user.username,
    email: user.email,
  };
  editDialogVisible.value = true;
};

// 更新员工信息
const handleUpdate = async () => {
  if (!currentEditUser.value) return;

  try {
    await updateUser(currentEditUser.value.id, editForm.value);
    ElMessage.success("员工信息更新成功");
    editDialogVisible.value = false;
    fetchUsers();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "更新失败");
  }
};

// 删除员工
const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除员工 "${user.username}" 吗？删除后无法恢复。`,
      "删除确认",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await deleteUser(user.id);
    ElMessage.success("员工删除成功");
    fetchUsers();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.response?.data?.message || "删除失败");
    }
  }
};

// 打开重置密码对话框
const openResetPasswordDialog = (user: User) => {
  currentEditUser.value = user;
  resetPasswordForm.value.newPassword = "";
  resetPasswordDialogVisible.value = true;
};

// 重置密码
const handleResetPassword = async () => {
  if (!currentEditUser.value) return;

  if (!resetPasswordForm.value.newPassword) {
    ElMessage.warning("请输入新密码");
    return;
  }

  try {
    await resetPassword(
      currentEditUser.value.id,
      resetPasswordForm.value.newPassword
    );
    ElMessage.success("密码重置成功");
    resetPasswordDialogVisible.value = false;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "重置失败");
  }
};

// 切换活跃状态
const handleToggleActive = async (user: User) => {
  try {
    await updateUser(user.id, { isActive: !user.isActive });
    user.isActive = !user.isActive;
    ElMessage.success(
      `${user.username} 已${
        user.isActive ? "恢复参与值日" : "设置为不参与值日"
      }`
    );
  } catch (error: any) {
    ElMessage.error("操作失败");
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <Layout>
    <div class="employees-page">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title gradient-text">员工管理</h2>
        <button class="btn btn-primary" @click="openCreateDialog">
          <span>+ 添加员工</span>
        </button>
      </div>

      <!-- 员工列表 -->
      <div class="employees-grid" v-loading="loading">
        <div
          v-for="user in employees"
          :key="user.id"
          class="employee-card"
          :class="{ inactive: !user.isActive }"
        >
          <div class="card-header">
            <div class="employee-avatar">
              <div class="avatar-inner">{{ user.username.charAt(0) }}</div>
            </div>
            <div class="employee-info">
              <h3 class="employee-name">{{ user.username }}</h3>
              <p class="employee-email">{{ user.email }}</p>
              <div class="duty-status">
                <span class="status-label">值日状态：</span>
                <el-switch
                  :model-value="user.isActive"
                  @change="handleToggleActive(user)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="正常"
                  inactive-text="免战"
                />
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-action btn-edit" @click="openEditDialog(user)">
              编辑
            </button>
            <button
              class="btn-action btn-reset"
              @click="openResetPasswordDialog(user)"
            >
              重置密码
            </button>
            <button class="btn-action btn-delete" @click="handleDelete(user)">
              删除
            </button>
          </div>
        </div>
      </div>

      <!-- 创建员工对话框 -->
      <el-dialog
        v-model="createDialogVisible"
        title="添加员工"
        width="500px"
        :close-on-click-modal="false"
      >
        <div class="dialog-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input
              v-model="createForm.username"
              type="text"
              class="input"
              placeholder="请输入用户名"
            />
          </div>
          <div class="form-group">
            <label class="form-label">初始密码</label>
            <input
              v-model="createForm.password"
              type="password"
              class="input"
              placeholder="请输入初始密码（至少6位）"
            />
          </div>
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input
              v-model="createForm.email"
              type="email"
              class="input"
              placeholder="请输入邮箱地址"
            />
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <button
              class="btn btn-secondary"
              @click="createDialogVisible = false"
            >
              取消
            </button>
            <button class="btn btn-primary" @click="handleCreate">确定</button>
          </div>
        </template>
      </el-dialog>

      <!-- 编辑员工对话框 -->
      <el-dialog
        v-model="editDialogVisible"
        title="编辑员工信息"
        width="500px"
        :close-on-click-modal="false"
      >
        <div class="dialog-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input
              v-model="editForm.username"
              type="text"
              class="input"
              placeholder="请输入用户名"
            />
          </div>
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input
              v-model="editForm.email"
              type="email"
              class="input"
              placeholder="请输入邮箱地址"
            />
          </div>
          <div class="form-group">
            <label class="form-label">值日状态</label>
            <el-switch
              v-model="editForm.isActive"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="恢复参与值日"
              inactive-text="不参与本周值日"
            />
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <button
              class="btn btn-secondary"
              @click="editDialogVisible = false"
            >
              取消
            </button>
            <button class="btn btn-primary" @click="handleUpdate">确定</button>
          </div>
        </template>
      </el-dialog>

      <!-- 重置密码对话框 -->
      <el-dialog
        v-model="resetPasswordDialogVisible"
        title="重置密码"
        width="500px"
        :close-on-click-modal="false"
      >
        <div class="dialog-form">
          <div class="form-group">
            <label class="form-label">新密码</label>
            <input
              v-model="resetPasswordForm.newPassword"
              type="password"
              class="input"
              placeholder="请输入新密码（至少6位）"
            />
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <button
              class="btn btn-secondary"
              @click="resetPasswordDialogVisible = false"
            >
              取消
            </button>
            <button class="btn btn-primary" @click="handleResetPassword">
              确定
            </button>
          </div>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<style scoped>
.employees-page {
  padding: 3rem 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
}

/* 员工网格 */
.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.employee-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.employee-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 107, 107, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(255, 107, 107, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.employee-avatar {
  flex-shrink: 0;
}

.avatar-inner {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.employee-info {
  flex: 1;
  min-width: 0;
}

.employee-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.employee-email {
  white-space: nowrap;
}

.duty-status {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.employee-card.inactive {
  opacity: 0.65;
  filter: grayscale(0.5);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-color: rgba(102, 126, 234, 0.2);
}

.btn-edit:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.4);
}

.btn-reset {
  background: rgba(255, 221, 61, 0.1);
  color: #ffd93d;
  border-color: rgba(255, 221, 61, 0.2);
}

.btn-reset:hover {
  background: rgba(255, 221, 61, 0.2);
  border-color: rgba(255, 221, 61, 0.4);
}

.btn-delete {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.2);
}

.btn-delete:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.4);
}

/* 对话框 */
.dialog-form {
  padding: 1rem 0;
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

/* 响应式 */
@media (max-width: 768px) {
  .employees-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
