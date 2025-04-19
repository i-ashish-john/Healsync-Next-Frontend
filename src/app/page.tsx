"use client";

import {
  ArrowRightIcon,
  CalendarIcon,
  MessageSquareIcon,
  ShieldIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";

import Link from "next/link";
import Navbar from "../components/patient/navbar";
import { Button } from "../components/ui/btt";
import { Card, CardContent } from "../components/ui/card";
import { useTheme } from "../context/ThemeContext";
import {ThemeProvider}  from "../context/ThemeContext"

// Feature data for mapping
const features = [
  {
    icon: (
      <UsersIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
    ),
    title: "Find Your Doctor",
    description:
      "Browse through departments and find specialized doctors that match your healthcare needs",
  },
  {
    icon: (
      <CalendarIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
    ),
    title: "Easy Appointments",
    description:
      "Book appointments with just a few clicks and manage your schedule efficiently",
  },
  {
    icon: (
      <MessageSquareIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
    ),
    title: "Secure Chat",
    description:
      "Chat directly with your healthcare provider after booking your appointment",
  },
  {
    icon: (
      <VideoIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
    ),
    title: "Video Consultations",
    description:
      "Have face-to-face consultations with your doctor from the comfort of your home",
  },
  {
    icon: (
      <ShieldIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
    ),
    title: "Protected Health Data",
    description:
      "Your health information is encrypted and securely stored with us",
  },
  {
    icon: (
      <UsersIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
    ),
    title: "Patient Reviews",
    description:
      "Read honest reviews from other patients to make informed decisions",
  },
];

export default function Home() {
 

  return (
    <>
    <ThemeProvider>
    {/* useTheme(); */}
    <Navbar />

    <div className="flex flex-col w-full min-h-screen">
      
      <div className="flex flex-row justify-center w-full pt-16">
        <div className="w-full max-w-[1108px]">
          <div className="relative hero-section py-20">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center mb-24 px-6">
              <div className="theme-badge px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                Healthcare made simple
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight [font-family:'Inter',Helvetica]">
                Welcome to{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  HealSync
                </span>
              </h1>

              <p className="max-w-[710px] text-xl text-gray-600 dark:text-gray-300 text-center mb-12 [font-family:'Inter',Helvetica] leading-relaxed">
                Connect with top healthcare professionals and manage your health
                journey seamlessly
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/patient/signup">
                  <Button className="h-12 px-8 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-[10px] [font-family:'Inter',Helvetica] font-medium text-lg shadow-md hover:shadow-lg transition-all">
                    Login as Patient
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/doctor/login">
                  <Button
                    variant="outline"
                    className="h-12 px-8 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-[10px] [font-family:'Inter',Helvetica] font-medium text-lg transition-all"
                  >
                    Login as Doctor
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-24 px-6">
              <div className="max-w-lg mx-auto text-center mb-16">
                <span className="theme-badge px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                  Our Features
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 [font-family:'Inter',Helvetica]">
                  Why Choose HealSync?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 [font-family:'Inter',Helvetica]">
                  Experience healthcare like never before with our comprehensive
                  set of features
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="card-container rounded-xl border-zinc-200 dark:border-zinc-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-purple-200 dark:hover:border-purple-800"
                  >
                    <CardContent className="p-8">
                      <div className="mb-6 bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg inline-block">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 [font-family:'Inter',Helvetica]">
                        {feature.title}
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-300 [font-family:'Inter',Helvetica] leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section rounded-3xl p-12 md:p-16 mx-6 text-center shadow-lg border">
              <div className="theme-badge px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                Get Started Today
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 [font-family:'Inter',Helvetica]">
                Ready to take control of your health?
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-[751px] mx-auto [font-family:'Inter',Helvetica] leading-relaxed">
                Join thousands of patients who have improved their healthcare
                experience with HealSync
              </p>

              <Link href="/patient/signup">
                <Button className="h-12 px-8 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-[10px] [font-family:'Inter',Helvetica] font-medium text-lg shadow-md hover:shadow-lg transition-all">
                  Explore Dashboard
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
    </ThemeProvider>
    </>
  );
}
