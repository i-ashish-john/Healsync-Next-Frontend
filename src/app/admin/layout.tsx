"use client";

import { Provider } from "react-redux";
import adminStore from "@/store/admin/adminStore";
// import "./admin.css";    // if you have admin‐specific globals

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={adminStore}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}