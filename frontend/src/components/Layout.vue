<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isAdmin = computed(() => authStore.user?.role === "ADMIN");

const menuItems = computed(() => {
  const items = [
    {
      path: "/duty",
      name: "值日安排",
      icon: "📅",
    },
  ];
  if (isAdmin.value) {
    items.push({
      path: "/employees",
      name: "员工管理",
      icon: "👥",
    });
    items.push({
      path: "/rotation-order",
      name: "值日顺序",
      icon: "🔄",
    });
  }

  items.push({
    path: "/change-password",
    name: "修改密码",
    icon: "🔑",
  });

  return items;
});

const isActive = (path: string) => {
  return route.path === path;
};

const navigate = (path: string) => {
  router.push(path);
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-badge">1611</div>
        <h1 class="sidebar-title">值日系统</h1>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in menuItems"
          :key="item.path"
          :class="['nav-item', { active: isActive(item.path) }]"
          @click="navigate(item.path)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">
            {{ authStore.user?.username?.charAt(0) }}
          </div>
          <div class="user-info">
            <div class="user-name">{{ authStore.user?.username }}</div>
            <div class="user-role">{{ isAdmin ? "管理员" : "员工" }}</div>
          </div>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <span>退出登录</span>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-area">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-badge {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
  margin-bottom: 1rem;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 导航菜单 */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  border-radius: 16px;
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(
    135deg,
    rgba(250, 112, 154, 0.2) 0%,
    rgba(254, 225, 64, 0.2) 100%
  );
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-text {
  flex: 1;
  text-align: left;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.btn-logout {
  width: 100%;
  padding: 0.875rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 16px;
  color: #ff6b6b;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.4);
  transform: translateY(-2px);
}

/* 主内容区 */
.main-area {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .sidebar-title,
  .nav-text,
  .user-info,
  .btn-logout span {
    display: none;
  }

  .sidebar-header {
    padding: 1.5rem 1rem;
  }

  .logo-badge {
    margin: 0 auto;
  }

  .nav-item {
    justify-content: center;
    padding: 1rem;
  }

  .user-card {
    justify-content: center;
    padding: 0.75rem;
  }

  .btn-logout {
    padding: 0.75rem;
    font-size: 1.25rem;
  }

  .main-area {
    margin-left: 80px;
  }
}
</style>
