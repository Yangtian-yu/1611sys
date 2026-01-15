import apiClient from "./client";
import type { LoginRequest, LoginResponse } from "@/types";

export const login = (data: LoginRequest) => {
  return apiClient.post<LoginResponse>("/auth/login", data);
};
