"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyOtp, resendOtp } from "../../../services/doctor/doctorService";

export default function OtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState<number>(60);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Redirect back if no email
  useEffect(() => {
    if (!email) {
      toast.error("No email provided—redirecting to signup");
      router.push("/doctor/signup");
      return;
    }
    // auto-focus first box
    inputRefs.current[0]?.focus();
  }, [email, router]);

  // countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(id);
          setResendDisabled(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[idx] = val;
    setOtp(nextOtp);
    if (val && idx < 5) inputRefs.current[idx+1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx-1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Enter all 6 digits!");

    setLoading(true);
    try {
      const res = await verifyOtp(email, code);
      if (res.success) {
        localStorage.removeItem("signupData");
        toast.success("OTP verified! Redirecting…");
        setTimeout(() => router.push("/doctor/login"), 1000);
      } else {
        toast.error(res.message || "Verification failed");
      }
    } catch (err: any) {
      if (err.message.includes("expired")) {
        toast.error("⏰ OTP expired. Click “Resend” to get a new one.");
      } else {
        toast.error(err.message || "Verification error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setTimer(60);
    try {
      const res = await resendOtp(email);
      if (res.success) {
        toast.success(res.message);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        toast.error(res.message);
        setResendDisabled(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-purple-600 text-white p-8 items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative z-10 text-center">
          <Image src="/image (1).jpg" alt="Doctor" width={300} height={400} className="rounded-lg shadow-xl mb-8" />
          <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
          <p className="text-lg max-w-md mx-auto">
            We've sent a code to <b>{email}</b>. Enter it below.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  value={digit}
                  onChange={e => handleChange(e.target.value, i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  ref={el => (inputRefs.current[i] = el)}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white rounded bg-purple-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
              }`}
            >
              {loading ? "Verifying…" : "Verify Code"}
            </button>
          </form>
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-600 mr-2">
              {resendDisabled ? `Resend in ${timer}s` : "Didn't get it?"}
            </span>
            <button
              onClick={handleResend}
              disabled={resendDisabled}
              className={`font-medium ${
                resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-purple-600 hover:text-purple-800"
              }`}
            >
              Resend
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
