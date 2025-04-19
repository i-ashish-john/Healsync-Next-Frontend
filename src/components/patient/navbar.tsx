"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm"
          : "bg-white dark:bg-zinc-900"
      }`}
    >
      <div className="max-w-[1108px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">HealSync</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center space-x-6">
            <Link href="/services" className="text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
              Services
            </Link>
            <Link href="/doctors" className="text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
              Find Doctors
            </Link>
            <Link href="/appointments" className="text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
              Appointments
            </Link>
            <Link href="/about" className="text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
              Contact
            </Link>
          </div>
        </div>

        {/* Theme Toggle Button */}
        {/* <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5 text-amber-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-zinc-700" />
          )}
        </button> */}

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 rounded-md text-zinc-700 dark:text-zinc-300"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>

    </nav>
  );
}
