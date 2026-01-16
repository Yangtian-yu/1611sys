import apiClient from "./client";
import type { LoginRequest, LoginResponse } from "@/types";

export const login = (data: LoginRequest) => {
  return apiClient.post<LoginResponse>("/auth/login", data);
};

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const changePassword = (data: ChangePasswordData) =>
  apiClient.post<{ success: boolean; message: string }>(
    "/auth/change-password",
    data
  );
