"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { forgotPassword } from "../../../services/doctor/doctorService";

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to access query parameters
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [accessAllowed, setAccessAllowed] = useState(false);

  useEffect(() => {
    // Check for the 'from' query parameter
    const from = searchParams.get("from");
    if (from === "login") {
      setAccessAllowed(true); // Allow access if coming from login page
    } else {
      router.push("/doctor/login"); // Redirect to login if no valid parameter
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      toast.success("Password reset link sent to your email");
      setSent(true);
    } catch (err) {
      toast.error((err instanceof Error ? err.message : "Failed to send reset link"));
    } finally {
      setLoading(false);
    }
  };

  // If not allowed to access this page, don't render anything
  if (!accessAllowed) {
    return null; // useEffect will handle the redirect
  }

  // If showing success message after sending email
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-purple-600 p-4 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Sent!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-semibold">{email}</span>. 
              The link will expire in 5 minutes.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you don't receive the email within a few minutes, please check your spam folder.
            </p>
            <Link href="/doctor/login" className="inline-block bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-200">
              Return to Login
            </Link>
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image and text */}
      <div className="hidden md:flex md:w-1/2 bg-purple-600 text-white p-8 flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <div className="mb-8 bg-white p-4 rounded-full">
            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-lg text-center max-w-md">
            Enter your email address below, and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
            <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link href="/doctor/login" className="text-purple-600 hover:text-purple-800 font-medium">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}