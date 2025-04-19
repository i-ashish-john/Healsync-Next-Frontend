"use client";
import { useState } from "react";
import { forgotPassword } from "../../../services/patient/authServices";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email");
      return;
    }

    try {
      const res = await forgotPassword(email);
      setSuccessMessage( `Reset link sent to ${email}`);
      setEmail("");
    } catch (err: any) {
      // Axios errors come through error.message
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
        <p className="text-gray-600 mb-4">
          Enter your email address and we’ll send you a link to reset your password
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              errorMessage ? "border-red-500" : "border-gray-300"
            } focus:ring-2 ${errorMessage ? "focus:ring-red-300" : "focus:ring-purple-600"}`}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Send reset link
          </button>
        </form>

        {successMessage && (
          <div className="mt-4 flex items-center space-x-2 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <p className="text-blue-600 text-center mt-4">
          <a href="/patient/login" className="hover:underline">
            ← Back to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
