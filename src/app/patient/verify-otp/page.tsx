"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/services/patient/InstanceAuthServices";

export default function VerifyOtpPage() {
    const router = useRouter();
    const params = useSearchParams();
    const email = params.get("email") || "";
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [timer, setTimer] = useState(120);
    const [busy, setBusy] = useState(false);

    // countdown
    useEffect(() => {
        if (timer > 0) {
            const t = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [timer]);

    // auto‑focus next
    const onChange = (i: number, v: string) => {
        if (!/^\d?$/.test(v)) return;
        const nxt = [...code];
        nxt[i] = v;
        setCode(nxt);
        if (v && inputsRef.current[i + 1]) inputsRef.current[i + 1]!.focus();
    };

    useEffect(() => {
        // send OTP immediately
        const sendOtp = async () => {
            try {
                await axiosInstance.post("/auth/resend-signup-otp", { email });
                  toast.success("OTP sent");      
            } catch {
                  toast.success("Loading...");
            }
        };

        if (email) {
            sendOtp();
        } else {
            toast.error("Email is missing");
            router.push("/patient/signup");
        }
    }, [email, router]);

const handleVerify = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (code.some((c) => c === "")) {
        toast.error("Complete the 6‑digit code");
        return;
    }
    setBusy(true);
    try {
        const { data } = await axiosInstance.post("/auth/verify-signup-otp", {
            email, code: code.join("")
        });
        toast.success(data.message);
        router.push(`/patient/login?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Wrong code");
    } finally {
        setBusy(false);
    }
};

const resend = async () => {
    setBusy(true);
    try {
      console.log("Resending OTP for email:", email);
      await axiosInstance.post("/auth/resend-signup-otp", { email });
      toast.success("OTP resent");
      setTimer(120);
      setCode(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err) {
      console.error("resend failed:", err);
      toast.error("Couldn’t resend OTP");
    } finally {
      setBusy(false);
    }
  };

  if (!email) {
    router.push("/patient/signup");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4 text-purple-800">Verify your Email</h2>
        <p className="text-center mb-6 text-gray-600">Enter the 6‑digit code we’ve just sent to <b>{email}</b></p>

        <div className="flex justify-between mb-4 space-x-2">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              maxLength={1}
              value={d}
              onChange={(e) => onChange(i, e.target.value)}
              className="w-10 h-12 text-center text-xl font-mono rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600"
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            { timer > 0 
              ? `Expires in ${Math.floor(timer/60)}:${String(timer%60).padStart(2,'0')}` 
              : "Code expired" }
          </span>
          <button type="button"
            onClick={resend}
            disabled={timer > 0 || busy}
            className={`text-sm ${timer>0 ? "text-gray-400" : "text-purple-600"} ${
              busy ? "opacity-50" : "hover:underline"
            }`}
          >
            Resend
          </button>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          {busy ? "Verifying…" : "Verify Code"}
        </button>
      </form>
    </div>
  );
}
