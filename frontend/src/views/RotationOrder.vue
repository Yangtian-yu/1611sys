<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUsers, reorderUsers, type User } from "@/api/user";
import { ElMessage } from "element-plus";
import Layout from "@/components/Layout.vue";
import Sortable from "sortablejs";

const users = ref<User[]>([]);
const loading = ref(false);
const usersListRef = ref<HTMLElement | null>(null);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const data = await getUsers();
    users.value = data
      .filter((u) => u.role === "EMPLOYEE")
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  } catch (error: any) {
    // 错误已在 http 层统一处理
  } finally {
    loading.value = false;
  }
};

const initSortable = () => {
  if (!usersListRef.value) return;

  Sortable.create(usersListRef.value, {
    animation: 150,
    ghostClass: "ghost-card",
    onEnd: async (evt: any) => {
      const { oldIndex, newIndex } = evt;
      if (
        oldIndex === undefined ||
        newIndex === undefined ||
        oldIndex === newIndex
      )
        return;

      // 更新本地数组顺序
      const movedItem = users.value.splice(oldIndex, 1)[0];
      users.value.splice(newIndex, 0, movedItem);

      // 准备后端需要的数据格式 (只需 ID 数组)
      const reorderData = users.value.map((user) => user.id);

      try {
        await reorderUsers(reorderData);
        ElMessage.success("排序已保存");
      } catch (error: any) {
        ElMessage.error("保存排序失败");
        fetchUsers(); // 失败时回滚
      }
    },
  });
};

onMounted(async () => {
  await fetchUsers();
  initSortable();
});
</script>

<template>
  <Layout>
    <div class="rotation-order-page">
      <div class="page-header">
        <h2 class="page-title gradient-text">值日轮流顺序</h2>
        <p class="page-subtitle">拖拽员工卡片调整值日的轮流顺序</p>
      </div>

      <div class="order-container" v-loading="loading">
        <div ref="usersListRef" class="order-list">
          <div
            v-for="user in users"
            :key="user.id"
            class="order-item"
            :class="{ inactive: !user.isActive }"
          >
            <div class="drag-handle">
              <span class="handle-icon">⠿</span>
            </div>
            <div class="user-avatar-small">
              {{ user.username.charAt(0) }}
            </div>
            <div class="user-info">
              <div class="name-container">
                <span class="user-name">{{ user.username }}</span>
                <el-tag
                  v-if="!user.isActive"
                  type="danger"
                  size="small"
                  effect="dark"
                  class="m-left"
                  >免战中</el-tag
                >
              </div>
              <span class="user-email">{{ user.email }}</span>
            </div>
            <div class="order-badge">第 {{ users.indexOf(user) + 1 }} 位</div>
          </div>
        </div>
      </div>

      <div class="order-tips">
        <div class="tip-icon">💡</div>
        <p>
          排序调整后，系统将按照此顺序进行每周自动排班。调整排序不会影响本周已生成的排班，将从下周生效。
        </p>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.rotation-order-page {
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
  font-size: 1rem;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: grab;
  transition: all 0.3s ease;
}

.order-item.inactive {
  opacity: 0.6;
  background: rgba(0, 0, 0, 0.1);
}

.order-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateX(4px);
}

.order-item:active {
  cursor: grabbing;
}

.ghost-card {
  opacity: 0.5;
  background: rgba(102, 126, 234, 0.2);
  border: 2px dashed #667eea;
}

.drag-handle {
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: grab;
}

.user-avatar-small {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.25rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.name-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.m-left {
  margin-left: 0.5rem;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-email {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.order-badge {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 600;
}

.order-tips {
  margin-top: 3rem;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  border-left: 4px solid #667eea;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.tip-icon {
  font-size: 1.5rem;
}

.order-tips p {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}
</style>
