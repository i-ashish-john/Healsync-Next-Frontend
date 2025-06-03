import axiosInstance from './InstanceAdminService';
import store from '@/store/admin/adminStore'; // Adjusted path
import { setAuthData, clearAuthData, AdminUser } from '../../store/admin/adminSlice'; // Adjusted path

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  data?: { id: string; name: string; email: string; role: string };
}

interface UserRow {
  _id: string;
  email: string;
  role: string;
  blocked: boolean;
  name?: string;
}

export const loginAdmin = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const resp = await axiosInstance.post('/admin/login', loginData);
    const { success, data, accessToken } = resp.data;

    if (!success || !accessToken) throw new Error(resp.data.message);
    store.dispatch(
      setAuthData({ user: { id: data.id, name: data.name, email: data.email, role: data.role }, accessToken })
    );
    // Store the token in localStorage for persistence
    localStorage.setItem('accessToken', accessToken);
    return resp.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Admin login failed');
  }
};

export const logoutAdmin = async (): Promise<void> => {
  try {
  await axiosInstance.post('/admin/logout');
  store.dispatch(clearAuthData());
  } catch (error: any) {
    console.error('Logout error:', error);
    store.dispatch(clearAuthData());
  }
};


export const getCurrentAdmin = async (): Promise<AdminUser> => {
  const resp = await axiosInstance.get('/admin/me');
  if (!resp.data.success) throw new Error('Not authenticated');
  return resp.data.data;  // { id, role, name?, email? }
};

export const getAllPatients = async (): Promise<UserRow[]> => {
  try {
    const response = await axiosInstance.get('/admin/patients');

    console.log('Get all patients response:', response.data);
    if (response.data.success) {

      return response.data.data;
    }
    throw new Error('Failed to fetch patients');
  } catch (error: any) {
    console.error('Error fetching patients:', error.message);
    throw new Error(error.message || 'Failed to fetch patients');
  }
};

export const getAllDoctors = async (): Promise<UserRow[]> => {
  try {
    const response = await axiosInstance.get('/admin/doctors');
    console.log('Get all doctors response:', response.data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch doctors');
  } catch (error: any) {
    console.error('Error fetching doctors:', error.message);
    throw new Error(error.message || 'Failed to fetch doctors');
  }
};
// Fixed toggleBlockUser to handle success and error cases properly
export const toggleBlockUser = async (type: 'patients' | 'doctors', id: string, blocked: boolean): Promise<void> => {
  try {
    const action = blocked ? 'unblock' : 'block';
    const response = await axiosInstance.put(`/admin/${type}/${id}/${action}`);
    if (!response.data.success) {
      throw new Error(response.data.message || `Failed to ${action} user`);
    }
  } catch (error: any) {
    const message = error.response?.data?.message || `Failed to ${blocked ? 'unblock' : 'block'} user`;
    throw new Error(message);
  }
};