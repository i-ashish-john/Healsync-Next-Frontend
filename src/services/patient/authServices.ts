import axiosInstance from "./InstanceAuthServices";
import { LoginData, SignupData } from "../../types/index";

export const signupUser = async (userData: SignupData) => {
  try {
    const response = await axiosInstance.post("/signup", userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message || "Signup process failed");
    }
  }
};

export const loginUser = async (loginData: LoginData) => {
  try {
    const response = await axiosInstance.post("/login", loginData);
    
    sessionStorage.setItem("isAuthenticated", "true");
  
    if (response.data.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message || "Login failed");
    }
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
    // Remove authentication state
    sessionStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
  } catch (error: any) {
    console.error("Logout error:", error);
    // Even if the server logout fails, remove the auth state
    sessionStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    
    // If this succeeds, ensure we mark the user as authenticated
    sessionStorage.setItem("isAuthenticated", "true");
    
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      sessionStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
    }
    throw error;
  }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  // Check both session storage (for cookie auth) and localStorage (for token auth)
  return sessionStorage.getItem("isAuthenticated") === "true" || 
         !!localStorage.getItem("accessToken");
};