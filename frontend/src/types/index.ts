/**
 * 业务类型定义
 */

// ============ 用户相关 ============

export interface User {
  id: string;
  username: string;
  role: "ADMIN" | "EMPLOYEE";
}

export interface DutyUser {
  id: string;
  username: string;
  email: string;
}

// ============ 值日相关 ============

export interface DutySchedule {
  weekStartDate: string;
  dutyDate: string;
  dutyUsers: DutyUser[];
}

// ============ 导出 API 类型 ============

export * from "./api";
