import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { id: string; name: string; email: string; role: string } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isDoctor: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{ user: { id: string; name: string; email: string; role: string }; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isDoctor = action.payload.user.role === 'doctor';
      state.isAdmin = action.payload.user.role === 'admin';
      // Persist to local storage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    clearAuthData: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isDoctor = false;
      state.isAdmin = false;
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role || '';
export const selectIsDoctor = (state: { auth: AuthState }) => state.auth.isDoctor;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.isAdmin;

export default authSlice.reducer;