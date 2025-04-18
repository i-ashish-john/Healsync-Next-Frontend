// src/types/index.ts
export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}
export interface DashboardItem {
  id: number;
  title: string;
  count?: number;
  status?: string;
}

export interface DashboardData {
  success: boolean;
  message: string;
  data: {
    userId: string;
    dashboardItems: DashboardItem[];
    lastLogin: string;
  };
}
export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: UserData;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: any;
}