import apiClient from "./client";
import type { ApiResponse, DutySchedule } from "@/types";

export const getDutySchedule = () => {
  return apiClient.get<ApiResponse<DutySchedule>>("/duty/current");
};
