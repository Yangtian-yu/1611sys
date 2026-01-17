/**
 * 值日相关 API
 */

import { http } from "./http";
import type { DutySchedule } from "@/types";

// ============ 请求类型 ============

export interface UpdateDutyRequest {
  dutyCount: number;
}

// ============ API 方法 ============

/**
 * 获取当前周值日安排
 */
export function getDutySchedule(): Promise<DutySchedule> {
  return http.get<DutySchedule>("/duty/current");
}

/**
 * 更新当前周值日人数
 */
export function updateDutySchedule(dutyCount: number): Promise<DutySchedule> {
  return http.put<DutySchedule>("/duty/current", { dutyCount });
}
