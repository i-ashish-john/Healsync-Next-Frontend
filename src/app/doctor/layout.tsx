"use client";

import { Provider } from "react-redux";
import type { ReactNode } from "react";
import doctorStore from "@/store/doctor/DoctorAuthStore";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={doctorStore}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}