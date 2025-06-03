"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Calendar, Users, FileText, Settings, Bell, 
  User as UserIcon, LogOut, Home, CheckCircle, Clock, Upload 
} from 'lucide-react';
import { useDoctorAuth } from '@/hooks/useDoctorAuth';
import { logoutDoctor, getAllPatients, getCurrentDoctor } from '@/services/doctor/doctorService';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'patients' | 'records' | 'documents'>('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch patients
  useEffect(() => {
    if (isAuthenticated) {
      getAllPatients()
        .then(setPatients)
        .catch(err => toast.error(err.message || 'Failed to load patients. Please log in again.', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }));
    }
  }, [isAuthenticated]);

  // Periodic check for blocked status (every 10 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkBlockedStatus = async () => {
      try {
        const doctor = await getCurrentDoctor(); // Throws 'blocked' if blocked
        // If we get here, doctor isn’t blocked
      } catch (error: any) {
        if (error.message === 'blocked') {
          toast.error('Authentication failed. Please log in again.', {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
          await logoutDoctor();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          router.replace('/doctor/login?blocked=true');
        } else {
          toast.error('Authentication failed. Please log in again.', {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
          await logoutDoctor();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          router.replace('/doctor/login');
        }
      }
    };

    checkBlockedStatus();
    const interval = setInterval(checkBlockedStatus, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, router]);

  // Sidebar toggle
  const toggleSidebar = () => setIsSidebarOpen(open => !open);

  // Profile dropdown outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await logoutDoctor();
      toast.success('Logged out successfully', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      router.replace('/doctor/login');
    } catch {
      toast.error('Logout failed', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  // Document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setDocuments(prev => [...prev, ...Array.from(files)]);
      toast.success('Documents selected successfully', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  // Loading state
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
          <SidebarItem icon={<Upload size={20}/>} label="Documents" isActive={activeTab==='documents'} isCollapsed={!isSidebarOpen} onClick={()=>setActiveTab('documents')} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none">
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
            <p className="text-gray-600">Here’s your overview for today.</p>
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
                          ? <span className="text-red-600 font-medium">Blocked</span> 
                          : <span className="text-green-600 font-medium">Active</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Documents</h2>
              <input
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"
              />
              <div className="mt-4">
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div key={index} className="text-gray-600 mb-2 flex items-center">
                      <FileText size={16} className="mr-2" /> {doc.name}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No documents uploaded yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800">Total Patients</h3>
                <p className="text-2xl font-bold text-purple-600">{patients.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800">Active Patients</h3>
                <p className="text-2xl font-bold text-green-600">{patients.filter(p => !p.blocked).length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800">Blocked Patients</h3>
                <p className="text-2xl font-bold text-red-600">{patients.filter(p => p.blocked).length}</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
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