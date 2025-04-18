"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "../services/patient/authServices";
import { UserData } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
  redirectPath?: string; // Custom redirect path
}

export default function ProtectedRoute({ children, redirectPath = "/patient/login" }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        
        if (!isAuthenticated()) {
          router.push("/patient/login");
          return;
        }

        await getCurrentUser(); // Verify with backend
        setIsAuth(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setErrorMessage("Authentication failed. Please try again.");
        sessionStorage.removeItem("isAuthenticated");
        router.push("/patient/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Verifying your access...</p>
      </div>
    );
  }

  if (errorMessage && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p>An error occurred: {errorMessage}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => router.push(redirectPath || "/patient/login")}
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}