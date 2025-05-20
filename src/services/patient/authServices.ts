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

    if (!data.role) {
      console.warn('Role missing in response');
    }

    const userData = {
        id: data.id,
        name: data.username, 
        email: data.email,
        role: data.role,
        blocked:data.blocked
      };

    localStorage.setItem('Patient-accessToken', data.accessToken);
                                                // saved to localstorage
    localStorage.setItem('Patient-data', JSON.stringify(userData));


    store.dispatch(setAuthData({
      accessToken: data.accessToken,
      user: userData,
    }));

    console.log('Redux state after login:', store.getState());
    return response.data;

  } catch (error: any) {
    console.log(error.response?.data);
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