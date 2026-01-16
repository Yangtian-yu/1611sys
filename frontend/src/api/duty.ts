import apiClient from "./client";
import type { ApiResponse, DutySchedule } from "@/types";

export const getDutySchedule = () => {
  return apiClient.get<ApiResponse<DutySchedule>>("/duty/current");
};

export const updateDutySchedule = (dutyCount: number) => {
  return apiClient.put<ApiResponse<DutySchedule>>("/duty/current", {
    dutyCount,
  });
};
