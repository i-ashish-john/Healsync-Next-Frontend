 "use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { verifyResetToken, resetPassword } from "../../../services/patient/authServices";

// Zod schema for password strength and match
const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ConfirmPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(true);
  const alreadyVerified = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Verify token once on mount
  useEffect(() => {
    if (alreadyVerified.current) return;
    if (!token || !email) {
      toast.error("Invalid reset link");
      router.push("/patient/forgotpassword");
      return;
    }
    verifyResetToken(token, email)
      .then((res) => {
        if (!res.valid) {
          toast.error("Token expired or invalid");
          router.push("/patient/forgotpassword");
        }
      })
      .catch(() => {
        toast.error("Verification failed");
        router.push("/patient/forgotpassword");
      })
      .finally(() => {
        alreadyVerified.current = true;
        setLoading(false);
      });
  }, [token, email, router]);

  // Handle form submit
  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(token, email, data.password, data.confirmPassword);
      toast.success("Password reset successful!");
      router.push("/patient/login");
      
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Verifying link...</div>;
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-4"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Reset Password</h2>

          <div>
            <input
              type="password"
              placeholder="New Password"
              {...register("password")}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
