import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Login from "@/views/Login.vue";
import DutySchedule from "@/views/DutySchedule.vue";

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
  ],
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !authStore.isAuthenticated()) {
    next("/login");
  } else if (to.path === "/login" && authStore.isAuthenticated()) {
    next("/duty");
  } else {
    next();
  }
});

export default router;
