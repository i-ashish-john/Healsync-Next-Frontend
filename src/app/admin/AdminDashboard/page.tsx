"use client";

import { useState, useEffect, useRef, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useAdminAuth } from '@/hooks/useAdminAuth'; // Correct hook
import {
  getAllPatients,
  getAllDoctors,
  toggleBlockUser,
  logoutAdmin,
} from '@/services/admin/adminService';
import { User, LogOut, Users, Stethoscope } from 'lucide-react';

interface UserRow {
  _id: string;
  email: string;
  role: string;
  blocked: boolean;
  name?: string;
}

export default function AdminDashboard() {
  const { loading, isAuthenticated, user } = useAdminAuth(); // Use useAdminAuth
  const router = useRouter();
  const [patients, setPatients] = useState<UserRow[]>([]);
  const [doctors, setDoctors] = useState<UserRow[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors'>('patients');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setPatients(await getAllPatients());
      setDoctors(await getAllDoctors());
    } catch (err: any) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(open => !open);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success('Logged out successfully', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      router.replace('/admin/AdminLogin');
    } catch {
      toast.error('Logout failed', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const handleToggleBlock = async (
    type: 'patients' | 'doctors',
    id: string,
    blocked: boolean
  ) => {
    try {
      await toggleBlockUser(type, id, blocked);
      toast.success(`User ${blocked ? 'unblocked' : 'blocked'} successfully`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${blocked ? 'unblock' : 'block'} user`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-purple-500 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold">{isSidebarOpen ? 'HealSync Admin' : 'HS'}</h1>
        </div>
        <div className="mt-6">
          <SidebarItem
            icon={<Users size={20} />}
            label="Manage Patients"
            isActive={activeTab === 'patients'}
            isCollapsed={!isSidebarOpen}
            onClick={() => setActiveTab('patients')}
          />
          <SidebarItem
            icon={<Stethoscope size={20} />}
            label="Manage Doctors"
            isActive={activeTab === 'doctors'}
            isCollapsed={!isSidebarOpen}
            onClick={() => setActiveTab('doctors')}
          />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileDropdownOpen(open => !open)} className="flex items-center text-gray-700">
                <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                  <User size={16} className="text-purple-500" />
                </div>
                {user?.name && (
                  <span className="ml-2 font-medium">{user.name.split(' ')[0]}</span>
                )}
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-purple-100">
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" /> Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Manage patients and doctors from the HealSync Admin Dashboard.</p>
          </div>

          {activeTab === 'patients' && (
            <ListTable
              items={patients}
              columns={['Email', 'Status', 'Action']}
              renderRow={patient => (
                <tr key={patient._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{patient.email}</td>
                  <td className="py-4 px-6">{patient.blocked ? 'Blocked' : 'Active'}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleBlock('patients', patient._id, patient.blocked)}
                      className={`px-4 py-2 rounded text-white ${patient.blocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {patient.blocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === 'doctors' && (
            <ListTable
              items={doctors}
              columns={['Name', 'Email', 'Status', 'Action']}
              renderRow={doctor => (
                <tr key={doctor._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{doctor.name}</td>
                  <td className="py-4 px-6">{doctor.email}</td>
                  <td className="py-4 px-6">{doctor.blocked ? 'Blocked' : 'Active'}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleBlock('doctors', doctor._id, doctor.blocked)}
                      className={`px-4 py-2 rounded text-white ${doctor.blocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {doctor.blocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              )}
            />
          )}
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

function ListTable<T>({
  items,
  columns,
  renderRow,
}: {
  items: T[];
  columns: string[];
  renderRow: (item: T) => JSX.Element;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>{columns.map(col => <th key={col} className="py-3 px-6">{col}</th>)}</tr>
        </thead>
        <tbody>{items.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarItem({icon, label, isActive, isCollapsed, onClick}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 ${
        isActive ? 'bg-purple-600 text-white' : 'text-white hover:bg-purple-600'
      } transition-colors duration-200`}
    >
      {icon}
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </button>
  );
}