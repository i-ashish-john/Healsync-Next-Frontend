import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setAuthData } from './DoctorAuthSlice';

let persistedToken: string | null = null;
let persistedUserRaw: string | null = null;

if (typeof window !== 'undefined') {
  persistedToken = localStorage.getItem('accessToken');
  persistedUserRaw = localStorage.getItem('user');
}

const persistedUser = persistedUserRaw ? JSON.parse(persistedUserRaw) : null;

const preloadedState = {
  auth: {
    user: persistedUser,
    accessToken: persistedToken,
    isAuthenticated: !!persistedToken && !!persistedUser,
    isDoctor: persistedUser?.role === 'doctor',
    isAdmin: persistedUser?.role === 'admin',
  },
};

const store = configureStore({
  reducer: { auth: authReducer },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;