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

export interface DutySchedule {
  weekStartDate: string;
  dutyDate: string;
  dutyUsers: DutyUser[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
