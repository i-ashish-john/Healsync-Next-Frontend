"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getCurrentUser } from "../../../services/patient/authServices";
import { UserData } from "../../../types/index";
import Link from "next/link";
import { Bell, Check, Calendar, User, Home, Clock, FileText, Activity } from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState("J");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  // Dummy data for dashboard components
  const upcomingAppointments = [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "April 18, 2025", time: "10:30 AM", status: "confirmed" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Dermatologist", date: "April 22, 2025", time: "2:15 PM", status: "pending" }
  ];
  
  const healthMetrics = [
    { label: "Blood Pressure", value: "120/80", trend: "stable" },
    { label: "Heart Rate", value: "72 bpm", trend: "improving" },
    { label: "Weight", value: "68 kg", trend: "stable" }
  ];
  
  const medications = [
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", remaining: 12 },
    { name: "Vitamin D", dosage: "1000 IU", frequency: "Once daily", remaining: 30 }
  ];

  return (
    <ProtectedRoute>
          {/* <div className="min-h-screen bg-white dark:bg-gray-900 flex">  */}

      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-700">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300">HealSync</span>
              </Link>
              
              <nav className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md bg-gray-100 hover:bg-purple-100 transition-colors duration-200"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  href="/appointments"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Appointments
                </Link>
                <Link
                  href="/doctors"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-1" />
                  Doctors
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-purple-600 relative p-1 rounded-full hover:bg-gray-100 transition-all duration-200">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <div className="h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white font-medium cursor-pointer transition-colors duration-200">
                {userName}
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-6 px-4 flex-grow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments Card */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Upcoming Appointments
                </h2>
                <Link href="/appointments" className="text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{apt.doctor}</p>
                        <p className="text-sm text-gray-600">{apt.specialty}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {apt.date}, {apt.time}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors duration-200">
                Schedule New Appointment
              </button>
            </div>
            
            {/* Health Metrics Card */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  Health Metrics
                </h2>
                <Link href="/health" className="text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200">
                  View History
                </Link>
              </div>
              
              <div className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-700">{metric.label}</p>
                      <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
                    </div>
                    <div className={`flex items-center text-sm ${
                      metric.trend === 'improving' ? 'text-green-600' : 
                      metric.trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {metric.trend === 'improving' && <span className="flex items-center">Improving <Activity className="ml-1 h-4 w-4" /></span>}
                      {metric.trend === 'declining' && <span className="flex items-center">Declining <Activity className="ml-1 h-4 w-4" /></span>}
                      {metric.trend === 'stable' && <span className="flex items-center">Stable <Activity className="ml-1 h-4 w-4" /></span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors duration-200">
                Update Health Data
              </button>
            </div>
            
            {/* Medications Card */}
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Current Medications
                </h2>
                <Link href="/medications" className="text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        med.remaining > 7 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {med.remaining} days left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-md font-medium transition-colors duration-200">
                Request Refill
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Book Appointment</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                <FileText className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Medical Records</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                <Activity className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Track Health</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                <User className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Find Doctor</span>
              </button>
            </div>
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-4 px-4 mt-auto">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 HealSync. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">Terms of Service</Link>
              <Link href="/help" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">Help Center</Link>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}