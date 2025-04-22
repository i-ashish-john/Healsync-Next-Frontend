import axiosInstance from './InstanceDoctorService';
import { LoginData, SignupData, AuthResponse,OtpResponse } from '../../types/index';
import store from '../../store/doctor/DoctorAuthStore';
import { setAuthData, clearAuthData } from '../../store/doctor/DoctorAuthSlice';

export const signupDoctor = async (doctorData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/doctor/signup', doctorData);
    const data = response.data;
    
    if (response.status < 200 || response.status >= 300) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;

  } catch (error) {
    // throw new Error(error.response?.data?.message || 'Signup process failed');
    throw error 
  }
};


export const sendSignupOTP = async (email: string, formData: SignupData): Promise<OtpResponse> => {
  try {
    
    const { email: _, ...restFormData } = formData;
    const response = await axiosInstance.post('/doctor/send-otp', { email, ...restFormData });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};


export const verifyOtp = async (email: string, otp: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/doctor/verify-otp', { email, otp });
    const { accessToken, user } = response.data;
    
    if (response.data.success) {
      store.dispatch(setAuthData({ 
        user: { id: user.id, email: user.email }, 
        accessToken 
      }));
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

export const resendOtp = async (email: string): Promise<OtpResponse> => {
  try {
    const response = await axiosInstance.post('/doctor/resend-otp', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

export const loginDoctor = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/doctor/login', loginData);
    const { data } = response.data;
    store.dispatch(setAuthData({ user: { id: data.id, email: data.email }, accessToken: data.accessToken }));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutDoctor = async (): Promise<void> => {
  try {
    await axiosInstance.post('/doctor/logout');
    store.dispatch(clearAuthData());
  } catch (error: any) {
    console.error('Logout error:', error);
    store.dispatch(clearAuthData());
  }
};

export const getCurrentDoctor = async () => {
  const response = await axiosInstance.get('/doctor/auth/me');
  return response.data;
};

export const isAuthenticated = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated;
};