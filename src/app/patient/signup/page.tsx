"use client";
import { useState } from "react";
import { SignupData } from "@/src/Types/types";
import { signupUser } from "@/src/services/authServices";

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
      setMessage(error.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-96 hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center mb-6 text-purple-800">Sign Up</h2>
        {message && (
          <p className={`text-center ${isError ? 'text-red-500' : 'text-green-500'} mb-4`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 outline-none hover:border-purple-300 bg-white/50"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 outline-none hover:border-purple-300 bg-white/50"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2.5 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 outline-none hover:border-purple-300 bg-white/50"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}