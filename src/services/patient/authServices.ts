// src/services/authServices.ts
import axios from "axios";
import { LoginData, SignupData } from "../types/index";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies (refresh token)
});

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        // Store new token and retry original request
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        
        // Update auth header and retry
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/patient/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

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
    
    // Store the token in localStorage
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
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
    await axiosInstance.post("/logout");
    localStorage.removeItem("accessToken");
  } catch (error: any) {
    console.error("Logout error:", error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/me");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    throw error;
  }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};