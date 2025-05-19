"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Users, FileText, Settings, Bell, User, LogOut, Home, CheckCircle, Clock, Shield } from 'lucide-react';
import { useDoctorAuth } from '../../../hooks/useDoctorAuth';
import { logoutDoctor, getCurrentDoctor } from '../../../services/doctor/doctorService';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface DoctorData {
  name: string;
  email: string;
  role: string;
  blocked?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  alert?: boolean;
}

export default function DoctorDashboard() {
  const { isAuthenticated, user, loading } = useDoctorAuth();
  const router = useRouter();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await getCurrentDoctor();
        if (response.success) {
          setDoctorData({
            name: response.data.name || 'Unknown Doctor',
            email: response.data.email || 'No email provided',
            role: response.data.role || 'doctor',
            blocked: response.data.blocked || false,
            verificationStatus: response.data.verificationStatus || 'pending',
          });
        } else {
          throw new Error('Failed to fetch doctor data');
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        toast.error('Failed to load doctor data');
        if (user) {
          setDoctorData({
            name: user.name || 'Unknown Doctor',
            email: user.email || 'No email provided',
            role: user.role || 'doctor',
            blocked: false,
            verificationStatus: 'pending',
          });
        }
      }
    };

    if (isAuthenticated && !doctorData) fetchDoctorData();
  }, [isAuthenticated, user, doctorData]);

  useEffect(() => {
    const checkDoctorStatus = async () => {
      try {
        const response = await getCurrentDoctor();
        if (response.success && response.data.blocked) {
          toast.error('Your account has been blocked by the admin.');
          await logoutDoctor();
          router.push('/doctor/login');
        }
      } catch (error) {
        console.error('Error checking doctor status:', error);
        await logoutDoctor();
        router.push('/doctor/login');
      }
    };

    checkDoctorStatus();
    const interval = setInterval(checkDoctorStatus, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutDoctor();
      toast.success('Logged out successfully');
      router.push('/doctor/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!doctorData) {
    toast.error('Unable to load doctor data. Using fallback values.');
    setDoctorData({
      name: user?.name || 'Unknown Doctor',
      email: user?.email || 'No email provided',
      role: user?.role || 'doctor',
      blocked: false,
      verificationStatus: 'pending',
    });
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`bg-purple-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-center">
          {isSidebarOpen ? <h1 className="text-xl font-bold">Heal Sync</h1> : <h1 className="text-xl font-bold">MC</h1>}
        </div>
        <div className="mt-6">
          <SidebarItem icon={<Home size={20} />} label="Dashboard" isActive={activeTab === 'dashboard'} isCollapsed={!isSidebarOpen} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Calendar size={20} />} label="Appointments" isActive={activeTab === 'appointments'} isCollapsed={!isSidebarOpen} onClick={() => setActiveTab('appointments')} />
          <SidebarItem icon={<Users size={20} />} label="Patients" isActive={activeTab === 'patients'} isCollapsed={!isSidebarOpen} onClick={() => setActiveTab('patients')} />
          <SidebarItem icon={<FileText size={20} />} label="Medical Records" isActive={activeTab === 'records'} isCollapsed={!isSidebarOpen} onClick={() => setActiveTab('records')} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center">
              <button className="flex mx-4 text-gray-600 focus:outline-none">
                <Bell size={20} />
                <span className="absolute h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button className="flex items-center text-gray-700 focus:outline-none" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-purple-200 flex items-center justify-center">
                    <User size={16} className="text-purple-700" />
                  </div>
                  <span className="ml-2 font-medium">{doctorData?.name.split(' ')[0]}</span>
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isProfileDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link href="/doctor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100">
                      <div className="flex items-center"><User size={16} className="mr-2" /> Profile</div>
                    </Link>
                    <Link href="/doctor/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100">
                      <div className="flex items-center"><Settings size={16} className="mr-2" /> Settings</div>
                    </Link>
                    <hr className="my-1" />
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-purple-100" onClick={handleLogout}>
                      <div className="flex items-center"><LogOut size={16} className="mr-2" /> Logout</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {doctorData?.name}</h1>
            <p className="text-gray-600">Here's what's happening with your account today.</p>
          </div>
          <div className={`mb-6 p-4 rounded-lg flex items-center ${doctorData?.verificationStatus === 'verified' ? 'bg-green-100 border border-green-200' : doctorData?.verificationStatus === 'rejected' ? 'bg-red-100 border border-red-200' : 'bg-yellow-100 border border-yellow-200'}`}>
            {doctorData?.verificationStatus === 'verified' ? (
              <>
                <CheckCircle size={24} className="text-green-600 mr-3" />
                <div>
                  <h2 className="font-medium text-green-800">Account Verified</h2>
                  <p className="text-green-700 text-sm">Your doctor profile has been verified. You can now access all features.</p>
                </div>
              </>
            ) : doctorData?.verificationStatus === 'rejected' ? (
              <>
                <svg className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <h2 className="font-medium text-red-800">Verification Rejected</h2>
                  <p className="text-red-700 text-sm">Your verification was rejected. Please check your email for details and resubmit.</p>
                </div>
              </>
            ) : (
              <>
                <Clock size={24} className="text-yellow-600 mr-3" />
                <div>
                  <h2 className="font-medium text-yellow-800">Verification Pending</h2>
                  <p className="text-yellow-700 text-sm">Your account is under review. This usually takes 1-2 business days.</p>
                </div>
                <button className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm">Check Status</button>
              </>
            )}
          </div>
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <p className="text-gray-600">Email: {doctorData?.email}</p>
            <p className="text-gray-600">Role: {doctorData?.role}</p>
          </div>
        </main>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, isCollapsed, onClick, alert = false }) => {
  return (
    <button
      className={`flex items-center w-full p-3 ${isActive ? 'bg-purple-800 text-white' : 'text-purple-200 hover:bg-purple-800 hover:text-white'} transition-colors duration-200`}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {alert && <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>}
      </div>
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </button>
  );
};