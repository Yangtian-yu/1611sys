import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Login from "@/views/Login.vue";
import DutySchedule from "@/views/DutySchedule.vue";
import Employees from "@/views/Employees.vue";
import ChangePassword from "@/views/ChangePassword.vue";

import RotationOrder from "@/views/RotationOrder.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      redirect: "/duty",
    },
    {
      path: "/duty",
      name: "DutySchedule",
      component: DutySchedule,
      meta: { requiresAuth: true },
    },
    {
      path: "/employees",
      name: "Employees",
      component: Employees,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/rotation-order",
      name: "RotationOrder",
      component: RotationOrder,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/change-password",
      name: "ChangePassword",
      component: ChangePassword,
      meta: { requiresAuth: true },
    },
    {
      path: "/entertainment/snake",
      name: "SnakeGame",
      component: () => import("@/views/entertainment/SnakeGame.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth !== false;
  const requiresAdmin = to.meta.requiresAdmin === true;

  if (requiresAuth && !authStore.isAuthenticated()) {
    next("/login");
  } else if (requiresAdmin && authStore.user?.role !== "ADMIN") {
    // 非管理员访问管理员页面，跳转到值日页面
    next("/duty");
  } else if (to.path === "/login" && authStore.isAuthenticated()) {
    next("/duty");
  } else {
    next();
  }
});

export default router;
