import client from "./client";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  email: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  isActive?: boolean;
}

export const getUsers = () =>
  client.get<{ success: boolean; data: User[] }>("/users");

export const createUser = (data: CreateUserData) =>
  client.post<{ success: boolean; data: User; message: string }>(
    "/users",
    data
  );

export const updateUser = (id: number, data: UpdateUserData) =>
  client.put<{ success: boolean; data: User; message: string }>(
    `/users/${id}`,
    data
  );

export const deleteUser = (id: number) =>
  client.delete<{ success: boolean; message: string }>(`/users/${id}`);

export const reorderUsers = (userIds: number[]) =>
  client.put<{ success: boolean; message: string }>("/users/reorder/batch", {
    userIds,
  });

export const resetPassword = (id: number, newPassword: string) =>
  client.post<{ success: boolean; message: string }>(
    `/users/${id}/reset-password`,
    { newPassword }
  );
