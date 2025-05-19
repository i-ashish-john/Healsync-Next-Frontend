'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/doctor/DoctorAuthStore';
import { selectIsAuthenticated, selectUserRole } from '../store/doctor/DoctorAuthSlice';
import { getCurrentDoctor } from '../services/doctor/doctorService';

export function useDoctorAuth(redirectTo = '/doctor/login') {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => selectIsAuthenticated(s));
  const userRole = useSelector((s: RootState) => selectUserRole(s));
  const user = useSelector((s: RootState) => s.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);

      // Check persisted state in local storage first
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'doctor') {
          setLoading(false);
          return; // User is authenticated and a doctor, no redirect needed
        }
      }

      // If not authenticated in Redux, redirect to login
      if (!isAuthenticated) {
        router.replace(redirectTo);
        setLoading(false);
        return;
      }

      // If authenticated in Redux, verify the role by fetching current doctor data
      try {
        await getCurrentDoctor();
        const updatedRole = selectUserRole(store.getState());

        if (updatedRole !== 'doctor') {
          router.replace(redirectTo);
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        // Only redirect if there's no persisted state
        if (!storedToken || !storedUser) {
          router.replace(redirectTo);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, router, redirectTo]);

  return { loading, isAuthenticated, user };
}