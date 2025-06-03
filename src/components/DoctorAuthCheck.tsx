"use client";

import { ReactNode } from 'react';
import { useDoctorAuth } from '@/hooks/useDoctorAuth';

interface DoctorAuthCheckProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function DoctorAuthCheck({ 
  children, 
  redirectTo = '/doctor/login' 
}: DoctorAuthCheckProps) {
  const { loading, isAuthenticated } = useDoctorAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-purple-600 rounded-full"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect via useDoctorAuth
  }

  return <>{children}</>;
}