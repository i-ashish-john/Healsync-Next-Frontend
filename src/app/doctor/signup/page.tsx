"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sendSignupOTP } from '../../../services/doctor/doctorService';
import { SignupData } from '../../../types/index';

export default function DoctorSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    // if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    // else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
    
      await sendSignupOTP(formData.email, formData);
      localStorage.setItem('signupData', JSON.stringify(formData)); // Store signup data
      router.push(`/doctor/verify-otp?email=${encodeURIComponent(formData.email)}`);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.response && error.response.data) {
        setErrors({ form: error.response.data.message || 'Registration failed. Please try again.' });
      } else if (error.message === 'Email already registered') {
        setErrors({ email: 'This email is already registered', form: 'An account with this email already exists.' });
      } else {
        setErrors({ form: error.message || 'Failed to send OTP. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with doctor image and info */}
      <div className="hidden md:flex md:w-1/2 bg-purple-600 text-white p-8 flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <Image 
            src="/image (1).jpg"
            alt="Doctor" 
            width={300} 
            height={300}
            style={{
              width: 'auto',
              height: 'auto'
            }}
            className="rounded-lg shadow-xl mb-8" 
          />
          <h2 className="text-3xl font-bold mb-4">Join Our Medical Team</h2>
          <p className="text-lg text-center max-w-md">
            Create an account to connect with patients, manage appointments, and grow your practice.
          </p>
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Doctor Registration</h1>
            <p className="text-gray-600 mt-2">Create your account to get started</p>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                placeholder="Dr. John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                placeholder="doctor@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div> */}
            </div>

            <div className="pt-2">
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
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/doctor/login" className="text-purple-600 hover:text-purple-800 font-medium">
                Sign in
              </Link>
            </p>
            <Link href="/" className="block mt-2 text-purple-600 hover:text-purple-800">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}