"use client";

import { useState, useEffect } from 'react';
import { getCurrentAdmin } from '@/services/admin/adminService';
import type { AdminUser } from '@/store/admin/adminSlice';

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: AdminUser | null;
}

export const useAdminAuth = (): AuthState => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Single source of truth: hit /admin/me
    getCurrentAdmin()
      .then((admin) => {
        setUser(admin);
        setAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, isAuthenticated, user };
};
