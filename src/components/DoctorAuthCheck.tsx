"use client";

import { ReactNode } from 'react';
import { useDoctorAuth } from '../hooks/useDoctorAuth';

interface DoctorAuthCheckProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function DoctorAuthCheck({ 
  children, 
  redirectTo = '/doctor/login' 
}: DoctorAuthCheckProps) {
  const { loading } = useDoctorAuth(redirectTo);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}