"use client";
import { useState } from "react";
import { SignupData } from "@/types/index";
import { signupUser } from "@/services/patient/authServices";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Separator } from "../../../components/ui/seperator";

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await signupUser(formData);
      setIsError(false);
      setMessage(response.message || "Signup successful!");
      // Clear form on success
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error: any) {
      setIsError(true);
      console.error("Signup error:", error);

      setMessage(error.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
     
      <div className="hidden lg:flex lg:w-1/2 bg-[#9333EA] relative flex-col">
        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-white [font-family:'Inter',Helvetica]">
            HealSync
          </h1>
        </div>

        <div className="flex items-center justify-center h-full p-8">
          <div className="max-w-md text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome to HealSync</h2>
            <p className="text-lg opacity-90">
              Connect with top healthcare professionals and manage your health journey seamlessly
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 800 400" className="w-full">
            <path 
              d="M 0 300 Q 200 200 400 300 T 800 300 L 800 400 L 0 400 Z" 
              fill="rgba(255,255,255,0.1)"
            />
          </svg>
        </div>
        
      </div>

      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[448px]">
        
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Create an account</h2>
            <p className="text-base text-gray-600">Sign up to get started!</p>
          </div>

          {message && (
            <div className={`mb-6 p-3 rounded-lg text-center ${isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Create a password"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <Separator />
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              or continue with
            </div>
          </div>

          
          <Button 
            variant="outline" 
            className="w-full border border-gray-300 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

         
          <p className="text-center text-sm text-gray-600 mt-8">
            By continuing, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/patient/login" className="text-purple-600 hover:underline">
              Sign in
            </Link>
          </p>

          {/* Back to Home */}
          <p className="text-center text-sm text-gray-600 mt-4">
            <Link href="/" className="text-purple-600 hover:underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}