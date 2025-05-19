import axios, { AxiosInstance } from 'axios';
import store from '@/store/admin/adminStore';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = store.getState().adminAuth.accessToken ||
                (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
  if (token) config.headers!['Authorization'] = `Bearer ${token}`;
  return config;
});

export default axiosInstance;