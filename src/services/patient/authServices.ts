// import axiosInstance from "./InstanceAuthServices";
// import { LoginData, SignupData,AuthResponse, DashboardData } from "../../types/index";
// import axios from "axios";

// export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
//   try {
//     const response = await axiosInstance.post("/signup", userData);
//     return response.data;
//   } catch (error: any) {
//     if (error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     } else {
//       throw new Error(error.message || "Signup process failed");
//     }
//   }
// };

// export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
//   try {
//     console.log('HAI--->>>>>>> BeFore');

//     const response = await axiosInstance.post("/login", loginData);
//     console.log('HAI--->>>>>>> After');
//     sessionStorage.setItem("isAuthenticated", "true");

//     // console.log('HAI--->>>>>>> AFter');
    
//     // console.log('<||||||>',response.data.data?.accessToken)
//     if (response.data.data?.accessToken) {
//       localStorage.setItem("accessToken", response.data.data.accessToken);
//     }
    
//     return response.data;
//   } catch (error: any) {
//     if (error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     } else {
//       throw new Error(error.message || "Login failed");
//     }
//   }
// };

// export const logoutUser = async (): Promise<void>  => {
//   try {
//     await axiosInstance.post("/auth/logout");
    
//     sessionStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("accessToken");
//   } catch (error: any) {
//     console.error("Logout error:", error);
//     // Handle logout error if needed
//     sessionStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("accessToken");
//   }
// };

// export async function getCurrentUser() {
//   try {
//     const response = await axiosInstance.get("/auth/me");
//     return response.data;
//   } catch (error: any) {
//     console.error("getCurrentUser error:", error);
//     throw new Error("Failed to fetch current user");
//   }
// }

// export const getDashboardData = async (): Promise<DashboardData> => {
//   try {
//     const response = await axiosInstance.get("/auth/dashboard");

//     return response.data;
//   } catch (error: any) {
//     if (error.response?.status === 401) {
//       clearAuthState();
//       throw new Error("Authentication required to access dashboard");
//     }
//     throw handleAuthError(error, "Failed to load dashboard data");
//   }
// };


// export const isAuthenticated = (): boolean => {
//   return sessionStorage.getItem("isAuthenticated") === "true";
// }
// // Helper functions
// const clearAuthState = (): void => {
//   sessionStorage.removeItem("isAuthenticated");
//   localStorage.removeItem("accessToken");
// };

// const handleAuthError = (error: any, defaultMessage: string): Error => {
//   const errorMessage = error.response?.data?.message || error.message || defaultMessage;
//   return new Error(errorMessage);
// };

import axiosInstance from './InstanceAuthServices';
import { LoginData, SignupData, AuthResponse } from '../../types/index';
import store from '../../store/authStore';
import { setAuthData, clearAuthData } from '../../store/authSlice';

export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/signup', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup process failed');
  }
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/login', loginData);
    const { data } = response.data;
    console.log('Login response:', data);
    store.dispatch(setAuthData({ user: { id: data.id, username: data.username, email: data.email }, accessToken: data.accessToken }));
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data); 
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
    store.dispatch(clearAuthData());
  } catch (error: any) {
    console.error('Logout error:', error);
    store.dispatch(clearAuthData()); // Clear anyway on error
  }
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

export const isAuthenticated = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated;
};

//// UPDATED: Path should match backend '/auth/forgot-password'
export const forgotPassword = async (email: string) => {
  try {
    const res = await axiosInstance.post("/forgotpassword", { email });
    console.log('Bro the issue is this =',res)
    return res.data;
  } catch (error: any) {
    console.error('frontend error--> service.ts', error);
    throw new Error(
      error.response?.data?.message || "Failed to initiate password reset"
    );
  }
};

// UPDATED: Added email parameter and modified to match backend requirements
export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<{success: boolean, message: string}> => {
  try {                                     //get so put auth in front
    const res = await axiosInstance.post("/resetpassword", {
      token, email, password, confirmPassword
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};

// NEW: Added function to verify token validity
export const verifyResetToken = async (
  token: string,
  email: string
): Promise<{valid: boolean}> => {
  try {
    const res = await axiosInstance.get("/auth/verifyresettoken", { params: { token, email } });
    return { valid: res.data.success };
  } catch (error: any) {
    console.log('invalid  token is this')
    return { valid: false };
  }
};