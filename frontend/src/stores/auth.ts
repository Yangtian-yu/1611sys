import { defineStore } from "pinia";
import { ref } from "vue";
import { login as apiLogin, type LoginRequest } from "@/api/auth";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );

  const login = async (credentials: LoginRequest) => {
    const res = await apiLogin(credentials);
    token.value = res.accessToken;
    user.value = res.user;

    localStorage.setItem("token", res.accessToken);
    localStorage.setItem("user", JSON.stringify(res.user));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = () => !!token.value;

  return { token, user, login, logout, isAuthenticated };
});
