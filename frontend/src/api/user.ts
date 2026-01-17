/**
 * 用户管理相关 API
 */

import { http } from "./http";

// ============ 类型定义 ============

export interface User {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  isActive?: boolean;
}

// ============ API 方法 ============

/**
 * 获取所有用户
 */
export function getUsers(): Promise<User[]> {
  return http.get<User[]>("/users");
}

/**
 * 创建用户
 */
export function createUser(data: CreateUserRequest): Promise<User> {
  return http.post<User>("/users", data);
}

/**
 * 更新用户
 */
export function updateUser(id: string, data: UpdateUserRequest): Promise<User> {
  return http.put<User>(`/users/${id}`, data);
}

/**
 * 删除用户
 */
export function deleteUser(id: string): Promise<void> {
  return http.delete<void>(`/users/${id}`);
}

/**
 * 批量重排序用户
 */
export function reorderUsers(userIds: string[]): Promise<void> {
  return http.put<void>("/users/reorder/batch", { userIds });
}

/**
 * 重置用户密码
 */
export function resetPassword(id: string, newPassword: string): Promise<void> {
  return http.post<void>(`/users/${id}/reset-password`, { newPassword });
}
