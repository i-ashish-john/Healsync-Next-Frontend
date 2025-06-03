// src/hooks/useDoctorAuth.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentDoctor } from '@/services/doctor/doctorService';
import { useDispatch } from 'react-redux';
import { clearAuthData } from '@/store/doctor/DoctorAuthSlice';
import { toast } from 'react-toastify';

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    blocked: boolean;
  } | null;
}

export function useDoctorAuth(): AuthState {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthState["user"]>(null);

  useEffect(() => {
    const checkDoctor = async () => {
      try {
        const doctor = await getCurrentDoctor();
        // If getCurrentDoctor resolves, doctor is not blocked
        setUser(doctor);
        setAuthenticated(true);
      } catch (err: any) {
        // If backend responded "blocked"
        if (err.message.includes("blocked")) {
          // Clear everything
          dispatch(clearAuthData());
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');

          // Show a toast—this will appear briefly on whatever page triggered the hook
          toast.error("Your account has been blocked by admin.", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });

          // If we’re not already on /doctor/login, redirect there with ?blocked=true
          if (pathname !== '/doctor/login') {
            router.replace('/doctor/login?blocked=true');
          }
        } else {
          // Any other error (e.g. not authenticated)
          dispatch(clearAuthData());
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          if (pathname !== '/doctor/login') {
            router.replace('/doctor/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkDoctor();
  }, [dispatch, pathname, router]);

  return { loading, isAuthenticated, user };
}
