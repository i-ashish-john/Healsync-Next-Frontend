"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Calendar, Users, FileText, Settings, Bell, 
  User as UserIcon, LogOut, Home, CheckCircle, Clock 
} from 'lucide-react';
import { useDoctorAuth } from '@/hooks/useDoctorAuth';
import { logoutDoctor, getAllPatients } from '@/services/doctor/doctorService';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface Patient {
  _id: string;
  name: string;
  email: string;
  blocked: boolean;
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
  const { loading, isAuthenticated, user } = useDoctorAuth() as { loading: boolean; isAuthenticated: boolean; user?: { name?: string } };
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard'|'appointments'|'patients'|'records'>('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1) Auth redirect
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/doctor/login');
    }
  }, [loading, isAuthenticated, router]);

  // 2) Fetch patients once authenticated
useEffect(() => {
  if (isAuthenticated) {
    getAllPatients()
      .then(setPatients)
      .catch(err => toast.error(err.message || 'Failed to load patients. Please log in again.'));
  }
}, [isAuthenticated]);

  // 3) Sidebar toggle
  const toggleSidebar = () => setIsSidebarOpen(open => !open);

  // 4) Profile dropdown outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 5) Logout
  const handleLogout = async () => {
    try {
      await logoutDoctor();
      toast.success('Logged out successfully');
      router.replace('/doctor/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  // 6) Loading state
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-purple-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-purple-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
        <div className="p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold">{isSidebarOpen ? 'Heal Sync' : 'HS'}</h1>
        </div>
        <nav className="mt-6">
          <SidebarItem icon={<Home size={20}/>} label="Dashboard" isActive={activeTab==='dashboard'} isCollapsed={!isSidebarOpen} onClick={()=>setActiveTab('dashboard')} />
          <SidebarItem icon={<Calendar size={20}/>} label="Appointments" isActive={activeTab==='appointments'} isCollapsed={!isSidebarOpen} onClick={()=>setActiveTab('appointments')} />
          <SidebarItem icon={<Users size={20}/>} label="Patients" isActive={activeTab==='patients'} isCollapsed={!isSidebarOpen} onClick={()=>setActiveTab('patients')} />
          <SidebarItem icon={<FileText size={20}/>} label="Medical Records" isActive={activeTab==='records'} isCollapsed={!isSidebarOpen} onClick={()=>setActiveTab('records')} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none">
              {/* hamburger */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div className="flex items-center">
              <button className="relative mx-4 text-gray-600 focus:outline-none">
                <Bell size={20}/>
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button onClick={()=>setIsProfileDropdownOpen(v=>!v)} className="flex items-center text-gray-700">
                  <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                    <UserIcon size={16} className="text-purple-700"/>
                  </div>
                  <span className="ml-2 font-medium">{user?.name ? user.name.split(' ')[0] : ''}</span>
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={isProfileDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                    <Link href="/doctor/profile" className="block px-4 py-2 text-gray-700 hover:bg-purple-100">
                      <UserIcon size={16} className="inline mr-2"/> Profile
                    </Link>
                    <Link href="/doctor/settings" className="block px-4 py-2 text-gray-700 hover:bg-purple-100">
                      <Settings size={16} className="inline mr-2"/> Settings
                    </Link>
                    <hr className="my-1"/>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-purple-100">
                      <LogOut size={16} className="inline mr-2"/> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, Dr. {user?.name}</h1>
            <p className="text-gray-600">Here’s your patient list today.</p>
          </div>

          {activeTab === 'patients' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full text-left text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p._id} className="border-b hover:bg-gray-100">
                      <td className="px-6 py-4">{p.name}</td>
                      <td className="px-6 py-4">{p.email}</td>
                      <td className="px-6 py-4">
                        {p.blocked 
                          ? <span className="text-red-600">Blocked</span> 
                          : <span className="text-green-600">Active</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* other tabs (dashboard/appointments/records) go here */}
        </main>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, isCollapsed, onClick, alert = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 ${
      isActive 
        ? 'bg-purple-800 text-white' 
        : 'text-purple-200 hover:bg-purple-800 hover:text-white'
    } transition-colors duration-200`}
  >
    <div className="relative">
      {icon}
      {alert && <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>}
    </div>
    {!isCollapsed && <span className="ml-3">{label}</span>}
  </button>
);
