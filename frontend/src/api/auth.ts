/**
 * 认证相关 API
 */

import { http } from "./http";
import type { User } from "@/types";

// ============ 请求类型 ============

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: User;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ============ API 方法 ============

/**
 * 用户登录
 */
export function login(data: LoginRequest): Promise<LoginResult> {
  return http.post<LoginResult>("/auth/login", data, {
    skipAuth: true,
    showError: true,
  });
}

/**
 * 修改密码
 */
export function changePassword(data: ChangePasswordRequest): Promise<void> {
  return http.post<void>("/auth/change-password", data);
}
