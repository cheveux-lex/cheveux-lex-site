"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col">
        <AdminTopbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-cream/30 px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
