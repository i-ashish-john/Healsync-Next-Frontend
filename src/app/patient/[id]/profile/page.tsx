"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/patient/Route/ProtectedRoute";
import Link from "next/link";
import { toast } from "react-toastify";
import axiosInstance from "@/services/patient/InstanceAuthServices";
import { useForm } from "react-hook-form";
// import TopNavBar from "@/components/TopNavBar";
import { ProfileData } from "@/types/index";

// Mock appointment history for now
const mockAppointments = [
  { id: 1, doctor: "Dr. John Smith", date: "May 15, 2025", status: "Completed" },
  { id: 2, doctor: "Dr. Jane Doe", date: "April 20, 2025", status: "Completed" },
];

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ProfileData>({
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        if (response.data.success) {
          const profileData = response.data.data;
          setProfile(profileData);
          setValue("username", profileData.username);
          setValue("email", profileData.email);
          setValue("phoneNumber", profileData.phoneNumber || "");
          setValue("dateOfBirth", profileData.dateOfBirth || "");
          setValue("address", profileData.address || "");
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: ProfileData) => {
    try {
      const response = await axiosInstance.put("/profile", data);
      if (response.data.success) {
        setProfile({ ...profile, ...data }); // Update local state
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  // Custom validation for date of birth (must be in the past)
  const validateDateOfBirth = (value: string) => {
    if (!value) return true; // Allow empty since it's not required
    const selectedDate = new Date(value);
    const today = new Date("2025-06-03"); // Current date as per system
    return selectedDate < today || "Date of birth must be in the past";
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;
  }

  return (
    <ProtectedRoute>
      {/* <TopNavBar /> */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-8">
            <Link href="/patient/dashboard" className="text-purple-600 hover:underline mr-4">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4 overflow-hidden">
                    {profile.profilePicture ? (
                      <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold">{profile.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{profile.username}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Username *</label>
                    <input
                      type="text"
                      {...register("username", { required: "Username is required" })}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                      }`}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                      type="email"
                      {...register("email")}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone Number (Optional)</label>
                    <input
                      type="text"
                      {...register("phoneNumber")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                    <input
                      type="date"
                      {...register("dateOfBirth", { validate: validateDateOfBirth })}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.dateOfBirth ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Address (Optional)</label>
                    <textarea
                      {...register("address")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors duration-200"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Joined Date</label>
                  <p className="text-gray-800">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Appointment History</label>
                  <div className="space-y-2">
                    {mockAppointments.map((appointment) => (
                      <div key={appointment.id} className="border-t pt-2">
                        <p className="text-gray-800 font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.date} - {appointment.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}