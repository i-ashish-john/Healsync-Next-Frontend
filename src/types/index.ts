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