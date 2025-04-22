"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginDoctor } from "../../../services/doctor/doctorService";

export default function DoctorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "", form: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors: { [key: string]: string } = {};
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginDoctor(formData);
      // loginDoctor dispatches auth data internally
      toast.success(response.message || "Login successful!");
      router.push("/doctor/dashboard");
    } catch (err: any) {
      const msg = err.message || "Login failed. Please try again.";
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side */}
        <div className="hidden md:flex md:w-1/2 bg-purple-600 text-white p-8 flex-col justify-center items-center relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <Image
              src="/image (1).jpg"
              alt="Doctor"
              width={300}
              height={400}
              className="rounded-lg shadow-xl mb-8"
            />
            <h2 className="text-3xl font-bold mb-4">Welcome Back, Doctor</h2>
            <p className="text-lg text-center max-w-md">
              Access your dashboard to manage appointments, view patient records, and more.
            </p>
          </div>
        </div>

        {/* Right side login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800">Doctor Login</h1>
              <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
            </div>

            {errors.form && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                  placeholder="doctor@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Link href="/doctor/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 flex justify-center"
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/doctor/signup" className="text-purple-600 hover:text-purple-800 font-medium">
                  Sign up
                </Link>
              </p>
              <Link href="/" className="block mt-2 text-purple-600 hover:text-purple-800">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
