"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "../services/patient/authServices";
import { UserData } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // Optional roles for role-based auth
}

export default function ProtectedRoute({ children, roles = [] }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push("/patient/login");
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData.user);
        
        // Check if user has required role (if roles were specified)
        if (roles.length > 0 && !roles.includes(userData.user.role)) {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/patient/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, roles]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}