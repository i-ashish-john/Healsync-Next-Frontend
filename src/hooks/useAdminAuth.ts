"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin } from '@/services/admin/adminService';
import type { AdminUser } from '@/store/admin/adminSlice';

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: AdminUser | null;
}

export const useAdminAuth = (): AuthState => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Single source of truth: hit /admin/me
    const checkAuth = async () => {
      try {
        const admin = await getCurrentAdmin();
        if (admin.role !== 'admin') {
          throw new Error('Invalid role');
        }
        setUser(admin);
        setAuthenticated(true);
      } catch (error: any) {
        setUser(null);
        setAuthenticated(false);
        router.replace('/admin/AdminLogin'); // Redirect to admin login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { loading, isAuthenticated, user };
};