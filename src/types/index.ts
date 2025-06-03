export interface SignupData {
  username: string;
  email: string;
  password: string;
  role?: string; 
  // confirmPassword:string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface LoginData {
  email: string;
  password: string;
  role?: string;
  blocked:boolean;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface ProfileData extends UserData {
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  profilePicture?: string;
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
  data: {
    id: string;
    name: string;
    email: string;
    role: string;      // ← make sure role is here
    blocked:boolean;
    accessToken: string;  
  };
  // accessToken: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: any;
}

// Define auth state for easy reuse
export interface AuthState {
  user: UserData | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
}

