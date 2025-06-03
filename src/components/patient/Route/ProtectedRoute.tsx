"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, checkUserStatus, logoutUser } from "../../../services/patient/authServices";
import { toast } from "react-toastify";
import store from "../../../store/patient/authStore";
import { clearAuthData } from "../../../store/patient/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectPath = "/patient/login" 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Start with loading
  const [isAuth, setIsAuth] = useState(false); // Only true if allowed

  const checkAuth = async () => {
    try {
      // Check if user is logged in
      if (!isAuthenticated()) {
        router.replace(redirectPath);
        return;
      }

      // Check if user is blocked
      await checkUserStatus();

      // If we get here, user is good—show the dashboard
      setIsAuth(true);
    } catch (error: any) {
      console.error("Auth check failed:", error);

      // If user is blocked
      if (error.message === "blocked") {
        toast.error("You have been blocked by the admin", {
          position: "top-right",
          autoClose: 3000,
        });

        // Log them out and clean up
        try {
          await logoutUser();
        } catch (logoutError) {
          console.error("Logout failed:", logoutError);
        }

        store.dispatch(clearAuthData());
        localStorage.removeItem("Patient-accessToken");
        localStorage.removeItem("Patient-data");

        // Redirect to login with a blocked flag
        router.push(`${redirectPath}?blocked=true`);
      } else {
        // Any other error, just redirect to login
        router.push(redirectPath);
      }
    } finally {
      setIsLoading(false); // Done checking
    }
  };

  useEffect(() => {
    checkAuth();

    // Optional: Keep checking every 30 seconds
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // Show loading screen while checking
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Verifying your access...</p>
      </div>
    );
  }

  // Only show dashboard if authenticated and not blocked
  return <>{isAuth ? children : null}</>;
}