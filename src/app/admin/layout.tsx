"use client";

import { Provider } from "react-redux";
import adminStore from "@/store/admin/adminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={adminStore}>
      {children}
    </Provider>
  );
}