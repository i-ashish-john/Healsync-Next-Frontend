"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";

import { Provider } from 'react-redux';
import { ReactNode } from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { Toaster } from 'react-hot-toast';
import store from "@/store/patient/authStore";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider initialTheme="light">
            {children}
            <Toaster />
            <ToastContainer position="top-right" autoClose={5000} />
          </ThemeProvider>
        </body>
      </html>
    </Provider>
  );
}