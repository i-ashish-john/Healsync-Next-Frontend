import axiosInstance from './InstanceDoctorService';
import { LoginData, SignupData, AuthResponse, OtpResponse } from '../../types/index';
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
    throw error;
  }
};

export const sendSignupOTP = async (email: string, formData: SignupData): Promise<OtpResponse> => {
  try {
    const { email: _, ...restFormData } = formData;
    const response = await axiosInstance.post('/doctor/send-otp', { 
      email, 
      ...restFormData,
      role: 'doctor'
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

export const verifyOtp = async (email: string, otp: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/doctor/verify-otp', { email, otp });
    
    if (response.data.success) {
      const { data } = response.data;
      store.dispatch(setAuthData({ 
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role || 'doctor',
        },
        accessToken: response.data.accessToken,
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
// doctorService.ts
export const loginDoctor = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/doctor/login', loginData);
    const { success, message, data, accessToken } = response.data;
    if (!success) throw new Error(message);
    if (data.role !== 'doctor') throw new Error('Invalid account type.');
    store.dispatch(setAuthData({ user: { id: data.id, name: data.name, email: data.email, role: data.role }, accessToken }));
    localStorage.setItem('accessToken', accessToken); // Add this
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

export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const res = await axiosInstance.post('/doctor/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.post('/doctor/reset-password', { email, token, newPassword });
    return res.data;
  } catch (error: any) {
    if (error.response && error.response.status === 410) {
      throw new Error('The reset token has expired');
    } else if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to reset password');
    }
  }
};

export const getCurrentDoctor = async () => {
  try {
    const response = await axiosInstance.get('/me');
    
    if (response.data.success && response.data.data) {
      const userData = response.data.data;
      store.dispatch(setAuthData({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'doctor'
        },
        accessToken: store.getState().auth.accessToken || localStorage.getItem('accessToken') || '',
      }));
      return {
        success: true,
        data: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'doctor',
          createdAt: userData.createdAt,
        },
      };
    }
    
    throw new Error('Failed to fetch doctor data');
  } catch (error) {
    // Don't clear the auth state here; preserve existing state
    console.error('Error fetching current doctor:', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated;
};

export const isDoctor = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated && state.auth.user?.role === 'doctor';
};
//temporary 
//calling patients in dashboard 
export const getAllPatients = async () => {
  const resp = await axiosInstance.get('/doctor/patients');
  if (!resp.data.success) throw new Error('Failed to load patients');
  return resp.data.data as Array<{ _id: string; email: string; name: string; blocked: boolean }>;
};
