import axiosInstance from './InstanceAuthServices';
import { LoginData, SignupData, AuthResponse } from '../../types/index';
import store from '../../store/patient/authStore';
import { setAuthData, clearAuthData } from '../../store/patient/authSlice';

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
    console.log('Login response:<<<<<<<<------', data);

    if (!response.data.success && response.data.message === 'You are blocked by admin') {
      throw new Error('blocked');
    }

    if (!data.role) {
      console.warn('Role missing in response');
    }

    const userData = {
      id: data.id,
      name: data.username,
      email: data.email,
      role: data.role,
      blocked: data.blocked
    };

    localStorage.setItem('Patient-accessToken', data.accessToken);
    localStorage.setItem('Patient-data', JSON.stringify(userData));

    store.dispatch(setAuthData({
      accessToken: data.accessToken,
      user: userData,
    }));

    console.log('Redux state after login:', store.getState());
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data);
    if (error.message === 'blocked') {
      throw new Error('blocked');
    }
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const accessToken = store.getState().auth.accessToken || localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    await axiosInstance.post('/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    store.dispatch(clearAuthData());
    localStorage.removeItem('Patient-accessToken');
    localStorage.removeItem('Patient-data');

  } catch (error: any) {
    console.error('Logout error:', error);
    store.dispatch(clearAuthData());
    localStorage.removeItem('accessToken');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403 && error.response?.data?.message === 'You are blocked by admin') {
      throw new Error('blocked');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch current user');
  }
};

export const checkUserStatus = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    console.log('checkUserStatus response:', response.data);

    // Check if the response indicates the user is blocked
    if (response.data?.data?.blocked === true) {
      throw new Error('blocked');
    }

    return response.data;
  } catch (error: any) {
    console.log('checkUserStatus error:', error.response?.data);
    // Handle blocked user scenarios
    if (
      error.response?.status === 403 && 
      error.response?.data?.message === 'You are blocked by admin'
    ) {
      throw new Error('blocked');
    }
    // Re-throw other errors with a generic message
    throw new Error(error.response?.data?.message || 'Failed to check user status');
  }
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