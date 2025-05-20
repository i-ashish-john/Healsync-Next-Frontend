// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'; // Or your routing library
// import axiosInstance from '../services/doctor/InstanceDoctorService';

// export default function useDoctorAuth() {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       router.replace('/doctor/login');
//       setLoading(false);
//       return;
//     }

//     axiosInstance
//       .get('/doctors/me') // Your endpoint to fetch doctor data
//       .then((res) => {
//         if (!res.data.success || res.data.role !== 'doctor') {
//           localStorage.removeItem('accessToken'); // Clear invalid token
//           router.replace('/doctor/login');
//         }
//       })
//       .catch(() => {
//         localStorage.removeItem('accessToken'); // Clear on error
//         router.replace('/doctor/login');
//       })
//       .finally(() => setLoading(false));
//   }, [router]);

//   return { loading };
// }

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function useDoctorAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/doctor/login');
    } else {
      setIsAuthenticated(true); // Simplified; add real auth check if needed
    }
    setLoading(false);
  }, [router]);

  return { loading, isAuthenticated };
}