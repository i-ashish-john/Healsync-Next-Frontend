"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { resetPassword } from "../../../services/doctor/doctorService";

export default function ResetPassword() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [resetSuccessful, setResetSuccessful] = useState(false);

  // Validate token and email presence immediately
  useEffect(() => {
    if (!email || !token) {
      // No token or email in URL, redirect to login
      router.push("/doctor/login");
      return;
    }

    // Here you should validate the token with your API
    // For now, we'll assume the token is valid if it exists
    setTokenValid(true);
  }, [email, token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};
    
    if (!passwordData.newPassword) {
      validationErrors.newPassword = "Password is required";
    } else if (passwordData.newPassword.length < 8) {
      validationErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!passwordData.confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const res = await resetPassword(email, token, passwordData.newPassword);
      setResetSuccessful(true);
      toast.success("Password reset successful!");
      // Redirect after a few seconds
      setTimeout(() => {
        router.push("/doctor/login");
      }, 3000);
    } catch (err: any) {
      if (err.message === 'The reset token has expired') {
        toast.error('The reset token has expired. Please request a new one.');
        setTimeout(() => {
          router.push("/doctor/login");
        }, 2000);
      } else {
        toast.error(err.message || "Failed to reset password");
        if (err.message?.includes("expired")) {
          setTimeout(() => {
            router.push("/doctor/login");
          }, 2000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // If token is invalid, don't render the page
  if (!tokenValid) {
    return null; // The useEffect will handle redirect
  }

  // If reset was successful
  if (resetSuccessful) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-purple-600 p-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <Link href="/doctor/login" className="inline-block bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-200">
              Go to Login
            </Link>
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image and text */}
      <div className="hidden md:flex md:w-1/2 bg-purple-600 text-white p-8 flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <div className="mb-8 bg-white p-4 rounded-full">
            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Create New Password</h2>
          <p className="text-lg text-center max-w-md">
            Your new password must be different from previously used passwords and at least 8 characters long.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
            <p className="text-gray-600 mt-2">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                placeholder="••••••••"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 flex justify-center items-center"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Password'
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>This reset link is valid for 5 minutes</p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link href="/doctor/login" className="text-purple-600 hover:text-purple-800 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}