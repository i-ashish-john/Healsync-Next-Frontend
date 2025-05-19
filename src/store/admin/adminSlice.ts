// src/store/admin/adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  accessToken: string | null;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    // payload: { user: AdminUser; accessToken: string }
    setAuthData: (
      state,
      action: PayloadAction<{ user: AdminUser; accessToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      // optional: mirror to localStorage if still needed
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    clearAuthData: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setAuthData, clearAuthData } = adminAuthSlice.actions;

// Selectors
export const selectIsAdmin = (state: { adminAuth: AdminAuthState }) =>
  state.adminAuth.isAuthenticated;
export const selectAdminUser = (state: {
  adminAuth: AdminAuthState;
}) => state.adminAuth.user;
export const selectAdminToken = (state: {
  adminAuth: AdminAuthState;
}) => state.adminAuth.accessToken;

export default adminAuthSlice.reducer;
