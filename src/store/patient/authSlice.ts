import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // Added role property
  blocked:boolean
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
    setAuthData: (state, action: PayloadAction<{user: User; accessToken: string}> ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    clearAuthData: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },

  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;